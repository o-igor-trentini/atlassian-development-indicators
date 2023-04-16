package gojira

import (
	"github.com/o-igor-trentini/adi-gojira/pkg/gjservice"
	"time"
)

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
	From  time.Time `json:"from" form:"from" bingind:"required"`
	Until time.Time `json:"until" form:"until" bingind:"required"`
}

type Period struct {
	Range PeriodRange `json:"range" form:"range" bingind:"required"`
	Type  PeriodType  `json:"-"`
}

type OrderBy struct {
	Field     string `json:"field" form:"field" bingind:"required"`
	Direction string `json:"direction" form:"direction" bingind:"required"`
}

// BuildJQLParams são os parâmetros passados para gerar uma JQL.
type BuildJQLParams struct {
	Projects []string  `json:"projects" form:"projects[]" binding:"required"`
	Period   Period    `json:"period" form:"period" binding:"required"`
	OrderBy  []OrderBy `json:"orderBy" form:"orderBy[]"`
}

type GetIssuesChannelResponse struct {
	JQL        string
	Issues     gjservice.SearchByJQLPayload
	PeriodType PeriodType
}
