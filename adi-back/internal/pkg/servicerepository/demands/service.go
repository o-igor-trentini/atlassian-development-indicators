package demands

import (
	"adi-back/internal/pkg/adiutils/udate"
	"adi-back/internal/pkg/adiutils/uslice"
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

	res.YearMonthRange = udate.GetYearMonthBetweenDates(params.Period.Range.From, params.Period.Range.Until)

	params.Period.Type = gojira.CreatedPeriodType
	go s.asyncGetIssues(ch, params, res.YearMonthRange)

	params.Period.Type = gojira.ResolvedPeriodType
	go s.asyncGetIssues(ch, params, res.YearMonthRange)

	params.Period.Type = gojira.PendingPeriodType
	go s.asyncGetIssues(ch, params, res.YearMonthRange)

	issues := []IssuesByPeriodDTO{<-ch, <-ch, <-ch}
	for _, v := range issues {
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
	}

	if len(errors) > 0 {
		return res, fmt.Errorf("%+v", errors)
	}

	return res, nil
}

// asyncGetIssues realiza a busca de forma assíncrona na API do Jira.
func (s serviceImpl) asyncGetIssues(
	c chan IssuesByPeriodDTO,
	params gojira.BuildJQLParams,
	monthKeys []string,
) {
	issues, JQL, err := s.gojiraService.GetIssues(params)
	if err != nil {
		c <- IssuesByPeriodDTO{
			Type:  params.Period.Type,
			Data:  IssuesByPeriodData{},
			Error: err,
		}
		return
	}

	result, err := s.handleGetIssues(issues, params.Period.Type, monthKeys)
	if err != nil {
		c <- IssuesByPeriodDTO{
			Type:  params.Period.Type,
			Data:  IssuesByPeriodData{},
			Error: err,
		}
		return
	}

	c <- IssuesByPeriodDTO{
		Type: params.Period.Type,
		Data: IssuesByPeriodData{
			Values: result,
			Total:  issues.Total,
		},
		JQL:   JQL,
		Error: nil,
	}
}

// handleGetIssues formata os dados retornados pelo Jira dividindo em issue por ano/mês.
func (s serviceImpl) handleGetIssues(
	payload gjservice.SearchByJQLPayload,
	periodType gojira.PeriodType,
	monthsKeys []string,
) ([]uint, error) {
	values := make([]uint, len(monthsKeys))

	for _, v := range payload.Issues {
		strDate := v.Fields.Created
		if periodType == gojira.ResolvedPeriodType {
			strDate = *v.Fields.ResolutionDate
		}

		cutedStrDate, _, _ := strings.Cut(strDate, "T")

		date, err := time.Parse("2006-01-02", cutedStrDate)
		if err != nil {
			return values, err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if i := uslice.Index(monthsKeys, key); i != -1 {
			values[i] += 1
		}
	}

	return values, nil
}
