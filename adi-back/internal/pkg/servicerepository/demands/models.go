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

type IssuesByProject struct {
	Total         int      `json:"total"`
	TotalByPeriod []int    `json:"totalByPeriod"`
	IssuesTypes   []string `json:"issuesTypes"`
	TotalByType   []int    `json:"totalByType"`
}

type GetIssuesByPeriodResponse struct {
	Created  IssuesByPeriodDTO `json:"created"`
	Resolved IssuesByPeriodDTO `json:"resolved"`
	// Pending possui informação temporal.
	Pending        IssuesByPeriodDTO `json:"pending"`
	Periods        []string          `json:"periods"`
	Analytics      IssuesAnalytics   `json:"analytics"`
	Projects       []string          `json:"projects"`
	ProjectDetails []IssuesByProject `json:"projectDetails"`
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
