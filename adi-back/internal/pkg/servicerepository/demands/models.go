package demands

import (
	"adi-back/internal/pkg/adiutils"
	"github.com/o-igor-trentini/adi-gojira/pkg/gjmodels"
	"github.com/o-igor-trentini/adi-goutils/pkg/uslice"
	"github.com/o-igor-trentini/adi-goutils/pkg/ustring"
	"strings"
)

type IssuesByPeriod struct {
	JQL          *string `json:"jql,omitempty"`
	Total        int     `json:"total"`
	PeriodValues []int   `json:"values"`
}

type IssuesAnalytics struct {
	OverallProgress   float64   `json:"overallProgress"`
	ProgressPerPeriod []float64 `json:"progressPerPeriod"`
	CreatedTotal      int       `json:"createdTotal"`
	ResolvedTotal     int       `json:"resolvedTotal"`
	// PendingTotal possui informação atemporal.
	PendingTotal int `json:"pendingTotal"`
}

type IssuesByProject struct {
	Total                int              `json:"total"`
	TotalByType          []int            `json:"totalByType"`
	TotalByPeriod        []int            `json:"totalByPeriod"`
	TotalByTypeAndPeriod []map[string]int `json:"totalByTypeAndPeriod"`
}

type IssuesByPeriodByProject struct {
	Names           []string          `json:"names"`
	Avatar          []string          `json:"avatars"`
	IssuesByProject []IssuesByProject `json:"issuesByProject"`
}

type IssuesByDeveloper struct {
}

type GetIssuesByPeriodResponse struct {
	Periods     []string        `json:"periods"`
	IssuesTypes []string        `json:"issuesTypes"`
	Analytics   IssuesAnalytics `json:"analytics"`
	Created     IssuesByPeriod  `json:"created"`
	Resolved    IssuesByPeriod  `json:"resolved"`
	// Pending possui informação temporal.
	Pending   IssuesByPeriod          `json:"pending"`
	Projects  IssuesByPeriodByProject `json:"projects"`
	Developer []IssuesByDeveloper     `json:"developers"`
}

// Init inicializa os slices e maps necessários para não ter access violation.
func (s *GetIssuesByPeriodResponse) Init(monthsKeys, projects []string) {
	monthsLength := len(monthsKeys)
	projectsLength := len(projects)

	s.Periods = monthsKeys

	s.Created.PeriodValues = make([]int, monthsLength)
	s.Pending.PeriodValues = make([]int, monthsLength)

	s.Resolved.PeriodValues = make([]int, monthsLength)

	s.Projects.Names = projects
	s.Projects.Avatar = make([]string, projectsLength)
	s.Projects.IssuesByProject = make([]IssuesByProject, projectsLength)
}

// FixEmpty padroniza os dados para terem o mesmo tamanho.
func (s *GetIssuesByPeriodResponse) FixEmpty() {
	issueTypes := s.IssuesTypes

	for detailKey, detail := range s.Projects.IssuesByProject {
		periodLength := len(s.Periods)
		totalByTypeLength := len(detail.TotalByType)

		// Adequa o tamanho do total de tarefas para um padrão
		if totalByTypeLength < len(issueTypes) {
			lenDiff := len(issueTypes) - totalByTypeLength

			initialIndex := totalByTypeLength - 1
			if initialIndex < 0 {
				initialIndex = 0
			}

			for i := initialIndex; i < lenDiff; i++ {
				detail.TotalByType = append(
					detail.TotalByType,
					0,
				)
			}
		}

		// Adequa o tamanho do total por período
		for _, period := range s.Periods {
			for issueTypeIndex := range issueTypes {
				// por período e tipo
				if len(detail.TotalByTypeAndPeriod) <= issueTypeIndex {
					detail.TotalByTypeAndPeriod = append(detail.TotalByTypeAndPeriod, make(map[string]int))
				}

				if _, exist := detail.TotalByTypeAndPeriod[issueTypeIndex][period]; !exist {
					detail.TotalByTypeAndPeriod[issueTypeIndex][period] = 0
				}
			}
		}

		if detail.Total == 0 {
			detail.TotalByType = make([]int, periodLength)
			detail.TotalByPeriod = make([]int, periodLength)
		}

		s.Projects.IssuesByProject[detailKey] = detail
	}
}

// DoAnalysis gera os dados gerais para evitar ficar manipulando os dados.
func (s *GetIssuesByPeriodResponse) DoAnalysis() {
	s.Analytics.ProgressPerPeriod = make([]float64, len(s.Periods))

	for i := range s.Periods {
		s.Created.Total += s.Created.PeriodValues[i]
		s.Resolved.Total += s.Resolved.PeriodValues[i]
		s.Pending.Total += s.Pending.PeriodValues[i]

		if s.Resolved.PeriodValues[i] > 0 && s.Created.PeriodValues[i] > 0 {
			s.Analytics.ProgressPerPeriod[i] += float64(s.Resolved.PeriodValues[i]) / float64(s.Created.PeriodValues[i]) * 100
		}
	}

	s.Analytics.CreatedTotal = s.Created.Total
	s.Analytics.ResolvedTotal = s.Resolved.Total
	s.Analytics.PendingTotal = s.Analytics.CreatedTotal - s.Analytics.ResolvedTotal

	if s.Resolved.Total > 0 && s.Created.Total > 0 {
		s.Analytics.OverallProgress = float64(s.Resolved.Total) / float64(s.Created.Total) * 100
	}
}

// AddTotalByPeriod aumenta o contador do total de tarefas feitas no período.
func (s *GetIssuesByPeriodResponse) AddTotalByPeriod(slice []int, strDate string) error {
	cutedStrDate, _, _ := strings.Cut(strDate, "T")

	date, err := ustring.ToDate(cutedStrDate)
	if err != nil {
		return err
	}

	key := adiutils.MakePeriodKey(date)

	if i := uslice.Index(s.Periods, key); i != -1 {
		slice[i] += 1
	}

	return nil

}

// AddTotalByPeriodAndIssueType aumenta o contador do total de tarefas do tipo feitas no período.
func (s *GetIssuesByPeriodResponse) AddTotalByPeriodAndIssueType(
	slice []map[string]int,
	strDate string,
	issueTypeIndex int,
) error {
	cutedStrDate, _, _ := strings.Cut(strDate, "T")

	date, err := ustring.ToDate(cutedStrDate)
	if err != nil {
		return err
	}

	key := adiutils.MakePeriodKey(date)

	if _, exist := slice[issueTypeIndex][key]; exist {
		slice[issueTypeIndex][key]++
	} else {
		slice[issueTypeIndex][key] = 1
	}

	return nil
}

// AddProject adiciona o projeto na listagem de projetos.
func (s *GetIssuesByPeriodResponse) AddProject(project gjmodels.Project) int {
	projectIndex := uslice.Index(s.Projects.Names, project.Name)

	if projectIndex == -1 {
		pIndex := uslice.Index(s.Projects.Names, project.Key)
		projectIndex = pIndex

		s.Projects.Names[projectIndex] = project.Name
		s.Projects.Avatar[projectIndex] = project.AvatarUrls.Size48
	}

	return projectIndex
}

// AddIssueType adiciona o tipo da issue na listagem de tipos de issues.
func (s *GetIssuesByPeriodResponse) AddIssueType(issueType gjmodels.IssueType) int {
	issueTypeIndex := uslice.Index(s.IssuesTypes, issueType.Name)

	if issueTypeIndex == -1 {
		s.IssuesTypes = append(
			s.IssuesTypes,
			issueType.Name,
		)
		issueTypeIndex = len(s.IssuesTypes) - 1
	}

	return issueTypeIndex
}

// AddTotalByProject aumenta o contador do total de tarefas do projeto.
func (s *GetIssuesByPeriodResponse) AddTotalByProject(projectIndex int) {
	s.Projects.IssuesByProject[projectIndex].Total++
}

// ValidateTotalByTypeLength verifica se o tamanho da lista de quantidade total por tipo
// e se o tamanho da lista de quantidade por tipo e período é compatível com o tamanho da lista de tipos de issues
func (s *GetIssuesByPeriodResponse) ValidateTotalByTypeLength(projectIndex int) {
	if len(s.Projects.IssuesByProject[projectIndex].TotalByType) < len(s.IssuesTypes) {
		for len(s.Projects.IssuesByProject[projectIndex].TotalByType) < len(s.IssuesTypes) {
			// total por tipo
			s.Projects.IssuesByProject[projectIndex].TotalByType = append(
				s.Projects.IssuesByProject[projectIndex].TotalByType,
				0,
			)

			// total por tipo e período
			s.Projects.IssuesByProject[projectIndex].TotalByTypeAndPeriod = append(
				s.Projects.IssuesByProject[projectIndex].TotalByTypeAndPeriod,
				make(map[string]int),
			)
		}
	}
}

// ValidateTotalByProjectByPeriodLength verifica se o slice é vazio para preencher com valores zerados.
func (s *GetIssuesByPeriodResponse) ValidateTotalByProjectByPeriodLength(projectIndex int) {
	if len(s.Projects.IssuesByProject[projectIndex].TotalByPeriod) == 0 {
		s.Projects.IssuesByProject[projectIndex].TotalByPeriod = make([]int, len(s.Periods))
	}
}

// AddTotalByType aumenta o contador do total de tarefas feitas por tipo.
func (s *GetIssuesByPeriodResponse) AddTotalByType(projectIndex, issueTypeIndex int) {
	s.Projects.IssuesByProject[projectIndex].TotalByType[issueTypeIndex]++
}
