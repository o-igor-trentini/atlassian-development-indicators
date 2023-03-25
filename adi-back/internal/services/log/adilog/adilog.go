package adilog

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/pkg/adiutils"
	"encoding/json"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"log"
	"net/url"
	"os"
)

type LoggerPayload struct {
	Level      LoggerLevelType `json:"level"`
	Tag        *LoggerTagType  `json:"tag"`
	Message    string          `json:"message"`
	Function   string          `json:"function"`
	StackTrace string          `json:"stackTrace"`
}

func (l *LoggerPayload) JsonToScruct(p []byte) {
	json.Unmarshal(p, l)
}

var Logger *zap.Logger

// Init inicizalia o Logger da bibiliteca Zap.
func Init() {
	var envLogLevel = os.Getenv(envconst.LogLevel)
	var logLevel zapcore.Level

	if v, ok := LogEnvToZapLevelsMapping[envLogLevel]; ok {
		logLevel = v
	} else {
		log.Fatalf(
			"erro ao inicializar serviço de loggin devido ao nível de log inválido; envLogLevel: %s",
			envLogLevel,
		)
	}

	customWriterKey := "sentry"
	customWriterPath := customWriterKey + ":customLogger"

	cfg := zap.Config{
		Level:             zap.NewAtomicLevelAt(logLevel),
		Development:       false,
		DisableCaller:     false,
		DisableStacktrace: true,
		Sampling:          nil,
		Encoding:          "json",
		EncoderConfig: zapcore.EncoderConfig{
			MessageKey:    "message",
			LevelKey:      "level",
			StacktraceKey: "stackTrace",
			FunctionKey:   "function",
			EncodeLevel:   zapcore.LowercaseLevelEncoder,
		},
		OutputPaths:      []string{"stdout", customWriterPath},
		ErrorOutputPaths: []string{"stderr"},
		InitialFields:    nil,
	}

	applyDevelopmentConfig(&cfg)

	registerCustomWriterKey(customWriterKey)

	Logger = buildLogger(cfg)
}

// applyDevelopmentConfig aplica as particularidades do ambiente de desenvolvimento.
func applyDevelopmentConfig(cfg *zap.Config) {
	if adiutils.IsDevMode() {
		cfg.Development = true
		cfg.DisableStacktrace = false
	}
}

// registerCustomWriterKey registra uma chave personalizada para outra saída de log.
func registerCustomWriterKey(customWriterKey string) {
	if Logger != nil {
		return
	}

	if err := zap.RegisterSink(customWriterKey, func(u *url.URL) (zap.Sink, error) { return SentryLoggerOut{}, nil }); err != nil {
		log.Fatalf("erro ao registrar chave personalizada de log [erro: %s]", err)
	}
}

// buildLogger gera o logger.
func buildLogger(cfg zap.Config) *zap.Logger {
	logger, err := cfg.Build()
	if err != nil {
		log.Fatalf("erro ao inicializar o serviço de logging [erro: %s]", err)
	}

	return logger
}
