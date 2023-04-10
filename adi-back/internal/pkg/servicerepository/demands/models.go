package demands

type IssuesByPeriodDTO struct {
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

type IssuesDetailsByProject struct {
	Total                int              `json:"total"`
	TotalByType          []int            `json:"totalByType"`
	TotalByPeriod        []int            `json:"totalByPeriod"`
	TotalByTypeAndPeriod []map[string]int `json:"totalByTypeAndPeriod"`
}

type GetIssuesByPeriodProject struct {
	Projects               []string                 `json:"projects"`
	ProjectsAvatars        []string                 `json:"projectsAvatars"`
	IssuesTypes            []string                 `json:"issuesTypes"`
	IssuesDetailsByProject []IssuesDetailsByProject `json:"issuesDetailsByProject"`
}

type GetIssuesByPeriodResponse struct {
	Created  IssuesByPeriodDTO `json:"created"`
	Resolved IssuesByPeriodDTO `json:"resolved"`
	// Pending possui informação temporal.
	Pending   IssuesByPeriodDTO        `json:"pending"`
	Periods   []string                 `json:"periods"`
	Analytics IssuesAnalytics          `json:"analytics"`
	Project   GetIssuesByPeriodProject `json:"project"`
}

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

func (s *GetIssuesByPeriodResponse) FixEmpty() {
	issueTypes := s.Project.IssuesTypes

	for detailKey, detail := range s.Project.IssuesDetailsByProject {
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

		s.Project.IssuesDetailsByProject[detailKey] = detail
	}
}
