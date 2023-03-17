package gjservice

import (
	"adi-gojira/internal/gjutils"
	"adi-gojira/pkg/gjmodels"
	"fmt"
	"net/url"
)

type SearchByJQLPayload struct {
	gjmodels.Pagination
	Issues []gjmodels.Issue `json:"issues"`
}

func (c Client) SearchByJQL(query string) (SearchByJQLPayload, error) {
	// TODO: Receber map com parâmetros

	data := SearchByJQLPayload{}

	res, err := c.get("search?" + url.QueryEscape(query))
	if err != nil {
		return data, fmt.Errorf("não foi possível buscar por JQL [erro: %s]", err)
	}

	return data, gjutils.ResBodyToStruct(res, &data)
}
