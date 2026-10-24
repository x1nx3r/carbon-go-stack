package customers

import (
	"context"
	"errors"
	"testing"
	"time"

	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

type fakeRepo struct {
	customers map[string]entity.Customer
	lastQuery port.ListQuery
}

func newFakeRepo() *fakeRepo {
	return &fakeRepo{customers: map[string]entity.Customer{}}
}

func (f *fakeRepo) List(_ context.Context, query port.ListQuery) (port.CustomerPage, error) {
	f.lastQuery = query
	return port.CustomerPage{Customers: []entity.Customer{}, Total: 0}, nil
}

func (f *fakeRepo) Get(_ context.Context, id string) (entity.Customer, error) {
	customer, ok := f.customers[id]
	if !ok {
		return entity.Customer{}, port.ErrNotFound
	}
	return customer, nil
}

func (f *fakeRepo) Create(_ context.Context, customer entity.Customer) error {
	f.customers[customer.ID] = customer
	return nil
}

func (f *fakeRepo) Update(_ context.Context, customer entity.Customer) error {
	if _, ok := f.customers[customer.ID]; !ok {
		return port.ErrNotFound
	}
	f.customers[customer.ID] = customer
	return nil
}

func (f *fakeRepo) Delete(_ context.Context, id string) error {
	if _, ok := f.customers[id]; !ok {
		return port.ErrNotFound
	}
	delete(f.customers, id)
	return nil
}

type fixedClock struct{}

func (fixedClock) Now() time.Time { return time.Date(2026, 10, 24, 9, 0, 0, 0, time.UTC) }

type fixedIDs struct{}

func (fixedIDs) NewID() string { return "cus_fixed" }

func newUseCase(repo port.CustomerRepository) UseCase {
	return New(repo, fixedClock{}, fixedIDs{})
}

func TestCreateUsesTemplateDefaults(t *testing.T) {
	repo := newFakeRepo()
	uc := newUseCase(repo)

	customer, err := uc.Create(context.Background(), CreateInput{
		Name:  "Northwind Supply",
		Email: "ap@northwind.example",
	})
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if customer.ID != "cus_fixed" || customer.Status != entity.StatusActive {
		t.Fatalf("customer = %+v, want fixed id and active status", customer)
	}
	if customer.Currency != "USD" || customer.BalanceMinor != 0 {
		t.Fatalf("customer = %+v, want USD and zero balance", customer)
	}
	if !customer.CreatedAt.Equal(fixedClock{}.Now()) {
		t.Fatalf("created_at = %v, want clock value", customer.CreatedAt)
	}
}

func TestCreateRejectsInvalidInput(t *testing.T) {
	uc := newUseCase(newFakeRepo())
	_, err := uc.Create(context.Background(), CreateInput{Name: "", Email: "not-an-email"})
	if !errors.Is(err, ErrInvalid) {
		t.Fatalf("err = %v, want ErrInvalid", err)
	}
}

func TestListClampsPagination(t *testing.T) {
	repo := newFakeRepo()
	uc := newUseCase(repo)
	if _, err := uc.List(context.Background(), ListInput{Page: -1, PageSize: 1000}); err != nil {
		t.Fatalf("list: %v", err)
	}
	if repo.lastQuery.Page != 1 || repo.lastQuery.PageSize != maxPageSize {
		t.Fatalf("query = %+v, want page 1 and size %d", repo.lastQuery, maxPageSize)
	}
}

func TestUpdateAndDeleteMapNotFound(t *testing.T) {
	uc := newUseCase(newFakeRepo())
	_, err := uc.Update(context.Background(), UpdateInput{ID: "missing", Name: "A", Email: "a@example.com"})
	if !errors.Is(err, ErrNotFound) {
		t.Fatalf("update err = %v, want ErrNotFound", err)
	}
	if err := uc.Delete(context.Background(), "missing"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("delete err = %v, want ErrNotFound", err)
	}
}

func TestUpdateChangesEditableFields(t *testing.T) {
	repo := newFakeRepo()
	uc := newUseCase(repo)
	created, err := uc.Create(context.Background(), CreateInput{Name: "Old", Email: "old@example.com", Currency: "USD"})
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	updated, err := uc.Update(context.Background(), UpdateInput{
		ID:       created.ID,
		Name:     "New",
		Email:    "new@example.com",
		Currency: "IDR",
	})
	if err != nil {
		t.Fatalf("update: %v", err)
	}
	if updated.Name != "New" || updated.Email != "new@example.com" || updated.Currency != "IDR" {
		t.Fatalf("updated = %+v", updated)
	}
	if updated.Status != entity.StatusActive || updated.ID != created.ID {
		t.Fatalf("update changed immutable fields: %+v", updated)
	}
}
