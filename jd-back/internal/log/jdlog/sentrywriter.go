package jdlog

import (
	"errors"
	"github.com/getsentry/sentry-go"
)

type SentryLoggerOut struct {
}

func (t SentryLoggerOut) Write(p []byte) (n int, err error) {
	var strP = string(p)
	var payload LoggerPayload
	payload.JsonToScruct(p)

	sentry.WithScope(func(scope *sentry.Scope) {
		scope.SetLevel(LogZapToSentryLevelsMapping[payload.Level])

		if payload.Tag != nil {
			scope.SetTag("tag", string(*payload.Tag))
		}

		sentry.CaptureException(errors.New(strP))
	})

	return len(strP), nil
}

func (t SentryLoggerOut) Sync() error {
	return nil
}

func (t SentryLoggerOut) Close() error {
	return nil
}
