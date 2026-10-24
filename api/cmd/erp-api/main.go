package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"erp-api/internal/xmodule"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	cfg, err := xmodule.LoadConfig()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}
	log := xmodule.NewLogger(cfg.LogLevel)

	deps, err := xmodule.InitDependencies(ctx, cfg, log)
	if err != nil {
		log.Error("startup", "err", err)
		os.Exit(1)
	}
	if err := xmodule.Serve(ctx, cfg, deps, log); err != nil {
		log.Error("serve", "err", err)
		os.Exit(1)
	}
}
