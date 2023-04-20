package adiutils

import (
	"github.com/o-igor-trentini/adi-goutils/pkg/utime"
	"time"
)

// GetYearMonthBetweenDates retorna os ano/mês entre duas datas.
func GetYearMonthBetweenDates(t1, t2 time.Time) []string {
	var interval []string

	t1 = utime.RemoveTime(t1)
	t2 = utime.RemoveTime(t2)

	y1, m1 := t1.Year(), int(t1.Month())
	y2, m2 := t2.Year(), int(t2.Month())

	yearDiff := y2 - y1
	lastMonth := 12

	// ano
	for i := 0; i <= yearDiff; i++ {
		// meses do ano atual
		if i == yearDiff {
			// ambos os anos iguais (t1, t2)
			if y1 == y2 {
				for j := m1; j <= m2; j++ {
					interval = append(interval, MakePeriodKeyIndividual(y2, j))
				}
				break
			}

			// com anos diferentes
			for j := 1; j <= m2; j++ {
				interval = append(interval, MakePeriodKeyIndividual(y2, j))
			}
			break
		}

		// meses do primeiro ano
		if i == 0 {
			for j := m1; j <= lastMonth; j++ {
				interval = append(interval, MakePeriodKeyIndividual(y2-yearDiff+i, j))
			}
			continue
		}

		// meses dos anos entre o primeiro e o segundo
		for j := 1; j <= lastMonth; j++ {
			interval = append(interval, MakePeriodKeyIndividual(y2-yearDiff+i, j))
		}
	}

	return interval
}
