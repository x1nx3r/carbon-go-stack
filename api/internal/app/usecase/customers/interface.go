package customers

import (
	"context"
	"errors"

	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

var (
	ErrNotFound = errors.New("customer not found")
	ErrInvalid  = errors.New("invalid customer")
	ErrConflict = errors.New("customer conflict")
)

type ListInput struct {
	Page     int
	PageSize int
	Search   string
}

type CreateInput struct {
	Name     string
	Email    string
	Currency string
}

type UpdateInput struct {
	ID       string
	Name     string
	Email    string
	Currency string
}

type UseCase interface {
	List(ctx context.Context, input ListInput) (port.CustomerPage, error)
	Get(ctx context.Context, id string) (entity.Customer, error)
	Create(ctx context.Context, input CreateInput) (entity.Customer, error)
	Update(ctx context.Context, input UpdateInput) (entity.Customer, error)
	Delete(ctx context.Context, id string) error
}
