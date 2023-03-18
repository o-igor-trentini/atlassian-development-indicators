package gojira

import "time"

// PeriodType é o tipo da busca por período.
type PeriodType string

const (
	// CreatedPeriodType período de tempo "criada em"
	CreatedPeriodType PeriodType = "created"
	// ResolvedPeriodType período de tempo "resolvida em"
	ResolvedPeriodType PeriodType = "resolved"
	// PendentPeriodType período de tempo "criada em" e sem "resolvida em"
	PendentPeriodType PeriodType = "pendent"
)

type Period struct {
	PeriodRange []time.Time
	PeriodType  PeriodType
}

// BuildJQLParams são os parâmetros passados para gerar uma JQL.
type BuildJQLParams struct {
	Projects []string
	Period   Period
}