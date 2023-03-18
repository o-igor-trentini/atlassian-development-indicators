package controllers

import (
	"adi-back/internal/pkg/integration/gojira"
	"adi-gojira/pkg/gjservice"
	"fmt"
	"github.com/gin-gonic/gin"
	"strings"
	"time"
)

type DemandsController interface {
	Get(c *gin.Context)
}

type demandsImpl struct {
	gojiraService gojira.Service
}

// NewDemands instância o controller das demandas.
func NewDemands(gojiraService gojira.Service) DemandsController {
	return &demandsImpl{gojiraService}
}

func (co demandsImpl) Get(c *gin.Context) {
	// irá ser recebido por parâmetro
	queryParams := gojira.BuildJQLParams{
		Projects: []string{"PEC"},
		Period: gojira.Period{
			Range: []time.Time{time.Now().AddDate(0, -2, 0), time.Now()},
		},
	}

	channel := make(chan Response)

	queryParams.Period.Type = gojira.CreatedPeriodType
	go co.getAsync(channel, queryParams)

	queryParams.Period.Type = gojira.ResolvedPeriodType
	go co.getAsync(channel, queryParams)

	queryParams.Period.Type = gojira.PendentPeriodType
	go co.getAsync(channel, queryParams)

	v1, v2, v3 := <-channel, <-channel, <-channel

	errors := make(map[string]string)
	if v1.Error != "" {
		errors[string(v1.Type)] = v1.Error
	}

	if v2.Error != "" {
		errors[string(v2.Type)] = v2.Error
	}

	if v3.Error != "" {
		errors[string(v3.Type)] = v3.Error
	}

	if len(errors) > 0 {
		c.JSON(400, gin.H{
			"message": "Não foi possível buscar os dados",
			"errors":  errors,
		})
		return
	}

	c.JSON(200, gin.H{
		"created":  v1,
		"resolved": v2,
		"pendents": v3,
	})

}

type ResponseSubType struct {
	Result map[string]uint `json:"months"`
	Total  uint            `json:"total"`
	JQL    string          `json:"jql"`
}

type Response struct {
	Type  gojira.PeriodType `json:"type"`
	Data  ResponseSubType   `json:"data"`
	Error string            `json:"error"`
}

func (co demandsImpl) getAsync(c chan Response, queryParameters gojira.BuildJQLParams) {
	issues, JQL, err := co.gojiraService.GetIssues(queryParameters)
	if err != nil {
		c <- Response{
			Type:  queryParameters.Period.Type,
			Data:  ResponseSubType{},
			Error: err.Error(),
		}
		return
	}

	result, err := handle(issues, queryParameters.Period.Type)
	if err != nil {
		c <- Response{
			Type:  queryParameters.Period.Type,
			Data:  ResponseSubType{},
			Error: err.Error(),
		}
		return
	}

	c <- Response{
		Type: queryParameters.Period.Type,
		Data: ResponseSubType{
			Result: result,
			Total:  issues.Total,
			JQL:    JQL,
		},
		Error: "",
	}
}

func handle(dataCreated gjservice.SearchByJQLPayload, tp gojira.PeriodType) (
	yearMonthCount map[string]uint,
	err error,
) {
	result := make(map[string]uint)

	for _, v := range dataCreated.Issues {
		strDate := v.Fields.Created
		if tp == gojira.ResolvedPeriodType {
			strDate = *v.Fields.ResolutionDate
		}

		cutedStrDate, _, _ := strings.Cut(strDate, "T")

		date, err := time.Parse("2006-01-02", cutedStrDate)
		if err != nil {
			return result, err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if v, exist := result[key]; exist {
			result[key] = v + 1
		} else {
			result[key] = 1
		}
	}

	yearMonthCount = result

	return
}
