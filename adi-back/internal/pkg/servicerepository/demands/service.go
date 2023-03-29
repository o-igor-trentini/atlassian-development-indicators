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
		gjconsts.IssueFieldIssueType,
		gjconsts.IssueFieldProject,
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

	response, err := s.handleGetIssues(
		createdIssues,
		resolvedIssues,
		params.Projects,
		monthKeys,
		skippedFieldsInPendants,
	)
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
	projects, monthsKeys, skippedFieldsInPendants []string,
) (GetIssuesByPeriodResponse, error) {
	var add = func(rangeValues []int, strDate string) error {
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
	monthsLength := len(monthsKeys)

	response.Created.PeriodValues = make([]int, monthsLength)
	response.Pending.PeriodValues = make([]int, monthsLength)
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
	response.Resolved.PeriodValues = make([]int, monthsLength)
	response.ProjectDetails = make([]IssuesByProject, len(projects))
	for _, v := range resolvedPayload.Issues {
		fields := v.Fields

		// adiciona o projeto na listagem de projetos
		projectIndex := uslice.Index(response.Projects, fields.Project.Name)
		if projectIndex == -1 {
			response.Projects = append(response.Projects, fields.Project.Name)
			projectIndex = len(response.Projects) - 1
		}

		// adiciona o tipo da issue na listagem de tipos de issues
		issueTypeIndex := uslice.Index(response.ProjectDetails[projectIndex].IssuesTypes, fields.IssueType.Name)
		if issueTypeIndex == -1 {
			response.ProjectDetails[projectIndex].IssuesTypes = append(
				response.ProjectDetails[projectIndex].IssuesTypes,
				fields.IssueType.Name,
			)
			issueTypeIndex = len(response.ProjectDetails[projectIndex].IssuesTypes) - 1
		}

		// total de tarefas
		response.ProjectDetails[projectIndex].Total++

		// total de tarefas por tipo
		//
		// verifica se o tamanho da lista de quantidade total por tipo é compatível com o tamanho
		// da lista de tipos de issues
		if len(response.ProjectDetails[projectIndex].TotalByType)-1 < issueTypeIndex {
			response.ProjectDetails[projectIndex].TotalByType = append(response.ProjectDetails[projectIndex].TotalByType, 0)
		}

		response.ProjectDetails[projectIndex].TotalByType[issueTypeIndex]++

		if err := add(response.Resolved.PeriodValues, *fields.ResolutionDate); err != nil {
			return response, err
		}
	}

	return response, nil
}
