package demands

import (
	"adi-back/internal/pkg/adiutils/uslice"
	"adi-back/internal/pkg/adiutils/utime"
	"adi-back/third_party/gojira"
	"adi-gojira/pkg/gjconsts"
	"adi-gojira/pkg/gjservice"
	"fmt"
	"strings"
	"time"
)

type Service interface {
	// GetIssuesByPeriod busca as issues criadas, resolvidas e pendentes divididas por ano/mês.
	GetIssuesByPeriod(params gojira.BuildJQLParams) (GetIssuesByPeriodResponse, error)
}

type serviceImpl struct {
	gojiraService gojira.Service
}

// NewService instância o serviço das demandas
func NewService(gojiraService gojira.Service) Service {
	return &serviceImpl{gojiraService}
}

func (s serviceImpl) GetIssuesByPeriod(params gojira.BuildJQLParams) (GetIssuesByPeriodResponse, error) {
	fields := []string{gjconsts.IssueFieldCreaetd, gjconsts.IssueFieldResolutionDate}

	issues, JQL, err := s.gojiraService.GetIssues(params, fields)
	if err != nil {
		// TODO: Tipo de erro personalizado
		fmt.Println(err)
		return GetIssuesByPeriodResponse{}, nil
	}

	monthKeys := utime.GetYearMonthBetweenDates(params.Period.Range.From, params.Period.Range.Until)

	response, _ := s.handleGetIssues(issues, monthKeys)

	response.JQL = JQL
	response.Periods = monthKeys

	return response, nil
}

// handleGetIssues formata os dados retornados pelo Jira dividindo em issue por ano/mês.
func (s serviceImpl) handleGetIssues(
	payload gjservice.SearchByJQLPayload,
	monthsKeys []string,
) (GetIssuesByPeriodResponse, error) {
	var add = func(rangeValues []uint, strDate string) error {
		cutedStrDate, _, _ := strings.Cut(strDate, "T")

		date, err := time.Parse("2006-01-02", cutedStrDate)
		if err != nil {
			return err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if i := uslice.Index(monthsKeys, key); i != -1 {
			rangeValues[i] += 1
		}

		return nil
	}

	var response GetIssuesByPeriodResponse
	response.Created.PeriodValues = make([]uint, len(monthsKeys))
	response.Resolved.PeriodValues = make([]uint, len(monthsKeys))
	response.Pending.PeriodValues = make([]uint, len(monthsKeys))
	response.Analytics.ProgressPerPeriod = make([]float32, len(monthsKeys))

	for _, v := range payload.Issues {
		fields := v.Fields

		// created
		if err := add(response.Created.PeriodValues, fields.Created); err != nil {
			return response, err
		}

		// resolved
		if fields.ResolutionDate != nil {
			if err := add(response.Resolved.PeriodValues, *fields.ResolutionDate); err != nil {
				return response, err
			}
		} else { // pending
			if err := add(response.Pending.PeriodValues, fields.Created); err != nil {
				return response, err
			}
		}
	}

	for i := range monthsKeys {
		response.Created.Total += response.Created.PeriodValues[i]
		response.Resolved.Total += response.Resolved.PeriodValues[i]
		response.Pending.Total += response.Pending.PeriodValues[i]

		response.Analytics.ProgressPerPeriod[i] += float32(response.Resolved.PeriodValues[i]) / float32(response.Created.PeriodValues[i]) * 100
	}

	response.Analytics.CreatedTotal = response.Created.Total
	response.Analytics.ResolvedTotal = response.Resolved.Total
	response.Analytics.PendingTotal = response.Pending.Total
	response.Analytics.OverallProgress = float32(response.Resolved.Total) / float32(response.Created.Total) * 100

	return response, nil
}
