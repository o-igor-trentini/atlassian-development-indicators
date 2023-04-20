package adiutils

import (
	"fmt"
	"time"
)

func MakePeriodKey(date time.Time) string {
	return fmt.Sprintf("%d/%d", date.Year(), date.Month())
}

func MakePeriodKeyIndividual(year, month int) string {
	return fmt.Sprintf("%d/%d", year, month)
}
