package demands

import (
	"adi-back/internal/pkg/adiutils/uchan"
	"adi-back/internal/pkg/adiutils/uslice"
	"adi-back/internal/pkg/adiutils/utime"
	"adi-back/third_party/gojira"
	"adi-gojira/pkg/gjconsts"
	"adi-gojira/pkg/gjservice"
	"fmt"
	"strings"
	"sync"
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
	var wg sync.WaitGroup
	wg.Add(2)
	c := make(chan uchan.ChannelResponse[gojira.GetIssuesChannelResponse], 2)

	go func() {
		wg.Wait()
		close(c)
	}()

	fields := []string{
		gjconsts.IssueFieldCreaetd,
		gjconsts.IssueFieldResolutionDate,
		gjconsts.IssueFieldStatus,
	}

	go s.gojiraService.GetIssues(&wg, c, params, fields, gojira.CreatedPeriodType)
	go s.gojiraService.GetIssues(&wg, c, params, fields, gojira.ResolvedPeriodType)

	wg.Wait()

	var createdIssues, resolvedIssues gjservice.SearchByJQLPayload
	var createdJQL, resolvedJQL string
	for v := range c {
		if v.Data.PeriodType == gojira.CreatedPeriodType {
			createdIssues = v.Data.Issues
			createdJQL = v.Data.JQL
			continue
		}

		resolvedIssues = v.Data.Issues
		resolvedJQL = v.Data.JQL
	}

	monthKeys := utime.GetYearMonthBetweenDates(params.Period.Range.From, params.Period.Range.Until)
	// TODO: Pegar de uma configuração  (banco)
	skippedFieldsInPendants := []string{"00 - backlog", "backlog"}

	response, err := s.handleGetIssues(createdIssues, resolvedIssues, monthKeys, skippedFieldsInPendants)
	if err != nil {
		fmt.Println(err)
		return GetIssuesByPeriodResponse{}, nil
	}

	response.Periods = monthKeys
	response.Created.JQL = &createdJQL
	response.Resolved.JQL = &resolvedJQL

	response.DoAnalysis()

	return response, nil
}

// handleGetIssues formata os dados retornados pelo Jira dividindo em issue por ano/mês.
func (s serviceImpl) handleGetIssues(
	createdPayload, resolvedPayload gjservice.SearchByJQLPayload,
	monthsKeys, skippedFieldsInPendants []string,
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
	response.Pending.PeriodValues = make([]uint, len(monthsKeys))
	for _, v := range createdPayload.Issues {
		fields := v.Fields

		// created
		if err := add(response.Created.PeriodValues, fields.Created); err != nil {
			return response, err
		}

		// pending
		if !uslice.Contains(skippedFieldsInPendants, strings.ToLower(fields.Status.Name)) && fields.ResolutionDate == nil {
			if err := add(response.Pending.PeriodValues, fields.Created); err != nil {
				return response, err
			}
		}
	}

	// resolved
	response.Resolved.PeriodValues = make([]uint, len(monthsKeys))
	for _, v := range resolvedPayload.Issues {
		fields := v.Fields

		if err := add(response.Resolved.PeriodValues, *fields.ResolutionDate); err != nil {
			return response, err
		}
	}

	return response, nil
}
