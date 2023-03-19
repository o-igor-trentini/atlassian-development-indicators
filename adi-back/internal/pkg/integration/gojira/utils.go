package gojira

import "strings"

// buildJQL monta a query JQL com base nos parâmetros passados.
func buildJQL(params BuildJQLParams) string {
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
	var item string
	field := string(params.Period.Type)

	for k, v := range params.Period.Range {
		switch k {
		// from
		case 0:
			item += field + " >= " + v.Format("2006-01-02")
			continue

		// until
		case 1:
			item += " AND " + field + " <= " + v.Format("2006-01-02")
			continue

		default:
			break
		}
	}

	if params.Period.Type == PendingPeriodType {
		item = strings.ReplaceAll(item, field, string(CreatedPeriodType))

		item += " AND resolved = NULL"
	}

	query = append(query, item)

	JQL = strings.Join(query, " AND ")

	if len(params.OrderBy) > 0 {
		var order []string

		for _, v := range params.OrderBy {
			order = append(order, v.Field+" "+v.Direction)
		}

		JQL += " ORDER BY " + strings.Join(order, ", ")
	}

	return JQL
}
