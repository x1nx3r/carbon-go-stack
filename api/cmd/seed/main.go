package main

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"time"

	"erp-api/internal/adapter/postgres"
	"erp-api/internal/app/port"
	"erp-api/internal/entity"
	"erp-api/internal/xmodule"
)

type fixture struct {
	id          string
	title       string
	description string
	status      entity.ShowcaseStatus
	owner       string
	amount      int64
	currency    string
	tags        []string
	done        bool
	createdAt   string
}

// Readable IDs keep the UI and visual baselines stable.
var fixtures = []fixture{
	{"show_001", "Atlas migration", "Move the ledger to the new schema.", entity.ShowcaseStatusActive, "Platform", 1245000, "USD", []string{"backend", "migration"}, false, "2026-09-01T08:00:00Z"},
	{"show_002", "Carbon spacing audit", "Check page rhythm against the design catalogue.", entity.ShowcaseStatusOnHold, "Design", 0, "USD", []string{"frontend", "tokens"}, false, "2026-09-03T09:30:00Z"},
	{"show_003", "Quarterly access review", "Review the analyst group and its scopes.", entity.ShowcaseStatusActive, "Security", 42000, "EUR", []string{"access", "review"}, false, "2026-09-08T10:15:00Z"},
	{"show_004", "Invoice reconciliation", "Match the September export with the ledger.", entity.ShowcaseStatusActive, "Finance", 892000, "GBP", []string{"finance", "import"}, false, "2026-09-12T14:20:00Z"},
	{"show_005", "Onboarding guide", "First draft for the support team.", entity.ShowcaseStatusArchived, "Support", 0, "USD", []string{"docs"}, true, "2026-09-18T16:45:00Z"},
	{"show_006", "Vendor risk pass", "Score the five new vendors.", entity.ShowcaseStatusActive, "Operations", 210000, "USD", []string{"risk", "vendors"}, false, "2026-09-21T11:05:00Z"},
	{"show_007", "Browser preview polish", "Fix the empty state and the action column.", entity.ShowcaseStatusOnHold, "Product", 76000, "USD", []string{"frontend", "preview"}, false, "2026-09-25T13:10:00Z"},
	{"show_008", "Data retention policy", "Approve the 24-month retention rule.", entity.ShowcaseStatusArchived, "Legal", 0, "USD", []string{"policy", "data"}, true, "2026-10-01T07:55:00Z"},
	{"show_009", "Ship the design slice", "Connect the gallery to the live showcase API.", entity.ShowcaseStatusActive, "Platform", 1830000, "USD", []string{"backend", "frontend", "design"}, false, "2026-10-03T09:20:00Z"},
	{"show_010", "Seed fixture review", "Keep the showcase examples varied and stable.", entity.ShowcaseStatusActive, "Design", 45000, "IDR", []string{"design", "fixtures"}, false, "2026-10-05T15:40:00Z"},
}

func main() {
	ctx := context.Background()
	cfg, err := xmodule.LoadConfig()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}
	log := xmodule.NewLogger(cfg.LogLevel)

	if err := postgres.Migrate(cfg.DatabaseURL); err != nil {
		log.Error("migrate", "err", err)
		os.Exit(1)
	}
	db, err := postgres.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Error("open", "err", err)
		os.Exit(1)
	}
	repo := postgres.NewShowcaseRepository(db)

	created, skipped := 0, 0
	for _, f := range fixtures {
		createdAt, err := time.Parse(time.RFC3339, f.createdAt)
		if err != nil {
			log.Error("fixture time", "id", f.id, "err", err)
			os.Exit(1)
		}
		item, err := entity.NewShowcaseItem(
			f.id,
			f.title,
			f.description,
			f.owner,
			f.currency,
			f.status,
			f.amount,
			f.tags,
			createdAt,
		)
		if err != nil {
			log.Error("fixture", "id", f.id, "err", err)
			os.Exit(1)
		}
		item.SetDone(f.done)

		if _, err := repo.Get(ctx, f.id); err == nil {
			skipped++
			continue
		} else if !errors.Is(err, port.ErrNotFound) {
			log.Error("check fixture", "id", f.id, "err", err)
			os.Exit(1)
		}
		if err := repo.Create(ctx, item); err != nil {
			log.Error("seed fixture", "id", f.id, "err", err)
			os.Exit(1)
		}
		created++
	}
	log.Info("seed complete", "created", created, "skipped", skipped)
}
