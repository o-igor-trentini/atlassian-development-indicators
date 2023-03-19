package udate

import (
	"fmt"
	"time"
)

// GetYearMonthBetweenDates retorna os ano/mês entre duas datas.
func GetYearMonthBetweenDates(t1, t2 time.Time) []string {
	var interval []string

	y1, m1 := t1.Year(), int(t1.Month())
	y2, m2 := t2.Year(), int(t2.Month())

	// ano
	for i := 0; i <= y1-y2; i++ {
		// mês
		for j := 0; j < m2; j++ {
			interval = append(interval, fmt.Sprintf("%d/%d", y1+i, m1+j))
		}
	}

	return interval
}
