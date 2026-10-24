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
func TestCustomerRepositoryRoundTrip(t *testing.T) {
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
	repo := postgres.NewCustomerRepository(db)
	t.Cleanup(func() { _ = repo.Delete(ctx, "it_customer") })

	customer, err := entity.NewCustomer("it_customer", "Integration Test", "integration@test.example", "USD", time.Now().UTC())
	if err != nil {
		t.Fatalf("entity: %v", err)
	}
	if err := repo.Create(ctx, customer); err != nil {
		t.Fatalf("create: %v", err)
	}
	got, err := repo.Get(ctx, customer.ID)
	if err != nil {
		t.Fatalf("get: %v", err)
	}
	if got.Name != customer.Name {
		t.Fatalf("name = %q", got.Name)
	}

	got.Name = "Integration Test Updated"
	if err := repo.Update(ctx, got); err != nil {
		t.Fatalf("update: %v", err)
	}
	page, err := repo.List(ctx, port.ListQuery{Page: 1, PageSize: 10, Search: "Integration Test Updated"})
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if page.Total != 1 || len(page.Customers) != 1 {
		t.Fatalf("page = %+v", page)
	}
	if err := repo.Delete(ctx, customer.ID); err != nil {
		t.Fatalf("delete: %v", err)
	}
	if _, err := repo.Get(ctx, customer.ID); err == nil {
		t.Fatal("deleted customer still exists")
	}
}
