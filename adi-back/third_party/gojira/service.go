package gojira

import (
	"adi-back/internal/consts/envconst"
	"adi-gojira/pkg/gjservice"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type Service interface {
	// GetIssues busca as issues pelos parâmetros passados.
	GetIssues(parameters BuildJQLParams, fields []string) (data gjservice.SearchByJQLPayload, JQL string, err error)
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

func (s serviceImpl) GetIssues(parameters BuildJQLParams, fields []string) (
	data gjservice.SearchByJQLPayload,
	JQL string,
	err error,
) {
	JQL = buildJQL(parameters, fields)
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
		c := make(chan gjservice.SearchByJQLPayload)
		defer close(c)

		totalIssues := float64(data.Total) // data.Total
		loops := totalIssues / float64(maxResults)
		startAt := 100

		// Evitar requisição extra
		if int(totalIssues)%startAt == 0 {
			loops--
		}

		for i := 1; i <= int(loops); i++ {
			go s.getIssuesAsync(c, params, startAt*i)
		}

		for i := 0; i < int(loops); i++ {
			v := <-c
			data.Issues = append(data.Issues, v.Issues...)
		}
	}

	return
}

// getIssuesAsync busca de forma assíncrona as demais issues no JIRA.
func (s serviceImpl) getIssuesAsync(
	c chan gjservice.SearchByJQLPayload,
	params map[string]string,
	startAt int,
) {
	params["startAt"] = strconv.Itoa(startAt)

	respose, err := s.gjService.SearchByJQL(params)
	if err != nil {
		fmt.Println("ERRO NA REQUISIÇÃO DO JQL")
		c <- gjservice.SearchByJQLPayload{}
	}

	c <- respose
}
