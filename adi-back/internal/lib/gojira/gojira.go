package gojira

import (
	"adi-back/internal/consts/envconst"
	"adi-gojira/pkg/gjservice"
	"net/http"
	"os"
	"time"
)

func NewClient() gjservice.Client {
	httpClient := &http.Client{Timeout: time.Duration(10) * time.Second}

	return *gjservice.NewClient(
		os.Getenv(envconst.JiraApiBaseUrl),
		os.Getenv(envconst.JiraApiUsername),
		os.Getenv(envconst.JiraApiToken),
		*httpClient,
	)
}
