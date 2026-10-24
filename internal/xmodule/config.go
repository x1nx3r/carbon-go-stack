package xmodule

import (
	"fmt"
	"os"
	"strings"
)

type Config struct {
	HTTPAddr    string
	DatabaseURL string
	LogLevel    string
}

func LoadConfig() (Config, error) {
	cfg := Config{
		HTTPAddr:    envOr("ERP_HTTP_ADDR", "127.0.0.1:8080"),
		DatabaseURL: envOr("ERP_DATABASE_URL", "postgres://erp:erp@127.0.0.1:55432/erp?sslmode=disable"),
		LogLevel:    strings.ToLower(envOr("ERP_LOG_LEVEL", "info")),
	}
	if strings.TrimSpace(cfg.DatabaseURL) == "" {
		return Config{}, fmt.Errorf("ERP_DATABASE_URL is required")
	}
	return cfg, nil
}

func envOr(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}
