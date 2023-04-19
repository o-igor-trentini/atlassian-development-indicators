package demands

import (
	"adi-back/internal/pkg/adiutils"
	"github.com/o-igor-trentini/adi-gojira/pkg/gjmodels"
	"github.com/o-igor-trentini/adi-goutils/pkg/uslice"
	"github.com/o-igor-trentini/adi-goutils/pkg/ustring"
	"strings"
)

type IssuesGeneral struct {
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

type Projects struct {
	Names           []string           `json:"names"`
	Details         []gjmodels.Project `json:"details"`
	IssuesByProject []IssuesByProject  `json:"issuesByProject"`
}

type IssuesByDeveloper struct {
	Total       int   `json:"total"`
	TotalByType []int `json:"totalByType"`
}

type Developers struct {
	Names             []string            `json:"names"`
	Details           []gjmodels.User     `json:"details"`
	IssuesByDeveloper []IssuesByDeveloper `json:"issuesByDeveloper"`
}

// GetIssuesByPeriodResponse é o formato da resposta do service de mesmo nome.
type GetIssuesByPeriodResponse struct {
	Periods     []string        `json:"periods"`
	IssuesTypes []string        `json:"issuesTypes"`
	Analytics   IssuesAnalytics `json:"analytics"`
	Created     IssuesGeneral   `json:"created"`
	Resolved    IssuesGeneral   `json:"resolved"`
	// Pending possui informação temporal.
	Pending    IssuesGeneral `json:"pending"`
	Projects   Projects      `json:"projects"`
	Developers Developers    `json:"developers"`
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
	s.Projects.Details = make([]gjmodels.Project, projectsLength)
	s.Projects.IssuesByProject = make([]IssuesByProject, projectsLength)
}

// FixEmpty padroniza os dados para terem o mesmo tamanho.
func (s *GetIssuesByPeriodResponse) FixEmpty() {
	issueTypes := s.IssuesTypes
	issueTypesLength := len(issueTypes)

	// projeto
	for k, v := range s.Projects.IssuesByProject {
		periodLength := len(s.Periods)
		totalByTypeLength := len(v.TotalByType)

		// Adequa o tamanho do total de tarefas para um padrão
		if totalByTypeLength < issueTypesLength {
			lenDiff := issueTypesLength - totalByTypeLength

			for i := 0; i < lenDiff; i++ {
				v.TotalByType = append(v.TotalByType, 0)
			}
		}

		// Adequa o tamanho do total por período
		for _, period := range s.Periods {
			for issueTypeIndex := range issueTypes {
				// por período e tipo
				if len(v.TotalByTypeAndPeriod) <= issueTypeIndex {
					v.TotalByTypeAndPeriod = append(v.TotalByTypeAndPeriod, make(map[string]int))
				}

				if _, exist := v.TotalByTypeAndPeriod[issueTypeIndex][period]; !exist {
					v.TotalByTypeAndPeriod[issueTypeIndex][period] = 0
				}
			}
		}

		if v.Total == 0 {
			v.TotalByType = make([]int, periodLength)
			v.TotalByPeriod = make([]int, periodLength)
		}

		s.Projects.IssuesByProject[k] = v
	}

	for k, v := range s.Developers.IssuesByDeveloper {
		totalByTypeLength := len(v.TotalByType)

		// Adequa o tamanho do total de tarefas para um padrão
		if totalByTypeLength < issueTypesLength {
			lenDiff := issueTypesLength - totalByTypeLength

			for i := 0; i < lenDiff; i++ {
				v.TotalByType = append(v.TotalByType, 0)
			}
		}

		s.Developers.IssuesByDeveloper[k] = v
	}
}

// DoAnalysis gera os dados gerais para evitar ficar manipulando os dados toda vez que precisar de um total.
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
		s.Projects.Details[projectIndex] = project
	}

	return projectIndex
}

// AddIssueType adiciona o tipo da issue na listagem de tipos de issues.
func (s *GetIssuesByPeriodResponse) AddIssueType(issueType gjmodels.IssueType) int {
	issueTypeIndex := uslice.Index(s.IssuesTypes, issueType.Name)

	if issueTypeIndex == -1 {
		s.IssuesTypes = append(s.IssuesTypes, issueType.Name)

		issueTypeIndex = len(s.IssuesTypes) - 1
	}

	return issueTypeIndex
}

// AddTotalByProject aumenta o contador do total de tarefas do projeto.
func (s *GetIssuesByPeriodResponse) AddTotalByProject(projectIndex int) {
	s.Projects.IssuesByProject[projectIndex].Total++
}

// ValidateTotalByTypeLengthByProject verifica se o tamanho da lista de quantidade total por tipo
// e se o tamanho da lista de quantidade por tipo e período (ambos por projeto) é compatível com o
// tamanho da lista de tipos de issues.
func (s *GetIssuesByPeriodResponse) ValidateTotalByTypeLengthByProject(projectIndex int) {
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

// ValidateTotalByProjectByPeriodLengthByProject verifica se o slice é vazio para preencher com valores zerados.
func (s *GetIssuesByPeriodResponse) ValidateTotalByProjectByPeriodLengthByProject(projectIndex int) {
	if len(s.Projects.IssuesByProject[projectIndex].TotalByPeriod) == 0 {
		s.Projects.IssuesByProject[projectIndex].TotalByPeriod = make([]int, len(s.Periods))
	}
}

// AddTotalByTypeByProject aumenta o contador do total de tarefas feitas por tipo por projeto.
func (s *GetIssuesByPeriodResponse) AddTotalByTypeByProject(projectIndex, issueTypeIndex int) {
	s.Projects.IssuesByProject[projectIndex].TotalByType[issueTypeIndex]++
}

// AddDeveloper adiciona o desenvolvedor na listagem de tipos de desenvolvedores.
func (s *GetIssuesByPeriodResponse) AddDeveloper(developer gjmodels.User) int {
	developerIndex := uslice.Index(s.Developers.Names, developer.DisplayName)

	if developerIndex == -1 {
		s.Developers.Names = append(s.Developers.Names, developer.DisplayName)
		s.Developers.Details = append(s.Developers.Details, developer)
		s.Developers.IssuesByDeveloper = append(s.Developers.IssuesByDeveloper, IssuesByDeveloper{})

		developerIndex = len(s.Developers.Names) - 1
	}

	return developerIndex
}

// ValidateTotalByTypeLengthByDeveloper verifica se o tamanho da lista de quantidade total por tipo por desenvolvedor
// é compatível com o tamanho da lista de tipos de issues.
func (s *GetIssuesByPeriodResponse) ValidateTotalByTypeLengthByDeveloper(developerIndex int) {
	if len(s.Developers.IssuesByDeveloper[developerIndex].TotalByType) < len(s.IssuesTypes) {
		for len(s.Developers.IssuesByDeveloper[developerIndex].TotalByType) < len(s.IssuesTypes) {
			// total por tipo
			s.Developers.IssuesByDeveloper[developerIndex].TotalByType = append(
				s.Developers.IssuesByDeveloper[developerIndex].TotalByType,
				0,
			)
		}
	}
}

// AddTotalByDeveloper aumenta o contador do total de tarefas do desenvolvedor.
func (s *GetIssuesByPeriodResponse) AddTotalByDeveloper(developerIndex int) {
	s.Developers.IssuesByDeveloper[developerIndex].Total++
}

// AddTotalByTypeByDeveloper aumenta o contador do total de tarefas feitas por tipo por desenvolvedor.
func (s *GetIssuesByPeriodResponse) AddTotalByTypeByDeveloper(developerIndex, issueTypeIndex int) {
	s.Developers.IssuesByDeveloper[developerIndex].TotalByType[issueTypeIndex]++
}
