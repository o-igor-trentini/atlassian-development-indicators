package main

import (
	"encoding/json"
	"fmt"
	"github.com/o-igor-trentini/atlassian-development-indicators/adi-gojira/pkg/gjmodels"
	"github.com/o-igor-trentini/atlassian-development-indicators/adi-gojira/pkg/gjservice"
	"io"
	"net/http"
	"time"
)

// main é usado apenas para testes
func main() {
	baseUrl := ""
	httpClient := &http.Client{Timeout: time.Duration(10) * time.Second}
	service := gjservice.NewClient(
		baseUrl,
		"",
		"",
		*httpClient,
	)

	param := "?jql=project%20=%20PEC%20AND%20resolved%20%3E=%202023-03-07%20AND%20resolved%20%3C=%202023-03-31%20ORDER%20BY%20created%20DESC"
	res, _ := service.GET("search" + param)

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
