package customers

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
	repo  port.CustomerRepository
	clock port.Clock
	ids   port.IDs
}

func New(repo port.CustomerRepository, clock port.Clock, ids port.IDs) UseCase {
	return &usecase{repo: repo, clock: clock, ids: ids}
}

func (uc *usecase) List(ctx context.Context, input ListInput) (port.CustomerPage, error) {
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
	return uc.repo.List(ctx, port.ListQuery{
		Page:     page,
		PageSize: size,
		Search:   strings.TrimSpace(input.Search),
	})
}

func (uc *usecase) Get(ctx context.Context, id string) (entity.Customer, error) {
	if strings.TrimSpace(id) == "" {
		return entity.Customer{}, fmt.Errorf("%w: id is required", ErrInvalid)
	}
	customer, err := uc.repo.Get(ctx, id)
	if err != nil {
		return entity.Customer{}, mapRepoError(err)
	}
	return customer, nil
}

func (uc *usecase) Create(ctx context.Context, input CreateInput) (entity.Customer, error) {
	customer, err := entity.NewCustomer(
		uc.ids.NewID(),
		input.Name,
		input.Email,
		input.Currency,
		uc.clock.Now(),
	)
	if err != nil {
		return entity.Customer{}, fmt.Errorf("%w: %v", ErrInvalid, err)
	}
	if err := uc.repo.Create(ctx, customer); err != nil {
		return entity.Customer{}, mapRepoError(err)
	}
	return customer, nil
}

func (uc *usecase) Update(ctx context.Context, input UpdateInput) (entity.Customer, error) {
	customer, err := uc.Get(ctx, input.ID)
	if err != nil {
		return entity.Customer{}, err
	}
	if err := customer.Update(input.Name, input.Email, input.Currency); err != nil {
		return entity.Customer{}, fmt.Errorf("%w: %v", ErrInvalid, err)
	}
	if err := uc.repo.Update(ctx, customer); err != nil {
		return entity.Customer{}, mapRepoError(err)
	}
	return customer, nil
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
