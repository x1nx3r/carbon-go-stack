package showcase

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

const (
	defaultPageSize = 20
	maxPageSize     = 100
)

type usecase struct {
	repo  port.ShowcaseRepository
	clock port.Clock
	ids   port.IDs
}

func New(repo port.ShowcaseRepository, clock port.Clock, ids port.IDs) UseCase {
	return &usecase{repo: repo, clock: clock, ids: ids}
}

func (uc *usecase) List(ctx context.Context, input ListInput) (port.ShowcasePage, error) {
	page := input.Page
	if page < 1 {
		page = 1
	}
	size := input.PageSize
	if size < 1 {
		size = defaultPageSize
	}
	if size > maxPageSize {
		size = maxPageSize
	}
	if input.Status != entity.ShowcaseStatusUnspecified && !input.Status.Valid() {
		return port.ShowcasePage{}, fmt.Errorf("%w: status", ErrInvalid)
	}
	return uc.repo.List(ctx, port.ShowcaseQuery{
		Page:     page,
		PageSize: size,
		Search:   strings.TrimSpace(input.Search),
		Status:   input.Status,
	})
}

func (uc *usecase) Get(ctx context.Context, id string) (entity.ShowcaseItem, error) {
	if strings.TrimSpace(id) == "" {
		return entity.ShowcaseItem{}, fmt.Errorf("%w: id is required", ErrInvalid)
	}
	item, err := uc.repo.Get(ctx, id)
	if err != nil {
		return entity.ShowcaseItem{}, mapRepoError(err)
	}
	return item, nil
}

func (uc *usecase) Create(ctx context.Context, input CreateInput) (entity.ShowcaseItem, error) {
	item, err := entity.NewShowcaseItem(
		uc.ids.NewID(),
		input.Title,
		input.Description,
		input.Owner,
		input.Currency,
		input.Status,
		input.AmountMinor,
		input.Tags,
		uc.clock.Now(),
	)
	if err != nil {
		return entity.ShowcaseItem{}, fmt.Errorf("%w: %v", ErrInvalid, err)
	}
	item.SetDone(input.Done)
	if err := uc.repo.Create(ctx, item); err != nil {
		return entity.ShowcaseItem{}, mapRepoError(err)
	}
	return item, nil
}

func (uc *usecase) Update(ctx context.Context, input UpdateInput) (entity.ShowcaseItem, error) {
	item, err := uc.Get(ctx, input.ID)
	if err != nil {
		return entity.ShowcaseItem{}, err
	}
	if err := item.Update(
		input.Title,
		input.Description,
		input.Owner,
		input.Currency,
		input.Status,
		input.AmountMinor,
		input.Tags,
		input.Done,
	); err != nil {
		return entity.ShowcaseItem{}, fmt.Errorf("%w: %v", ErrInvalid, err)
	}
	item.UpdatedAt = uc.clock.Now().UTC()
	if err := uc.repo.Update(ctx, item); err != nil {
		return entity.ShowcaseItem{}, mapRepoError(err)
	}
	return item, nil
}

func (uc *usecase) Delete(ctx context.Context, id string) error {
	if strings.TrimSpace(id) == "" {
		return fmt.Errorf("%w: id is required", ErrInvalid)
	}
	if err := uc.repo.Delete(ctx, id); err != nil {
		return mapRepoError(err)
	}
	return nil
}

func mapRepoError(err error) error {
	if err == nil {
		return nil
	}
	if errors.Is(err, port.ErrNotFound) {
		return ErrNotFound
	}
	return err
}
