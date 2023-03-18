package demands

import "adi-back/internal/pkg/integration/gojira"

type IssuesByPeriodData struct {
	Result map[string]uint `json:"months"`
	Total  uint            `json:"total"`
}

type IssuesByPeriodDTO struct {
	Type  gojira.PeriodType  `json:"-"`
	Data  IssuesByPeriodData `json:"data"`
	JQL   string             `json:"jql"`
	Error error              `json:"-"`
}

type GetCreatedVersusResolvedResponse struct {
	Created  IssuesByPeriodDTO `json:"created"`
	Resolved IssuesByPeriodDTO `json:"resolved"`
	Pending  IssuesByPeriodDTO `json:"pending"`
}
