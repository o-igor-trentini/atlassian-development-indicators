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

func (c Client) SearchByJQL(queryParams map[string]string) (SearchByJQLPayload, error) {
	var params string

	if len(queryParams) > 0 {
		params += "?"

		for k, v := range queryParams {
			params += k + "=" + url.QueryEscape(v) + "&"
		}

		params = params[:len(params)-1]
	}

	data := SearchByJQLPayload{}

	res, err := c.get("search" + params)
	if err != nil {
		return data, fmt.Errorf("não foi possível buscar por JQL [erro: %s]", err)
	}

	return data, gjutils.ResBodyToStruct(res, &data)
}
