package gojira

import (
	"github.com/o-igor-trentini/adi-gojira/pkg/gjconsts"
	"github.com/o-igor-trentini/adi-goutils/pkg/utime"
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
			from := utime.RemoveTime(params.Period.Range.From)
			until := utime.RemoveTime(params.Period.Range.Until)
			isEqual := from.Equal(until)

			// O JQL não suporta fazer operação por "=" com data e nem ">= AND <=" com datas iguais.
			// Por isso é preciso que a data de "Até" seja incrementada em 1 dia.
			if isEqual {
				until = until.AddDate(0, 0, 1)
			}

			item := field + " >= " + from.Format("2006-01-02")
			item += " AND " + field + " <= " + until.Format("2006-01-02")

			// Para garantir que não retorne nada do dia incrementado o operador é alterado.
			if isEqual {
				item = strings.ReplaceAll(item, "<=", "<")
			}

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
