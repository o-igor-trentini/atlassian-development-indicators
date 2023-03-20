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
	From  time.Time `json:"from" bingind:"required"`
	Until time.Time `json:"until" bingind:"required"`
}

type Period struct {
	Range PeriodRange `json:"range" bingind:"required"`
	Type  PeriodType  `json:"-"`
}

type OrderBy struct {
	Field     string `json:"field" bingind:"required"`
	Direction string `json:"direction" bingind:"required"`
}

// BuildJQLParams são os parâmetros passados para gerar uma JQL.
type BuildJQLParams struct {
	Projects []string  `form:"projects[]" binding:"required"`
	Period   Period    `form:"period" binding:"required"`
	OrderBy  []OrderBy `form:"orderBy[]"`
}
