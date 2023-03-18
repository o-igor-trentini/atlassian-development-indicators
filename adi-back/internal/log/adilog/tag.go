package adilog

import "go.uber.org/zap"

const DefaultTagKey = "tag"

// MigrationTag pega a tag "migration" para usar no log.
// Usada quando é necessário encerrar a aplicação devido a falhas na execuação de processos.
func MigrationTag() zap.Field {
	return zap.String(DefaultTagKey, string(LoggerTagMigration))
}
