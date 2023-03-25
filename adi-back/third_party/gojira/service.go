package gojira

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/pkg/adiutils/umap"
	"adi-gojira/pkg/gjservice"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Service interface {
	// GetIssues busca as issues pelos parâmetros passados.
	GetIssues(parameters BuildJQLParams, fields []string, t PeriodType) (data gjservice.SearchByJQLPayload, JQL string, err error)
}

type serviceImpl struct {
	gjService gjservice.Client
}

// NewService instância as funções que interagem com a biblioteca adi-gojira.
func NewService() Service {
	httpClient := &http.Client{Timeout: time.Duration(10) * time.Second}

	gjService := *gjservice.NewClient(
		os.Getenv(envconst.JiraApiBaseUrl),
		os.Getenv(envconst.JiraApiUsername),
		os.Getenv(envconst.JiraApiToken),
		*httpClient,
	)

	return &serviceImpl{gjService}
}

func (s serviceImpl) GetIssues(parameters BuildJQLParams, fields []string, t PeriodType) (
	data gjservice.SearchByJQLPayload,
	JQL string,
	err error,
) {
	JQL = buildJQL(parameters, &t)
	maxResults := 100

	params := map[string]string{
		"jql":        JQL,
		"maxResults": strconv.Itoa(maxResults),
		"startAt":    "0",
		"fields":     strings.Join(fields, ","),
	}

	response, err := s.gjService.SearchByJQL(params)
	if err != nil {
		return data, JQL, err
	}

	data = response

	if uint(len(data.Issues)) < data.Total {
		totalIssues := int(data.Total)
		loops := totalIssues / maxResults
		startAt := maxResults

		// Evitar requisição extra
		if totalIssues%startAt == 0 {
			loops--
		}

		var wg sync.WaitGroup
		wg.Add(loops)
		c := make(chan gjservice.SearchByJQLPayload, loops)

		go func() {
			wg.Wait()
			close(c)
		}()

		for i := 1; i <= loops; i++ {
			go s.getIssuesAsync(&wg, c, params, startAt*i)
		}

		wg.Wait()

		for v := range c {
			data.Issues = append(data.Issues, v.Issues...)
		}
	}

	return
}

// getIssuesAsync busca de forma assíncrona as demais issues no JIRA.
func (s serviceImpl) getIssuesAsync(
	wg *sync.WaitGroup,
	c chan gjservice.SearchByJQLPayload,
	params map[string]string,
	startAt int,
) {
	defer wg.Done()

	p := umap.Copy(params)
	p["startAt"] = strconv.Itoa(startAt)

	respose, err := s.gjService.SearchByJQL(p)
	if err != nil {
		c <- gjservice.SearchByJQLPayload{}
	}

	c <- respose
}
