package gojira

import (
	"adi-gojira/pkg/gjconsts"
	"strings"
)

// buildJQL monta a query JQL com base nos parâmetros passados.
func buildJQL(params BuildJQLParams, t *PeriodType) string {
	var JQL string
	var query []string

	// projetos
	if len(params.Projects) > 0 {
		item := "project"

		if len(params.Projects) == 1 {
			item += " = " + params.Projects[0]
		} else {
			item += " IN (" + strings.Join(params.Projects, ", ") + ")"
		}

		query = append(query, item)
	}

	// período
	if t != nil {
		var makeDate = func(field string) string {
			item := field + " >= " + params.Period.Range.From.Format("2006-01-02")
			item += " AND " + field + " <= " + params.Period.Range.Until.Format("2006-01-02")

			return item
		}

		if *t == CreatedPeriodType {
			query = append(query, makeDate(gjconsts.IssueFieldCreaetd))
		}

		if *t == ResolvedPeriodType {
			query = append(query, makeDate(gjconsts.IssueFieldResolutionDate))
		}
	}

	JQL = strings.Join(query, " AND ")

	// order
	if len(params.OrderBy) > 0 {
		var order []string

		for _, v := range params.OrderBy {
			order = append(order, v.Field+" "+v.Direction)
		}

		JQL += " ORDER BY " + strings.Join(order, ", ")
	}

	return JQL
}
