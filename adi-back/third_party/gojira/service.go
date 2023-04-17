package gojira

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/pkg/adiutils/uchan"
	"adi-back/internal/pkg/adiutils/umap"
	"github.com/o-igor-trentini/adi-gojira/pkg/gjservice"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Service interface {
	// GetIssues busca as issues pelos parâmetros passados.
	GetIssues(
		wg *sync.WaitGroup,
		ch chan uchan.ChannelResponse[GetIssuesChannelResponse],
		parameters BuildJQLParams,
		fields []string,
		t PeriodType,
	)
}

type serviceImpl struct {
	gjService gjservice.Client
}

// NewService instância as funções que interagem com a biblioteca adi-gojira.
func NewService() Service {
	httpClient := &http.Client{Timeout: time.Duration(10) * time.Second}

	// TODO: Validar passar valor por variável
	developerCustomField := "Desenvolvedor"

	config := gjservice.Config{
		BaseURL:      os.Getenv(envconst.JiraApiBaseUrl),
		JiraUsername: os.Getenv(envconst.JiraApiUsername),
		JiraToken:    os.Getenv(envconst.JiraApiToken),
		HTTPClient:   *httpClient,
		CustomFields: gjservice.ConfigCustomFields{
			Developer: &developerCustomField,
		},
	}

	gjService := *gjservice.NewClient(config)
	return &serviceImpl{gjService}
}

func (s serviceImpl) GetIssues(
	wg *sync.WaitGroup,
	ch chan uchan.ChannelResponse[GetIssuesChannelResponse],
	parameters BuildJQLParams,
	fields []string,
	t PeriodType,
) {
	defer wg.Done()

	var r = func(data gjservice.SearchByJQLPayload, JQL string, err error) {
		ch <- uchan.ChannelResponse[GetIssuesChannelResponse]{
			Data: GetIssuesChannelResponse{
				JQL:        JQL,
				Issues:     data,
				PeriodType: t,
			},
			Error: err,
		}
	}

	JQL := buildJQL(parameters, &t)
	maxResults := 100
	params := map[string]string{
		"jql":        JQL,
		"maxResults": strconv.Itoa(maxResults),
		"startAt":    "0",
		"fields":     strings.Join(fields, ","),
	}

	response, err := s.gjService.SearchByJQL(params)
	if err != nil {
		r(response, JQL, err)
		return
	}

	if uint(len(response.Issues)) < response.Total {
		totalIssues := int(response.Total)
		loops := totalIssues / maxResults
		startAt := maxResults

		// Evitar requisição extra
		if totalIssues%startAt == 0 {
			loops--
		}

		var wg sync.WaitGroup
		wg.Add(loops)
		c := make(chan uchan.ChannelResponse[gjservice.SearchByJQLPayload], loops)

		go func() {
			wg.Wait()
			close(c)
		}()

		for i := 1; i <= loops; i++ {
			go s.getIssuesAsync(&wg, c, params, startAt*i)
		}

		wg.Wait()

		for v := range c {
			if v.Error != nil {
				r(response, JQL, v.Error)
				return
			}

			response.Issues = append(response.Issues, v.Data.Issues...)
		}
	}

	r(response, JQL, nil)
}

// getIssuesAsync busca de forma assíncrona as demais issues no JIRA.
func (s serviceImpl) getIssuesAsync(
	wg *sync.WaitGroup,
	c chan uchan.ChannelResponse[gjservice.SearchByJQLPayload],
	params map[string]string,
	startAt int,
) {
	defer wg.Done()

	p := umap.Copy(params)
	p["startAt"] = strconv.Itoa(startAt)

	respose, err := s.gjService.SearchByJQL(p)
	c <- uchan.ChannelResponse[gjservice.SearchByJQLPayload]{
		Data:  respose,
		Error: err,
	}
}
