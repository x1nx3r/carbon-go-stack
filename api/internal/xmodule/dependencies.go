package xmodule

import (
	"context"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"erp-api/internal/adapter/postgres"
	"erp-api/internal/app/usecase/showcase"
)

type Dependencies struct {
	DB       *gorm.DB
	Showcase showcase.UseCase
	Ready    func(context.Context) error
}

func InitDependencies(ctx context.Context, cfg Config, log *slog.Logger) (Dependencies, error) {
	if err := postgres.Migrate(cfg.DatabaseURL); err != nil {
		return Dependencies{}, err
	}
	db, err := postgres.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		return Dependencies{}, err
	}
	repo := postgres.NewShowcaseRepository(db)
	uc := showcase.New(repo, systemClock{}, uuidIDs{})
	return Dependencies{
		DB:       db,
		Showcase: uc,
		Ready:    func(ctx context.Context) error { return postgres.Ping(ctx, db) },
	}, nil
}

type systemClock struct{}

func (systemClock) Now() time.Time { return time.Now().UTC() }

type uuidIDs struct{}

func (uuidIDs) NewID() string { return uuid.NewString() }
