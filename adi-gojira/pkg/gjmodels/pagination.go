package gjmodels

type Pagination struct {
	Expand     string `json:"expand"`
	StartAt    uint   `json:"startAt"`
	MaxResults uint   `json:"maxResults"`
	Total      uint64 `json:"total"`
}
