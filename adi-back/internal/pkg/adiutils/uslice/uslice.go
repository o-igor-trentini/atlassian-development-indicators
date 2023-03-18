package uslice

func Contains[T comparable](slice []T, element T) bool {
	for _, s := range slice {
		if element == s {
			return true
		}
	}

	return false
}
