package postgres_test

import (
	"context"
	"os"
	"testing"
	"time"

	"erp-api/internal/adapter/postgres"
	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

// Guarded integration test against the throwaway Postgres.
//
//	ERP_INTEGRATION=1 ERP_TEST_DATABASE_URL=postgres://erp:erp@127.0.0.1:55432/erp?sslmode=disable go test ./internal/adapter/postgres
func TestShowcaseRepositoryRoundTrip(t *testing.T) {
	if os.Getenv("ERP_INTEGRATION") != "1" {
		t.Skip("set ERP_INTEGRATION=1 to run against Postgres")
	}
	dsn := os.Getenv("ERP_TEST_DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://erp:erp@127.0.0.1:55432/erp?sslmode=disable"
	}
	ctx := context.Background()
	if err := postgres.Migrate(dsn); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	db, err := postgres.Open(ctx, dsn)
	if err != nil {
		t.Fatalf("open: %v", err)
	}
	repo := postgres.NewShowcaseRepository(db)
	t.Cleanup(func() { _ = repo.Delete(ctx, "it_showcase") })

	item, err := entity.NewShowcaseItem(
		"it_showcase",
		"Integration Test",
		"from the postgres test",
		"Platform",
		"USD",
		entity.ShowcaseStatusActive,
		1200,
		[]string{"one", "two"},
		time.Now().UTC(),
	)
	if err != nil {
		t.Fatalf("entity: %v", err)
	}
	if err := repo.Create(ctx, item); err != nil {
		t.Fatalf("create: %v", err)
	}
	got, err := repo.Get(ctx, item.ID)
	if err != nil {
		t.Fatalf("get: %v", err)
	}
	if got.Title != item.Title || got.Done || len(got.Tags) != 2 {
		t.Fatalf("item = %+v", got)
	}

	got.Title = "Integration Test Updated"
	got.SetDone(true)
	got.SetStatus(entity.ShowcaseStatusOnHold)
	got.UpdatedAt = time.Now().UTC()
	if err := repo.Update(ctx, got); err != nil {
		t.Fatalf("update: %v", err)
	}
	if err := repo.Update(ctx, got); err != nil {
		t.Fatalf("unchanged update must succeed: %v", err)
	}
	page, err := repo.List(ctx, port.ShowcaseQuery{Page: 1, PageSize: 10})
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	found := 0
	for _, item := range page.Items {
		if item.ID == "it_showcase" {
			found++
		}
	}
	if found != 1 {
		t.Fatalf("updated item missing from list: %+v", page)
	}
	if err := repo.Delete(ctx, "it_showcase"); err != nil {
		t.Fatalf("delete: %v", err)
	}
	if _, err := repo.Get(ctx, "it_showcase"); err == nil {
		t.Fatal("deleted item still exists")
	}
}

func TestShowcaseRepositoryListFiltersStatusAndSearch(t *testing.T) {
	if os.Getenv("ERP_INTEGRATION") != "1" {
		t.Skip("set ERP_INTEGRATION=1 to run against Postgres")
	}
	dsn := os.Getenv("ERP_TEST_DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://erp:erp@127.0.0.1:55432/erp?sslmode=disable"
	}
	ctx := context.Background()
	db, err := postgres.Open(ctx, dsn)
	if err != nil {
		t.Fatalf("open: %v", err)
	}
	repo := postgres.NewShowcaseRepository(db)

	open, err := entity.NewShowcaseItem("it_showcase_open", "Alpha open", "", "Platform", "USD", entity.ShowcaseStatusActive, 0, nil, time.Now().UTC())
	if err != nil {
		t.Fatalf("entity: %v", err)
	}
	hold, err := entity.NewShowcaseItem("it_showcase_hold", "Beta hold", "", "Design", "USD", entity.ShowcaseStatusOnHold, 0, nil, time.Now().UTC())
	if err != nil {
		t.Fatalf("entity: %v", err)
	}
	for _, item := range []entity.ShowcaseItem{open, hold} {
		t.Cleanup(func() { _ = repo.Delete(ctx, item.ID) })
		if err := repo.Create(ctx, item); err != nil {
			t.Fatalf("create %s: %v", item.ID, err)
		}
	}

	filtered, err := repo.List(ctx, port.ShowcaseQuery{Page: 1, PageSize: 100, Status: entity.ShowcaseStatusOnHold})
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	for _, item := range filtered.Items {
		if item.ID == open.ID {
			t.Fatalf("active item listed under on_hold filter: %+v", item)
		}
	}
	found, err := repo.List(ctx, port.ShowcaseQuery{Page: 1, PageSize: 100, Search: "Beta"})
	if err != nil {
		t.Fatalf("search: %v", err)
	}
	var seen bool
	for _, item := range found.Items {
		if item.ID == hold.ID {
			seen = true
		}
	}
	if !seen {
		t.Fatal("search did not find the hold item")
	}
}
