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
	id        string
	name      string
	email     string
	status    entity.Status
	balance   int64
	currency  string
	createdAt string
}

// Same 23 records as the frontend mock, including readable IDs, so the UI and
// its visual baselines can be exercised unchanged against a real database.
var fixtures = []fixture{
	{"cus_001", "Northwind Supply", "ap@northwind.example", entity.StatusActive, 1245000, "USD", "2026-01-12T09:12:00Z"},
	{"cus_002", "Sagara Retail", "finance@sagara.example", entity.StatusActive, 318000, "IDR", "2026-01-18T03:45:00Z"},
	{"cus_003", "Kite & Co", "billing@kite.example", entity.StatusOnHold, 0, "USD", "2026-02-02T11:30:00Z"},
	{"cus_004", "Meridian Grocers", "ap@meridian.example", entity.StatusActive, 892000, "GBP", "2026-02-11T14:05:00Z"},
	{"cus_005", "Blue Harbor Logistics", "accounts@blueharbor.example", entity.StatusArchived, 0, "USD", "2025-11-27T08:00:00Z"},
	{"cus_006", "Tani Makmur", "owner@tanimakmur.example", entity.StatusActive, 145000, "IDR", "2026-03-01T02:20:00Z"},
	{"cus_007", "Lumen Studio", "hello@lumen.example", entity.StatusActive, 42000, "EUR", "2026-03-14T16:40:00Z"},
	{"cus_008", "Harbor Point Cafe", "manager@harborpoint.example", entity.StatusOnHold, 210000, "USD", "2026-03-22T10:15:00Z"},
	{"cus_009", "Sentosa Pharmacy", "ap@sentosa.example", entity.StatusActive, 76000, "IDR", "2026-04-05T06:55:00Z"},
	{"cus_010", "Cedar & Vine", "accounts@cedarvine.example", entity.StatusActive, 560000, "USD", "2026-04-19T12:10:00Z"},
	{"cus_011", "Atlas Components", "finance@atlas.example", entity.StatusActive, 1830000, "USD", "2026-05-02T09:05:00Z"},
	{"cus_012", "Padi Jaya", "admin@padijaya.example", entity.StatusArchived, 0, "IDR", "2025-12-08T04:30:00Z"},
	{"cus_013", "Ridgeway Parts", "ap@ridgeway.example", entity.StatusActive, 724000, "GBP", "2026-05-21T15:20:00Z"},
	{"cus_014", "Kopi Tepi Jalan", "owner@kopitepi.example", entity.StatusActive, 102000, "IDR", "2026-06-01T01:45:00Z"},
	{"cus_015", "Sino Trading", "billing@sinotrading.example", entity.StatusActive, 2490000, "USD", "2026-06-17T07:35:00Z"},
	{"cus_016", "Fjord Design", "invoice@fjord.example", entity.StatusOnHold, 330000, "EUR", "2026-06-29T13:00:00Z"},
	{"cus_017", "Matahari Textiles", "ap@matahari.example", entity.StatusActive, 678000, "IDR", "2026-07-03T05:25:00Z"},
	{"cus_018", "Greyline Services", "finance@greyline.example", entity.StatusActive, 245000, "USD", "2026-07-19T11:55:00Z"},
	{"cus_019", "Bumi Sejahtera", "owner@bumisejahtera.example", entity.StatusActive, 910000, "IDR", "2026-08-08T03:10:00Z"},
	{"cus_020", "Kingsway Hardware", "ap@kingsway.example", entity.StatusArchived, 0, "GBP", "2026-01-30T10:40:00Z"},
	{"cus_021", "Orchard Bakes", "hello@orchardbakes.example", entity.StatusActive, 89000, "USD", "2026-08-22T08:15:00Z"},
	{"cus_022", "Delta Marine", "accounts@deltamarine.example", entity.StatusActive, 1360000, "USD", "2026-09-04T14:50:00Z"},
	{"cus_023", "Warung Sederhana", "owner@warung.example", entity.StatusOnHold, 31000, "IDR", "2026-09-21T02:05:00Z"},
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
	repo := postgres.NewCustomerRepository(db)

	created, skipped := 0, 0
	for _, f := range fixtures {
		createdAt, err := time.Parse(time.RFC3339, f.createdAt)
		if err != nil {
			log.Error("fixture time", "id", f.id, "err", err)
			os.Exit(1)
		}
		customer, err := entity.NewCustomer(f.id, f.name, f.email, f.currency, createdAt)
		if err != nil {
			log.Error("fixture", "id", f.id, "err", err)
			os.Exit(1)
		}
		customer.BalanceMinor = f.balance
		if err := customer.SetStatus(f.status); err != nil {
			log.Error("fixture status", "id", f.id, "err", err)
			os.Exit(1)
		}

		if _, err := repo.Get(ctx, f.id); err == nil {
			skipped++
			continue
		} else if !errors.Is(err, port.ErrNotFound) {
			log.Error("check fixture", "id", f.id, "err", err)
			os.Exit(1)
		}
		if err := repo.Create(ctx, customer); err != nil {
			log.Error("seed fixture", "id", f.id, "err", err)
			os.Exit(1)
		}
		created++
	}
	log.Info("seed complete", "created", created, "skipped", skipped)
}
