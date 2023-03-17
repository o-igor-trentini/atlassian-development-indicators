package gojira

import "strings"

// buildJQL monta a query JQL com base nos parâmetros passados.
func buildJQL(params BuildJQLParams) string {
	var query []string

	if len(params.Projects) > 0 {
		item := "project"

		if len(params.Projects) == 1 {
			item += " = " + params.Projects[0]
		} else {
			item += " IN (" + strings.Join(params.Projects, ", ") + ")"
		}

		query = append(query, item)
	}

	if params.Period != nil {
		var item string
		field := string(params.Period.PeriodType)

		for k, v := range params.Period.PeriodRange {
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

		query = append(query, item)
	}

	return strings.Join(query, " AND ")
}
