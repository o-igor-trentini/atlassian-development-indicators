package adilog

import (
	"github.com/getsentry/sentry-go"
	"go.uber.org/zap/zapcore"
)

// LoggerLevelType é o nível de log.
type LoggerLevelType string

const (
	LoggerLevelDebug  LoggerLevelType = "debug"
	LoggerLevelInfo   LoggerLevelType = "info"
	LoggerLevelWarn   LoggerLevelType = "warn"
	LoggerLevelError  LoggerLevelType = "error"
	LoggerLevelPanic  LoggerLevelType = "panic"
	LoggerLevelDPanic LoggerLevelType = "dpanic"
	LoggerLevelFatal  LoggerLevelType = "fatal"
)

// LogEnvToZapLevelsMapping converte string para o tipo de nível de log da biblioteca Zap.
var LogEnvToZapLevelsMapping = map[string]zapcore.Level{
	"debug":  zapcore.DebugLevel,
	"info":   zapcore.InfoLevel,
	"warn":   zapcore.WarnLevel,
	"error":  zapcore.ErrorLevel,
	"panic":  zapcore.PanicLevel,
	"dpanic": zapcore.DPanicLevel,
	"fatal":  zapcore.FatalLevel,
}

// LogZapToSentryLevelsMapping converte LoggerLevelType para o tipo de nível de log da biblioteca Sentry.
var LogZapToSentryLevelsMapping = map[LoggerLevelType]sentry.Level{
	LoggerLevelDebug:  sentry.LevelDebug,
	LoggerLevelInfo:   sentry.LevelInfo,
	LoggerLevelWarn:   sentry.LevelWarning,
	LoggerLevelError:  sentry.LevelError,
	LoggerLevelDPanic: sentry.LevelError,
	LoggerLevelPanic:  sentry.LevelFatal,
	LoggerLevelFatal:  sentry.LevelFatal,
}

// LoggerTagType é o tipo das marcações de log disponíveis.
type LoggerTagType string

const (
	LoggerTagRecovery  LoggerTagType = "recovery"
	LoggerTagMigration LoggerTagType = "migration"
)
