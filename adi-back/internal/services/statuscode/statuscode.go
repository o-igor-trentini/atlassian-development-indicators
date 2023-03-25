package statuscode

type Code string

const (
	CodeDatabase         Code = "database"
	CodeNotFound         Code = "not_found"
	CodeValidation       Code = "validation"
	CodeInvalidOperation Code = "invalid_operation"
	CodeNotAllowed       Code = "not_allowed"
	CodeUnknown          Code = "unknown"
)
