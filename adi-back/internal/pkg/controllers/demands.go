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

func NewDemands(gojiraService gojira.Service) DemandsController {
	return &demandsImpl{gojiraService}
}

func (co demandsImpl) Get(c *gin.Context) {
	// irá ser recebido por parâmetro
	queryParams := gojira.BuildJQLParams{
		Projects: []string{"PEC"},
		Period: gojira.Period{
			PeriodRange: []time.Time{time.Now().AddDate(0, -2, 0), time.Now()},
			PeriodType:  gojira.CreatedPeriodType,
		},
	}

	dataCreated, jqlCreated, err := co.gojiraService.GetIssues(queryParams)
	if err != nil {
		c.JSON(400, gin.H{"erro": err})
		return
	}

	resulCreated, totalCreated, err := handle(dataCreated, gojira.CreatedPeriodType)
	if err != nil {
		c.JSON(400, gin.H{"erro": err})
		return
	}

	queryParams.Period.PeriodType = gojira.ResolvedPeriodType

	dataResolved, jqlResolved, err := co.gojiraService.GetIssues(queryParams)
	if err != nil {
		c.JSON(400, gin.H{"erro": err})
		return
	}

	resultResolved, totalResolved, err := handle(dataResolved, gojira.ResolvedPeriodType)
	if err != nil {
		c.JSON(400, gin.H{"erro": err})
		return
	}

	queryParams.Period.PeriodType = gojira.PendentPeriodType

	dataPendent, jqlPendent, err := co.gojiraService.GetIssues(queryParams)
	if err != nil {
		c.JSON(400, gin.H{"erro": err})
		return
	}

	resultPendent, totalPendent, err := handle(dataPendent, gojira.PendentPeriodType)
	if err != nil {
		c.JSON(400, gin.H{"erro": err})
		return
	}

	c.JSON(200, gin.H{
		"created": gin.H{
			"JQL":    jqlCreated,
			"total":  totalCreated,
			"months": resulCreated,
		},
		"resolved": gin.H{
			"JQL":    jqlResolved,
			"total":  totalResolved,
			"months": resultResolved,
		},
		"pendents": gin.H{
			"JQL":    jqlPendent,
			"total":  totalPendent,
			"months": resultPendent,
		},
	})
}

func handle(dataCreated gjservice.SearchByJQLPayload, tp gojira.PeriodType) (
	yearMonthCount map[string]uint,
	total uint,
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
			return result, 0, err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if v, exist := result[key]; exist {
			result[key] = v + 1
		} else {
			result[key] = 1
		}
	}

	yearMonthCount = result

	for _, v := range yearMonthCount {
		total += v
	}

	return
}
