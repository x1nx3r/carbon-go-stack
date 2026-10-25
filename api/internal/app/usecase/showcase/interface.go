package showcase

import (
	"context"
	"errors"

	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

var (
	ErrNotFound = errors.New("showcase item not found")
	ErrInvalid  = errors.New("invalid showcase item")
)

type ListInput struct {
	Page     int
	PageSize int
	Search   string
	Status   entity.ShowcaseStatus
}

type CreateInput struct {
	Title       string
	Description string
	Status      entity.ShowcaseStatus
	Owner       string
	AmountMinor int64
	Currency    string
	Tags        []string
	Done        bool
}

type UpdateInput struct {
	ID          string
	Title       string
	Description string
	Status      entity.ShowcaseStatus
	Owner       string
	AmountMinor int64
	Currency    string
	Tags        []string
	Done        bool
}

type UseCase interface {
	List(ctx context.Context, input ListInput) (port.ShowcasePage, error)
	Get(ctx context.Context, id string) (entity.ShowcaseItem, error)
	Create(ctx context.Context, input CreateInput) (entity.ShowcaseItem, error)
	Update(ctx context.Context, input UpdateInput) (entity.ShowcaseItem, error)
	Delete(ctx context.Context, id string) error
}
