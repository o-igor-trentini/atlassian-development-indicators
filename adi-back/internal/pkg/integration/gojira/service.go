package gojira

import (
	"adi-back/internal/consts/envconst"
	"adi-gojira/pkg/gjservice"
	"net/http"
	"os"
	"strconv"
	"time"
)

type Service interface {
	// GetIssues busca as issues pelos parâmetros passados.
	GetIssues(parameters BuildJQLParams) (data gjservice.SearchByJQLPayload, JQL string, err error)
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

func (s serviceImpl) GetIssues(parameters BuildJQLParams) (data gjservice.SearchByJQLPayload, JQL string, err error) {
	JQL = buildJQL(parameters)

	queryParameters := map[string]string{
		"jql":        JQL,
		"fields":     "created",
		"maxResults": "100",
		"startAt":    "0",
	}

	if parameters.Period.Type == ResolvedPeriodType {
		queryParameters["fields"] = "resolutiondate"
	}

	data, err = s.helpGetByPeriodType(queryParameters)

	return
}

// helpGetByPeriodType executa as ações genéricas usadas em todos os GetPeriodType
func (s serviceImpl) helpGetByPeriodType(queryParameters map[string]string) (
	data gjservice.SearchByJQLPayload,
	err error,
) {
	response, err := s.gjService.SearchByJQL(queryParameters)
	if err != nil {
		return data, err
	}

	data = response

	if uint(len(data.Issues)) < data.Total {
		startAt := 0

		for {
			startAt += 100
			queryParameters["startAt"] = strconv.Itoa(startAt)

			response, err = s.gjService.SearchByJQL(queryParameters)
			if err != nil {
				return data, err
			}

			data.Issues = append(data.Issues, response.Issues...)

			if uint(len(data.Issues)) == data.Total {
				break
			}
		}
	}

	return
}
