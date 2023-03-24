package demands

type IssuesByPeriodDTO struct {
	Total        uint   `json:"total"`
	PeriodValues []uint `json:"values"`
}

type Analytics struct {
	OverallProgress   float32   `json:"overallProgress"`
	ProgressPerPeriod []float32 `json:"progressPerPeriod"`
	CreatedTotal      uint      `json:"createdTotal"`
	ResolvedTotal     uint      `json:"resolvedTotal"`
	PendingTotal      uint      `json:"pendingTotal"`
}

type GetIssuesByPeriodResponse struct {
	JQL       string            `json:"jql"`
	Created   IssuesByPeriodDTO `json:"created"`
	Resolved  IssuesByPeriodDTO `json:"resolved"`
	Pending   IssuesByPeriodDTO `json:"pending"`
	Periods   []string          `json:"periods"`
	Analytics Analytics         `json:"analytics"`
}
