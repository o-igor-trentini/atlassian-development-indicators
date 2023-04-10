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

	response.FixEmpty()
	response.DoAnalysis()

	return response, nil
}

// handleGetIssues formata os dados retornados pelo Jira dividindo em issue por ano/mês.
func (s serviceImpl) handleGetIssues(
	createdPayload, resolvedPayload gjservice.SearchByJQLPayload,
	projects, monthsKeys, skippedFieldsInPendants []string,
) (GetIssuesByPeriodResponse, error) {
	var addTotalByPeriod = func(s []int, strDate string) error {
		cutedStrDate, _, _ := strings.Cut(strDate, "T")

		date, err := time.Parse("2006-01-02", cutedStrDate)
		if err != nil {
			return err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if i := uslice.Index(monthsKeys, key); i != -1 {
			s[i] += 1
		}

		return nil
	}

	var addTotalByPeriodAndIssueType = func(s []map[string]int, strDate string, issueTypeIndex int) error {
		cutedStrDate, _, _ := strings.Cut(strDate, "T")

		date, err := time.Parse("2006-01-02", cutedStrDate)
		if err != nil {
			return err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if _, exist := s[issueTypeIndex][key]; exist {
			s[issueTypeIndex][key]++
		} else {
			s[issueTypeIndex][key] = 1
		}

		return nil
	}

	var response GetIssuesByPeriodResponse
	monthsLength := len(monthsKeys)
	projectsLength := len(projects)

	response.Created.PeriodValues = make([]int, monthsLength)
	response.Pending.PeriodValues = make([]int, monthsLength)
	for _, v := range createdPayload.Issues {
		fields := v.Fields

		// total created
		if err := addTotalByPeriod(response.Created.PeriodValues, fields.Created); err != nil {
			return response, err
		}

		// total pending
		if !uslice.Contains(skippedFieldsInPendants, strings.ToLower(fields.Status.Name)) && fields.ResolutionDate == nil {
			if err := addTotalByPeriod(response.Pending.PeriodValues, fields.Created); err != nil {
				return response, err
			}
		}
	}

	// resolved
	response.Resolved.PeriodValues = make([]int, monthsLength)
	response.Project.Projects = projects
	response.Project.ProjectsAvatars = make([]string, projectsLength)
	response.Project.IssuesDetailsByProject = make([]IssuesDetailsByProject, projectsLength)
	for _, v := range resolvedPayload.Issues {
		fields := v.Fields
		resolutionDate := *fields.ResolutionDate

		// adiciona o projeto na listagem de projetos
		projectIndex := uslice.Index(response.Project.Projects, fields.Project.Name)
		if projectIndex == -1 {
			pIndex := uslice.Index(response.Project.Projects, fields.Project.Key)
			projectIndex = pIndex

			response.Project.Projects[projectIndex] = fields.Project.Name
			response.Project.ProjectsAvatars[projectIndex] = fields.Project.AvatarUrls.Size48
		}

		// adiciona o tipo da issue na listagem de tipos de issues
		issueTypeIndex := uslice.Index(response.Project.IssuesTypes, fields.IssueType.Name)
		if issueTypeIndex == -1 {
			response.Project.IssuesTypes = append(
				response.Project.IssuesTypes,
				fields.IssueType.Name,
			)
			issueTypeIndex = len(response.Project.IssuesTypes) - 1
		}

		// total de tarefas por projeto
		response.Project.IssuesDetailsByProject[projectIndex].Total++

		// total de tarefas por tipo
		//
		// verifica se o tamanho da lista de quantidade total por tipo
		// e se o tamanho da lista de quantidade por tipo e período
		// é compatível com o tamanho da lista de tipos de issues
		if len(response.Project.IssuesDetailsByProject[projectIndex].TotalByType) < len(response.Project.IssuesTypes) {
			for len(response.Project.IssuesDetailsByProject[projectIndex].TotalByType) < len(response.Project.IssuesTypes) {
				// total por tipo
				response.Project.IssuesDetailsByProject[projectIndex].TotalByType = append(
					response.Project.IssuesDetailsByProject[projectIndex].TotalByType,
					0,
				)

				// total por tipo e período
				response.Project.IssuesDetailsByProject[projectIndex].TotalByTypeAndPeriod = append(
					response.Project.IssuesDetailsByProject[projectIndex].TotalByTypeAndPeriod,
					make(map[string]int),
				)
			}
		}

		// total por tipo
		response.Project.IssuesDetailsByProject[projectIndex].TotalByType[issueTypeIndex]++

		// total por projeto por período
		if len(response.Project.IssuesDetailsByProject[projectIndex].TotalByPeriod) == 0 {
			response.Project.IssuesDetailsByProject[projectIndex].TotalByPeriod = make([]int, monthsLength)
		}

		if err := addTotalByPeriod(
			response.Project.IssuesDetailsByProject[projectIndex].TotalByPeriod,
			resolutionDate,
		); err != nil {
			return response, err
		}

		// total de tarefas por tipo e período
		if err := addTotalByPeriodAndIssueType(
			response.Project.IssuesDetailsByProject[projectIndex].TotalByTypeAndPeriod,
			resolutionDate,
			issueTypeIndex,
		); err != nil {
			return response, err
		}

		// total resolved
		if err := addTotalByPeriod(response.Resolved.PeriodValues, resolutionDate); err != nil {
			return response, err
		}
	}

	return response, nil
}
