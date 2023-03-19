package gojira

import "time"

// PeriodType é o tipo da busca por período.
type PeriodType string

const (
	// CreatedPeriodType período de tempo "criada em"
	CreatedPeriodType PeriodType = "created"
	// ResolvedPeriodType período de tempo "resolvida em"
	ResolvedPeriodType PeriodType = "resolved"
	// PendingPeriodType período de tempo "criada em" e sem "resolvida em"
	PendingPeriodType PeriodType = "pending"
)

type PeriodRange struct {
	From  time.Time `form:"from"`
	Until time.Time `form:"until"`
}

type Period struct {
	Range PeriodRange `form:"range"`
	Type  PeriodType  `form:"-"`
}

type OrderBy struct {
	Field     string
	Direction string
}

// BuildJQLParams são os parâmetros passados para gerar uma JQL.
type BuildJQLParams struct {
	Projects []string  `form:"projects"`
	Period   Period    `form:"period"`
	OrderBy  []OrderBy `form:"orderBy"`
}
