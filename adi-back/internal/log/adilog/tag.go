package adilog

import "go.uber.org/zap"

const DefaultTagKey = "tag"

// RecoveryTag pega a tag "recovery" para usar no log.
// Usada quando acontece um panic() e a aplicação é reiniciada.
//func RecoveryTag() zap.Field {
//	return zap.String(DefaultTagKey, string(LoggerTagRecovery))
//}

// MigrationTag pega a tag "migration" para usar no log.
// Usada quando é necessário encerrar a aplicação devido a falhas na execuação de processos.
func MigrationTag() zap.Field {
	return zap.String(DefaultTagKey, string(LoggerTagMigration))
}
