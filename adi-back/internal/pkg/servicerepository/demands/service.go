package demands

import (
	"adi-back/internal/pkg/adiutils/uslice"
	"adi-back/third_party/gojira"
	"adi-gojira/pkg/gjconsts"
	"adi-gojira/pkg/gjservice"
	"fmt"
	"strings"
	"time"
)

type Service interface {
	// GetCreatedVersusResolved busca as issues criadas, resolvidas e pendentes divididas por mês.
	GetCreatedVersusResolved(params gojira.BuildJQLParams) (GetCreatedVersusResolvedResponse, error)
}

type serviceImpl struct {
	gojiraService gojira.Service
}

// NewService instância o serviço das demandas
func NewService(gojiraService gojira.Service) Service {
	return &serviceImpl{gojiraService}
}

func (s serviceImpl) GetCreatedVersusResolved(params gojira.BuildJQLParams) (GetCreatedVersusResolvedResponse, error) {
	//monthKeys := utime.GetYearMonthBetweenDates(params.Period.Range.From, params.Period.Range.Until)

	fields := []string{gjconsts.IssueFieldCreaetd, gjconsts.IssueFieldResolutionDate}

	issues, JQL, err := s.gojiraService.GetIssues(params, fields)
	if err != nil {
		// TODO: Tipo de erro personalizado
		fmt.Println(err)
		return GetCreatedVersusResolvedResponse{}, nil
	}
	fmt.Println(issues, JQL)

	return GetCreatedVersusResolvedResponse{}, nil
}

// handleGetIssues formata os dados retornados pelo Jira dividindo em issue por ano/mês.
func (s serviceImpl) handleGetIssues(
	payload gjservice.SearchByJQLPayload,
	periodType gojira.PeriodType,
	monthsKeys []string,
) ([]uint, error) {
	values := make([]uint, len(monthsKeys))

	for _, v := range payload.Issues {
		strDate := v.Fields.Created
		if periodType == gojira.ResolvedPeriodType {
			strDate = *v.Fields.ResolutionDate
		}

		cutedStrDate, _, _ := strings.Cut(strDate, "T")

		date, err := time.Parse("2006-01-02", cutedStrDate)
		if err != nil {
			return values, err
		}

		key := fmt.Sprintf("%d/%d", date.Year(), date.Month())

		if i := uslice.Index(monthsKeys, key); i != -1 {
			values[i] += 1
		}
	}

	return values, nil
}
