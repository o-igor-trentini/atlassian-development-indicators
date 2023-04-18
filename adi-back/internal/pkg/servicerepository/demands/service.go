package demands

import (
	"adi-back/internal/pkg/adiutils"
	"adi-back/internal/services/log/adilog"
	"adi-back/third_party/gojira"
	"errors"
	"github.com/o-igor-trentini/adi-gojira/pkg/gjconsts"
	"github.com/o-igor-trentini/adi-gojira/pkg/gjservice"
	"github.com/o-igor-trentini/adi-goutils/pkg/uchan"
	"github.com/o-igor-trentini/adi-goutils/pkg/uslice"
	"strings"
	"sync"
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

	// TODO: Alterar para pegar do cadastro de projetos
	customFields := gjservice.CustomFields{
		Developer: []string{
			"customfield_10118",
			"customfield_10128",
		},
	}

	fields := []string{
		gjconsts.IssueFieldCreaetd,
		gjconsts.IssueFieldResolutionDate,
		gjconsts.IssueFieldStatus,
		gjconsts.IssueFieldIssueType,
		gjconsts.IssueFieldProject,
	}

	fields = append(fields, customFields.Developer...)

	go s.gojiraService.GetIssues(&wg, c, params, fields, customFields, gojira.CreatedPeriodType)
	go s.gojiraService.GetIssues(&wg, c, params, fields, customFields, gojira.ResolvedPeriodType)

	wg.Wait()

	var createdIssues, resolvedIssues gjservice.SearchByJQLPayload
	var createdJQL, resolvedJQL string
	var errs []string
	for v := range c {
		if v.Error != nil {
			errs = append(errs, v.Error.Error())
			continue
		}

		if len(errs) > 0 {
			continue
		}

		if v.Data.PeriodType == gojira.CreatedPeriodType {
			createdIssues = v.Data.Issues
			createdJQL = v.Data.JQL
			continue
		}

		resolvedIssues = v.Data.Issues
		resolvedJQL = v.Data.JQL
	}

	if len(errs) > 0 {
		return GetIssuesByPeriodResponse{}, errors.New(strings.Join(errs, "; "))
	}

	// TODO: Pegar de uma configuração de campos para ignorar quando pendente (banco)
	skippedFieldsInPendants := []string{"00 - backlog", "backlog"}
	monthKeys := adiutils.GetYearMonthBetweenDates(params.Period.Range.From, params.Period.Range.Until)

	response, err := s.handleGetIssues(
		createdIssues,
		resolvedIssues,
		params.Projects,
		monthKeys,
		skippedFieldsInPendants,
	)
	if err != nil {
		adilog.Logger.Error(err.Error())
		return GetIssuesByPeriodResponse{}, err
	}

	response.Created.JQL = &createdJQL
	response.Resolved.JQL = &resolvedJQL

	return response, nil
}

// handleGetIssues formata os dados retornados pelo Jira dividindo em issue por ano/mês.
func (s serviceImpl) handleGetIssues(
	createdPayload, resolvedPayload gjservice.SearchByJQLPayload,
	projects, monthsKeys, skippedFieldsInPendants []string,
) (GetIssuesByPeriodResponse, error) {
	var response GetIssuesByPeriodResponse
	response.Init(monthsKeys, projects)

	// criadas e pendentes
	for _, v := range createdPayload.Issues {
		fields := v.Fields

		if err := response.AddTotalByPeriod(response.Created.PeriodValues, fields.Created); err != nil {
			return response, err
		}

		if !uslice.Contains(skippedFieldsInPendants, strings.ToLower(fields.Status.Name)) && fields.ResolutionDate == nil {
			if err := response.AddTotalByPeriod(response.Pending.PeriodValues, fields.Created); err != nil {
				return response, err
			}
		}
	}

	// resolvidas
	for _, v := range resolvedPayload.Issues {
		fields := v.Fields
		resolutionDate := *fields.ResolutionDate

		projectIndex := response.AddProject(fields.Project)
		issueTypeIndex := response.AddIssueType(fields.IssueType)

		response.AddTotalByProject(projectIndex)
		response.ValidateTotalByTypeLength(projectIndex)
		response.AddTotalByType(projectIndex, issueTypeIndex)
		response.ValidateTotalByProjectByPeriodLength(projectIndex)

		if err := response.AddTotalByPeriod(
			response.Projects.IssuesByProject[projectIndex].TotalByPeriod,
			resolutionDate,
		); err != nil {
			return response, err
		}

		if err := response.AddTotalByPeriodAndIssueType(
			response.Projects.IssuesByProject[projectIndex].TotalByTypeAndPeriod,
			resolutionDate,
			issueTypeIndex,
		); err != nil {
			return response, err
		}

		if err := response.AddTotalByPeriod(response.Resolved.PeriodValues, resolutionDate); err != nil {
			return response, err
		}
	}

	response.FixEmpty()
	response.DoAnalysis()

	return response, nil
}
