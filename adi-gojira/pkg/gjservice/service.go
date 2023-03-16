package gjservice

import (
	"adi-gojira/pkg/gjmodels"
	"encoding/json"
	"io"
)

type SearchByJQLPayload struct {
	gjmodels.Pagination
	Issues []gjmodels.Issue `json:"issues"`
}

func (c Client) SearchByJQL(query string) (SearchByJQLPayload, error) {
	data := SearchByJQLPayload{}

	param := "?" + query
	res, _ := c.get("search" + param)

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return data, err
	}
	defer res.Body.Close()

	json.Unmarshal(body, &data)

	return data, nil
}
