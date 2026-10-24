package port

import (
	"context"
	"errors"
	"time"

	"erp-api/internal/entity"
)

// ErrNotFound lets the repository report a missing row without leaking gorm or
// SQL to the application layer.
var ErrNotFound = errors.New("not found")

type ListQuery struct {
	// Page is 1-based.
	Page     int
	PageSize int
	Search   string
}

type CustomerPage struct {
	Customers []entity.Customer
	Total     int
}

// CustomerRepository is owned by the app side; the Postgres adapter implements
// it. It deals only in domain types.
type CustomerRepository interface {
	List(ctx context.Context, query ListQuery) (CustomerPage, error)
	Get(ctx context.Context, id string) (entity.Customer, error)
	Create(ctx context.Context, customer entity.Customer) error
	Update(ctx context.Context, customer entity.Customer) error
	Delete(ctx context.Context, id string) error
}

type Clock interface {
	Now() time.Time
}

type IDs interface {
	NewID() string
}
