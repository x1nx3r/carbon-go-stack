package port

import (
	"context"

	"erp-api/internal/entity"
)

// ShowcaseQuery is the design slice's list contract: a page, a search, and an
// optional status filter. Status zero means every status.
type ShowcaseQuery struct {
	Page     int
	PageSize int
	Search   string
	Status   entity.ShowcaseStatus
}

type ShowcasePage struct {
	Items []entity.ShowcaseItem
	Total int
}

// ShowcaseRepository is owned by the app side; the Postgres adapter implements
// it. It deals only in domain types.
type ShowcaseRepository interface {
	List(ctx context.Context, query ShowcaseQuery) (ShowcasePage, error)
	Get(ctx context.Context, id string) (entity.ShowcaseItem, error)
	Create(ctx context.Context, item entity.ShowcaseItem) error
	Update(ctx context.Context, item entity.ShowcaseItem) error
	Delete(ctx context.Context, id string) error
}
