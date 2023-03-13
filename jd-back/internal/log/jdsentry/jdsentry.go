package jdsentry

import (
	"github.com/getsentry/sentry-go"
	"jd-back/internal/consts/envconst"
	"os"
	"time"
)

// Init inicializa o logger do sentry.
func Init() error {
	sentrySyncTransport := sentry.NewHTTPSyncTransport()
	sentrySyncTransport.Timeout = time.Second * 3

	return sentry.Init(sentry.ClientOptions{
		Dsn:         os.Getenv(envconst.SentryDSN),
		Environment: os.Getenv(envconst.SentryEnvironment),
		Transport:   sentrySyncTransport,
		// Set TracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production,
		TracesSampleRate: 1.0,
	})
}
