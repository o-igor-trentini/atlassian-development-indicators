package main

import (
	"encoding/json"
	"fmt"
	"github.com/o-igor-trentini/atlassian-development-indicators/adi-gojira/pkg/gjmodels"
	"io"
	"net/http"
)

// main é usado apenas para testes
func main() {
	param := "?jql=project%20=%20PEC%20AND%20resolved%20%3E=%202023-03-07%20AND%20resolved%20%3C=%202023-03-31%20ORDER%20BY%20created%20DESC"
	url := "https://rastergr.atlassian.net/rest/api/3/search" + param
	method := "GET"

	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("Authorization", "") // add auth

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(body))

	type test struct {
		gjmodels.Pagination
		Issues []gjmodels.Issue `json:"issues"`
	}

	data := test{}
	json.Unmarshal(body, &data)

	fmt.Println(data)
}
