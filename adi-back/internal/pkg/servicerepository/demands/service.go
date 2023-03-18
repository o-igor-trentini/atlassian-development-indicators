package demands

import (
	"adi-back/internal/pkg/integration/gojira"
	"adi-gojira/pkg/gjservice"
	"fmt"
	"strings"
	"time"
)

type Service interface {
	// GetCreatedVersusResolved busca as issues criadas, resolvidas e pendentes divididas por mês.
	GetCreatedVersusResolved(params gojira.BuildJQLParams) (GetCreatedVersusResolvedResponse, error)
}

type serviceImpl struct {
	gojiraService gojira.Service
}

// NewService instância o serviço das demandas
func NewService(gojiraService gojira.Service) Service {
	return &serviceImpl{gojiraService}
}

func (s serviceImpl) GetCreatedVersusResolved(params gojira.BuildJQLParams) (GetCreatedVersusResolvedResponse, error) {
	var res GetCreatedVersusResolvedResponse
	errors := make(map[string]string)
	ch := make(chan IssuesByPeriodDTO)
	defer close(ch)

	params.Period.Type = gojira.CreatedPeriodType
	go s.asyncGetIssues(ch, params)

	params.Period.Type = gojira.ResolvedPeriodType
	go s.asyncGetIssues(ch, params)

	params.Period.Type = gojira.PendingPeriodType
	go s.asyncGetIssues(ch, params)

	i := 0
	for v := range ch {
		// verifica se já teve 3 retornos (created, resolved, pending)
		if i == 2 {
			break
		}

		if v.Error != nil {
			errors[string(v.Type)] = v.Error.Error()
			continue
		}

		switch v.Type {
		case gojira.CreatedPeriodType:
			res.Created = v
		case gojira.ResolvedPeriodType:
			res.Resolved = v
		case gojira.PendingPeriodType:
			res.Pending = v
		}

		i++
	}

	if len(errors) > 0 {
		return res, fmt.Errorf("%+v", errors)
	}

	return res, nil
}

// asyncGetIssues realiza a busca de forma assíncrona na API do Jira.
func (s serviceImpl) asyncGetIssues(c chan IssuesByPeriodDTO, queryParameters gojira.BuildJQLParams) {
	issues, JQL, err := s.gojiraService.GetIssues(queryParameters)
	if err != nil {
		c <- IssuesByPeriodDTO{
			Type:  queryParameters.Period.Type,
			Data:  IssuesByPeriodData{},
			Error: err,
		}
		return
	}

	result, err := s.handleGetIssues(issues, queryParameters.Period.Type)
	if err != nil {
		c <- IssuesByPeriodDTO{
			Type:  queryParameters.Period.Type,
			Data:  IssuesByPeriodData{},
			Error: err,
		}
		return
	}

	c <- IssuesByPeriodDTO{
		Type: queryParameters.Period.Type,
		Data: IssuesByPeriodData{
			Result: result,
			Total:  issues.Total,
		},
		JQL:   JQL,
		Error: nil,
	}
}

// handleGetIssues formata os dados retornados pelo Jira dividindo em issue por ano/mês.
func (s serviceImpl) handleGetIssues(payload gjservice.SearchByJQLPayload, periodType gojira.PeriodType) (
	yearMonthCount map[string]uint,
	err error,
) {
	result := make(map[string]uint)

	for _, v := range payload.Issues {
		strDate := v.Fields.Created
		if periodType == gojira.ResolvedPeriodType {
			strDate = *v.Fields.ResolutionDate
		}

		cutedStrDate, _, _ := strings.Cut(strDate, "T")

		date, err := time.Parse("2006-01-02", cutedStrDate)
		if err != nil {
			return result, err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if v, exist := result[key]; exist {
			result[key] = v + 1
		} else {
			result[key] = 1
		}
	}

	yearMonthCount = result

	return
}
