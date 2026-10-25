package showcase

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"erp-api/internal/app/port"
	"erp-api/internal/entity"
)

type fakeRepo struct {
	items     map[string]entity.ShowcaseItem
	lastQuery port.ShowcaseQuery
}

func newFakeRepo() *fakeRepo {
	return &fakeRepo{items: map[string]entity.ShowcaseItem{}}
}

func (f *fakeRepo) List(_ context.Context, query port.ShowcaseQuery) (port.ShowcasePage, error) {
	f.lastQuery = query
	return port.ShowcasePage{Items: []entity.ShowcaseItem{}, Total: 0}, nil
}

func (f *fakeRepo) Get(_ context.Context, id string) (entity.ShowcaseItem, error) {
	item, ok := f.items[id]
	if !ok {
		return entity.ShowcaseItem{}, port.ErrNotFound
	}
	return item, nil
}

func (f *fakeRepo) Create(_ context.Context, item entity.ShowcaseItem) error {
	f.items[item.ID] = item
	return nil
}

func (f *fakeRepo) Update(_ context.Context, item entity.ShowcaseItem) error {
	if _, ok := f.items[item.ID]; !ok {
		return port.ErrNotFound
	}
	f.items[item.ID] = item
	return nil
}

func (f *fakeRepo) Delete(_ context.Context, id string) error {
	if _, ok := f.items[id]; !ok {
		return port.ErrNotFound
	}
	delete(f.items, id)
	return nil
}

type stepClock struct{ calls int }

func (c *stepClock) Now() time.Time {
	c.calls++
	return time.Date(2026, 10, 26, 9, c.calls, 0, 0, time.UTC)
}

type fixedIDs struct{}

func (fixedIDs) NewID() string { return "show_fixed" }

func newUseCase(repo port.ShowcaseRepository, clock port.Clock) UseCase {
	return New(repo, clock, fixedIDs{})
}

func TestCreateUsesDefaults(t *testing.T) {
	repo := newFakeRepo()
	uc := newUseCase(repo, &stepClock{})

	item, err := uc.Create(context.Background(), CreateInput{
		Title:       "Ship the design slice",
		Description: "Connect the gallery.",
		Owner:       "Platform",
		AmountMinor: 1000,
		Currency:    "usd",
		Tags:        []string{"design", "backend", "Design"},
	})
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if item.ID != "show_fixed" || item.Status != entity.ShowcaseStatusActive {
		t.Fatalf("item = %+v", item)
	}
	if !item.UpdatedAt.Equal(item.CreatedAt) {
		t.Fatalf("timestamps = %v/%v", item.CreatedAt, item.UpdatedAt)
	}
	if len(item.Tags) != 2 || item.Tags[0] != "design" || item.Tags[1] != "backend" {
		t.Fatalf("tags = %v", item.Tags)
	}
}

func TestCreateRejectsInvalidInput(t *testing.T) {
	uc := newUseCase(newFakeRepo(), &stepClock{})
	cases := []CreateInput{
		{Title: ""},
		{Title: "ok", Description: strings.Repeat("x", entity.MaxShowcaseDescriptionRunes+1)},
		{Title: "ok", AmountMinor: -1},
		{Title: "ok", Currency: "US"},
		{Title: "ok", Tags: []string{"one", "two", "three", "four", "five", "six", "seven"}},
	}
	for _, input := range cases {
		if _, err := uc.Create(context.Background(), input); !errors.Is(err, ErrInvalid) {
			t.Fatalf("input %+v: err = %v, want ErrInvalid", input, err)
		}
	}
}

func TestListClampsAndValidatesStatus(t *testing.T) {
	repo := newFakeRepo()
	uc := newUseCase(repo, &stepClock{})
	if _, err := uc.List(context.Background(), ListInput{Page: -1, PageSize: 1000}); err != nil {
		t.Fatalf("list: %v", err)
	}
	if repo.lastQuery.Page != 1 || repo.lastQuery.PageSize != maxPageSize {
		t.Fatalf("query = %+v", repo.lastQuery)
	}
	if _, err := uc.List(context.Background(), ListInput{Status: entity.ShowcaseStatus(99)}); !errors.Is(err, ErrInvalid) {
		t.Fatalf("err = %v, want ErrInvalid", err)
	}
}

func TestUpdateAndDeleteMapNotFound(t *testing.T) {
	uc := newUseCase(newFakeRepo(), &stepClock{})
	if _, err := uc.Update(context.Background(), UpdateInput{ID: "missing", Title: "A", Status: entity.ShowcaseStatusActive}); !errors.Is(err, ErrNotFound) {
		t.Fatalf("update err = %v", err)
	}
	if err := uc.Delete(context.Background(), "missing"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("delete err = %v", err)
	}
}

func TestUpdateChangesEditableFields(t *testing.T) {
	repo := newFakeRepo()
	uc := newUseCase(repo, &stepClock{})
	created, err := uc.Create(context.Background(), CreateInput{Title: "Old", Status: entity.ShowcaseStatusActive})
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	updated, err := uc.Update(context.Background(), UpdateInput{
		ID:          created.ID,
		Title:       "New",
		Description: "Changed",
		Status:      entity.ShowcaseStatusOnHold,
		Owner:       "Design",
		AmountMinor: 42,
		Currency:    "EUR",
		Tags:        []string{"one"},
		Done:        true,
	})
	if err != nil {
		t.Fatalf("update: %v", err)
	}
	if updated.Title != "New" || updated.Status != entity.ShowcaseStatusOnHold || !updated.Done {
		t.Fatalf("updated = %+v", updated)
	}
	if updated.UpdatedAt.Equal(created.UpdatedAt) {
		t.Fatalf("updated_at did not advance")
	}
	if updated.ID != created.ID || !updated.CreatedAt.Equal(created.CreatedAt) {
		t.Fatalf("immutable fields changed: %+v", updated)
	}
}
