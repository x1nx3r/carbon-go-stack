package postgres

import (
	"context"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"

	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

type customerRow struct {
	ID           string    `gorm:"column:id;primaryKey"`
	Name         string    `gorm:"column:name"`
	Email        string    `gorm:"column:email"`
	Status       int16     `gorm:"column:status"`
	BalanceMinor int64     `gorm:"column:balance_minor"`
	Currency     string    `gorm:"column:currency"`
	CreatedAt    time.Time `gorm:"column:created_at"`
}

func (customerRow) TableName() string { return "customers" }

type CustomerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) *CustomerRepository {
	return &CustomerRepository{db: db}
}

func (r *CustomerRepository) List(ctx context.Context, query port.ListQuery) (port.CustomerPage, error) {
	base := r.db.WithContext(ctx).Model(&customerRow{})
	if query.Search != "" {
		like := "%" + query.Search + "%"
		base = base.Where("name ILIKE ? OR email ILIKE ?", like, like)
	}

	var total int64
	if err := base.Count(&total).Error; err != nil {
		return port.CustomerPage{}, fmt.Errorf("count customers: %w", err)
	}

	var rows []customerRow
	if err := base.
		Order("created_at DESC, id ASC").
		Limit(query.PageSize).
		Offset((query.Page - 1) * query.PageSize).
		Find(&rows).Error; err != nil {
		return port.CustomerPage{}, fmt.Errorf("list customers: %w", err)
	}

	customers := make([]entity.Customer, 0, len(rows))
	for _, row := range rows {
		customers = append(customers, row.toEntity())
	}
	return port.CustomerPage{Customers: customers, Total: int(total)}, nil
}

func (r *CustomerRepository) Get(ctx context.Context, id string) (entity.Customer, error) {
	var row customerRow
	if err := r.db.WithContext(ctx).First(&row, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.Customer{}, port.ErrNotFound
		}
		return entity.Customer{}, fmt.Errorf("get customer: %w", err)
	}
	return row.toEntity(), nil
}

func (r *CustomerRepository) Create(ctx context.Context, customer entity.Customer) error {
	row := fromEntity(customer)
	if err := r.db.WithContext(ctx).Create(&row).Error; err != nil {
		return fmt.Errorf("create customer: %w", err)
	}
	return nil
}

func (r *CustomerRepository) Update(ctx context.Context, customer entity.Customer) error {
	result := r.db.WithContext(ctx).
		Model(&customerRow{}).
		Where("id = ?", customer.ID).
		Updates(map[string]any{
			"name":          customer.Name,
			"email":         customer.Email,
			"status":        int16(customer.Status),
			"balance_minor": customer.BalanceMinor,
			"currency":      customer.Currency,
		})
	if result.Error != nil {
		return fmt.Errorf("update customer: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		// Postgres reports zero rows when the update is a no-op, so existence
		// is the check, not the changed-row count.
		var count int64
		if err := r.db.WithContext(ctx).
			Model(&customerRow{}).
			Where("id = ?", customer.ID).
			Count(&count).Error; err != nil {
			return fmt.Errorf("check customer: %w", err)
		}
		if count == 0 {
			return port.ErrNotFound
		}
	}
	return nil
}

func (r *CustomerRepository) Delete(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).Delete(&customerRow{}, "id = ?", id)
	if result.Error != nil {
		return fmt.Errorf("delete customer: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return port.ErrNotFound
	}
	return nil
}

func (r customerRow) toEntity() entity.Customer {
	return entity.Customer{
		ID:           r.ID,
		Name:         r.Name,
		Email:        r.Email,
		Status:       entity.Status(r.Status),
		BalanceMinor: r.BalanceMinor,
		Currency:     r.Currency,
		CreatedAt:    r.CreatedAt.UTC(),
	}
}

func fromEntity(customer entity.Customer) customerRow {
	return customerRow{
		ID:           customer.ID,
		Name:         customer.Name,
		Email:        customer.Email,
		Status:       int16(customer.Status),
		BalanceMinor: customer.BalanceMinor,
		Currency:     customer.Currency,
		CreatedAt:    customer.CreatedAt.UTC(),
	}
}
