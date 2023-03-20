package utime

import (
	"fmt"
	"time"
)

// RemoveTime remove as horas, mantendo apenas a data.
func RemoveTime(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}

// GetYearMonthBetweenDates retorna os ano/mês entre duas datas.
func GetYearMonthBetweenDates(t1, t2 time.Time) []string {
	var interval []string

	t1 = RemoveTime(t1)
	t2 = RemoveTime(t2)

	y1, m1 := t1.Year(), int(t1.Month())
	y2, m2 := t2.Year(), int(t2.Month())

	// TODO: Arrumar quando é ano diferente

	yearDiff := y2 - y1
	//lastMonth := 12

	// TODO: Arrumar cálculo de diferença

	// ano
	for i := 0; i <= yearDiff; i++ {
		// mês
		if i == yearDiff {
			for j := m1 - 1; j < m2; j++ {
				interval = append(interval, fmt.Sprintf("%d/%d", y1+i, m1+j))
			}
			break
		}

		//for j := m1; j <= lastMonth; j++ {
		//	interval = append(interval, fmt.Sprintf("%d/%d", y2-yearDiff+i, j))
		//}
	}

	return interval
}
