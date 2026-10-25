package entity

import (
	"errors"
	"fmt"
	"strings"
	"time"
	"unicode/utf8"
)

// ShowcaseStatus is the demo record's lifecycle state. The numeric values
// match the protobuf enum so the transport mapping stays a straight cast.
type ShowcaseStatus int32

const (
	ShowcaseStatusUnspecified ShowcaseStatus = 0
	ShowcaseStatusActive      ShowcaseStatus = 1
	ShowcaseStatusOnHold      ShowcaseStatus = 2
	ShowcaseStatusArchived    ShowcaseStatus = 3
)

func (s ShowcaseStatus) Valid() bool {
	return s >= ShowcaseStatusActive && s <= ShowcaseStatusArchived
}

const (
	MaxShowcaseTitleRunes       = 120
	MaxShowcaseDescriptionRunes = 1000
	MaxShowcaseOwnerRunes       = 80
	MaxShowcaseTags             = 6
	MaxShowcaseTagRunes         = 24
)

var (
	ErrShowcaseIDRequired       = errors.New("showcase id is required")
	ErrShowcaseTitleRequired    = errors.New("showcase title is required")
	ErrShowcaseTitleTooLong     = errors.New("showcase title is too long")
	ErrShowcaseDescriptionLong  = errors.New("showcase description is too long")
	ErrShowcaseOwnerTooLong     = errors.New("showcase owner is too long")
	ErrShowcaseCurrencyInvalid  = errors.New("showcase currency must be a three-letter code")
	ErrShowcaseAmountInvalid    = errors.New("showcase amount must not be negative")
	ErrShowcaseStatusInvalid    = errors.New("showcase status is invalid")
	ErrShowcaseTagsInvalid      = errors.New("showcase tags are invalid")
	ErrShowcaseCreatedAtMissing = errors.New("showcase created_at is required")
)

// ShowcaseItem is the demo record behind the design slice. It exercises the
// full backend tower without becoming a second product domain.
type ShowcaseItem struct {
	ID          string
	Title       string
	Description string
	Status      ShowcaseStatus
	Owner       string
	AmountMinor int64
	Currency    string
	Tags        []string
	Done        bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// NewShowcaseItem builds an active demo record.
func NewShowcaseItem(
	id, title, description, owner, currency string,
	status ShowcaseStatus,
	amountMinor int64,
	tags []string,
	createdAt time.Time,
) (ShowcaseItem, error) {
	item := ShowcaseItem{
		ID:          strings.TrimSpace(id),
		Status:      ShowcaseStatusActive,
		AmountMinor: amountMinor,
		Currency:    strings.ToUpper(strings.TrimSpace(currency)),
		CreatedAt:   createdAt.UTC(),
	}
	if item.ID == "" {
		return ShowcaseItem{}, ErrShowcaseIDRequired
	}
	if item.CreatedAt.IsZero() {
		return ShowcaseItem{}, ErrShowcaseCreatedAtMissing
	}
	if status != ShowcaseStatusUnspecified {
		if err := item.SetStatus(status); err != nil {
			return ShowcaseItem{}, err
		}
	}
	if err := item.SetTitle(title); err != nil {
		return ShowcaseItem{}, err
	}
	if err := item.SetDescription(description); err != nil {
		return ShowcaseItem{}, err
	}
	if err := item.SetOwner(owner); err != nil {
		return ShowcaseItem{}, err
	}
	if err := item.SetAmount(amountMinor); err != nil {
		return ShowcaseItem{}, err
	}
	if err := item.SetCurrency(currency); err != nil {
		return ShowcaseItem{}, err
	}
	if err := item.SetTags(tags); err != nil {
		return ShowcaseItem{}, err
	}
	item.UpdatedAt = item.CreatedAt
	return item, nil
}

func (s *ShowcaseItem) SetTitle(title string) error {
	title = strings.TrimSpace(title)
	if title == "" {
		return ErrShowcaseTitleRequired
	}
	if utf8.RuneCountInString(title) > MaxShowcaseTitleRunes {
		return ErrShowcaseTitleTooLong
	}
	s.Title = title
	return nil
}

func (s *ShowcaseItem) SetDescription(description string) error {
	description = strings.TrimSpace(description)
	if utf8.RuneCountInString(description) > MaxShowcaseDescriptionRunes {
		return ErrShowcaseDescriptionLong
	}
	s.Description = description
	return nil
}

func (s *ShowcaseItem) SetOwner(owner string) error {
	owner = strings.TrimSpace(owner)
	if utf8.RuneCountInString(owner) > MaxShowcaseOwnerRunes {
		return ErrShowcaseOwnerTooLong
	}
	s.Owner = owner
	return nil
}

func (s *ShowcaseItem) SetAmount(amount int64) error {
	if amount < 0 {
		return ErrShowcaseAmountInvalid
	}
	s.AmountMinor = amount
	return nil
}

func (s *ShowcaseItem) SetCurrency(currency string) error {
	currency = strings.ToUpper(strings.TrimSpace(currency))
	if currency == "" {
		currency = "USD"
	}
	if len(currency) != 3 {
		return ErrShowcaseCurrencyInvalid
	}
	for _, r := range currency {
		if r < 'A' || r > 'Z' {
			return ErrShowcaseCurrencyInvalid
		}
	}
	s.Currency = currency
	return nil
}

func (s *ShowcaseItem) SetStatus(status ShowcaseStatus) error {
	if !status.Valid() {
		return ErrShowcaseStatusInvalid
	}
	s.Status = status
	return nil
}

func (s *ShowcaseItem) SetTags(tags []string) error {
	seen := make(map[string]struct{}, len(tags))
	normalized := make([]string, 0, len(tags))
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		if tag == "" {
			continue
		}
		if utf8.RuneCountInString(tag) > MaxShowcaseTagRunes {
			return fmt.Errorf("%w: tag %q is longer than %d runes", ErrShowcaseTagsInvalid, tag, MaxShowcaseTagRunes)
		}
		key := strings.ToLower(tag)
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		normalized = append(normalized, tag)
	}
	if len(normalized) > MaxShowcaseTags {
		return fmt.Errorf("%w: at most %d tags are allowed", ErrShowcaseTagsInvalid, MaxShowcaseTags)
	}
	s.Tags = normalized
	return nil
}

func (s *ShowcaseItem) SetDone(done bool) {
	s.Done = done
}

// Update changes the editable fields. The caller owns UpdatedAt.
func (s *ShowcaseItem) Update(title, description, owner, currency string, status ShowcaseStatus, amountMinor int64, tags []string, done bool) error {
	if err := s.SetTitle(title); err != nil {
		return err
	}
	if err := s.SetDescription(description); err != nil {
		return err
	}
	if err := s.SetOwner(owner); err != nil {
		return err
	}
	if err := s.SetStatus(status); err != nil {
		return err
	}
	if err := s.SetAmount(amountMinor); err != nil {
		return err
	}
	if err := s.SetCurrency(currency); err != nil {
		return err
	}
	if err := s.SetTags(tags); err != nil {
		return err
	}
	s.SetDone(done)
	return nil
}
