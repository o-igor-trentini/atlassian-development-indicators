package demands

type IssuesByPeriodDTO struct {
	JQL          *string `json:"jql,omitempty"`
	Total        uint    `json:"total"`
	PeriodValues []uint  `json:"values"`
}

type Analytics struct {
	OverallProgress   float32   `json:"overallProgress"`
	ProgressPerPeriod []float32 `json:"progressPerPeriod"`
	CreatedTotal      uint      `json:"createdTotal"`
	ResolvedTotal     uint      `json:"resolvedTotal"`
	PendingTotal      uint      `json:"pendingTotal"`
}

type GetIssuesByPeriodResponse struct {
	Created   IssuesByPeriodDTO `json:"created"`
	Resolved  IssuesByPeriodDTO `json:"resolved"`
	Pending   IssuesByPeriodDTO `json:"pending"`
	Periods   []string          `json:"periods"`
	Analytics Analytics         `json:"analytics"`
}

func (s *GetIssuesByPeriodResponse) DoAnalysis() {
	s.Analytics.ProgressPerPeriod = make([]float32, len(s.Periods))

	for i := range s.Periods {
		s.Created.Total += s.Created.PeriodValues[i]
		s.Pending.Total += s.Pending.PeriodValues[i]
		s.Resolved.Total += s.Resolved.PeriodValues[i]

		s.Analytics.ProgressPerPeriod[i] += float32(s.Resolved.PeriodValues[i]) / float32(s.Created.PeriodValues[i]) * 100
	}

	s.Analytics.CreatedTotal = s.Created.Total
	s.Analytics.ResolvedTotal = s.Resolved.Total
	s.Analytics.PendingTotal = s.Pending.Total
	s.Analytics.OverallProgress = float32(s.Resolved.Total) / float32(s.Created.Total) * 100
}
