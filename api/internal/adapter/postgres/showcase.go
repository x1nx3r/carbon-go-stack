package postgres

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"

	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

type showcaseRow struct {
	ID          string         `gorm:"column:id;primaryKey"`
	Title       string         `gorm:"column:title"`
	Description string         `gorm:"column:description"`
	Status      int16          `gorm:"column:status"`
	Owner       string         `gorm:"column:owner"`
	AmountMinor int64          `gorm:"column:amount_minor"`
	Currency    string         `gorm:"column:currency"`
	Tags        pq.StringArray `gorm:"column:tags;type:text[]"`
	Done        bool           `gorm:"column:done"`
	CreatedAt   time.Time      `gorm:"column:created_at"`
	UpdatedAt   time.Time      `gorm:"column:updated_at"`
}

func (showcaseRow) TableName() string { return "showcase_items" }

type ShowcaseRepository struct {
	db *gorm.DB
}

func NewShowcaseRepository(db *gorm.DB) *ShowcaseRepository {
	return &ShowcaseRepository{db: db}
}

func (r *ShowcaseRepository) List(ctx context.Context, query port.ShowcaseQuery) (port.ShowcasePage, error) {
	base := r.db.WithContext(ctx).Model(&showcaseRow{})
	if query.Search != "" {
		like := "%" + query.Search + "%"
		base = base.Where("title ILIKE ? OR owner ILIKE ?", like, like)
	}
	if query.Status != entity.ShowcaseStatusUnspecified {
		base = base.Where("status = ?", int16(query.Status))
	}

	var total int64
	if err := base.Count(&total).Error; err != nil {
		return port.ShowcasePage{}, fmt.Errorf("count showcase items: %w", err)
	}

	var rows []showcaseRow
	if err := base.
		Order("updated_at DESC, id ASC").
		Limit(query.PageSize).
		Offset((query.Page - 1) * query.PageSize).
		Find(&rows).Error; err != nil {
		return port.ShowcasePage{}, fmt.Errorf("list showcase items: %w", err)
	}

	items := make([]entity.ShowcaseItem, 0, len(rows))
	for _, row := range rows {
		items = append(items, row.toEntity())
	}
	return port.ShowcasePage{Items: items, Total: int(total)}, nil
}

func (r *ShowcaseRepository) Get(ctx context.Context, id string) (entity.ShowcaseItem, error) {
	var row showcaseRow
	if err := r.db.WithContext(ctx).First(&row, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.ShowcaseItem{}, port.ErrNotFound
		}
		return entity.ShowcaseItem{}, fmt.Errorf("get showcase item: %w", err)
	}
	return row.toEntity(), nil
}

func (r *ShowcaseRepository) Create(ctx context.Context, item entity.ShowcaseItem) error {
	row := showcaseFromEntity(item)
	if err := r.db.WithContext(ctx).Create(&row).Error; err != nil {
		return fmt.Errorf("create showcase item: %w", err)
	}
	return nil
}

func (r *ShowcaseRepository) Update(ctx context.Context, item entity.ShowcaseItem) error {
	result := r.db.WithContext(ctx).
		Model(&showcaseRow{}).
		Where("id = ?", item.ID).
		Updates(map[string]any{
			"title":        item.Title,
			"description":  item.Description,
			"status":       int16(item.Status),
			"owner":        item.Owner,
			"amount_minor": item.AmountMinor,
			"currency":     item.Currency,
			"tags":         pq.StringArray(item.Tags),
			"done":         item.Done,
			"updated_at":   item.UpdatedAt.UTC(),
		})
	if result.Error != nil {
		return fmt.Errorf("update showcase item: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		var count int64
		if err := r.db.WithContext(ctx).
			Model(&showcaseRow{}).
			Where("id = ?", item.ID).
			Count(&count).Error; err != nil {
			return fmt.Errorf("check showcase item: %w", err)
		}
		if count == 0 {
			return port.ErrNotFound
		}
	}
	return nil
}

func (r *ShowcaseRepository) Delete(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).Delete(&showcaseRow{}, "id = ?", id)
	if result.Error != nil {
		return fmt.Errorf("delete showcase item: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return port.ErrNotFound
	}
	return nil
}

func (r showcaseRow) toEntity() entity.ShowcaseItem {
	return entity.ShowcaseItem{
		ID:          r.ID,
		Title:       r.Title,
		Description: r.Description,
		Status:      entity.ShowcaseStatus(r.Status),
		Owner:       r.Owner,
		AmountMinor: r.AmountMinor,
		Currency:    r.Currency,
		Tags:        append([]string(nil), r.Tags...),
		Done:        r.Done,
		CreatedAt:   r.CreatedAt.UTC(),
		UpdatedAt:   r.UpdatedAt.UTC(),
	}
}

func showcaseFromEntity(item entity.ShowcaseItem) showcaseRow {
	return showcaseRow{
		ID:          item.ID,
		Title:       item.Title,
		Description: item.Description,
		Status:      int16(item.Status),
		Owner:       item.Owner,
		AmountMinor: item.AmountMinor,
		Currency:    item.Currency,
		Tags:        pq.StringArray(item.Tags),
		Done:        item.Done,
		CreatedAt:   item.CreatedAt.UTC(),
		UpdatedAt:   item.UpdatedAt.UTC(),
	}
}
