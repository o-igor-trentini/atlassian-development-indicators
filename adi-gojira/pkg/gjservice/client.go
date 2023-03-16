package gjservice

import (
	"fmt"
	"github.com/o-igor-trentini/atlassian-development-indicators/adi-gojira/internal/gjutils"
	"net/http"
)

type Client struct {
	baseURL    string
	baseAuth   string
	httpClient http.Client
}

func NewClient(baseURL, jiraUsername, jiraToken string, httpClient http.Client) *Client {
	return &Client{
		baseURL:    baseURL + "rest/api/3/",
		baseAuth:   gjutils.BasicAuth(jiraUsername, jiraToken),
		httpClient: httpClient,
	}
}

func (c Client) addAuthorizationHeader(req *http.Request) {
	req.Header.Add("Authorization", "Basic "+c.baseAuth)
}

func (c Client) GET(path string) (*http.Response, error) {
	url := c.baseURL + path

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("não foi possível criar a requisição '%s' [erro: %w]", url, err)
	}

	c.addAuthorizationHeader(req)

	res, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("não foi possível completar requisição para '%s' [erro: %w]", url, err)
	}
	defer res.Body.Close()

	return res, nil
}
