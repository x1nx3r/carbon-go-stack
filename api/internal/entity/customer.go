package entity

import (
	"errors"
	"net/mail"
	"strings"
	"time"
)

// Status is the customer lifecycle state. The numeric values match the
// protobuf enum so the transport mapping stays a straight cast.
type Status int32

const (
	StatusUnspecified Status = 0
	StatusActive      Status = 1
	StatusOnHold      Status = 2
	StatusArchived    Status = 3
)

func (s Status) Valid() bool {
	return s >= StatusActive && s <= StatusArchived
}

var (
	ErrIDRequired       = errors.New("customer id is required")
	ErrNameRequired     = errors.New("customer name is required")
	ErrEmailInvalid     = errors.New("customer email is invalid")
	ErrCurrencyInvalid  = errors.New("currency must be a three-letter code")
	ErrStatusInvalid    = errors.New("customer status is invalid")
	ErrCreatedAtMissing = errors.New("customer created_at is required")
)

// Customer is the domain record. IDs are opaque; money is integer minor units
// plus an ISO 4217 code; timestamps are UTC.
type Customer struct {
	ID           string
	Name         string
	Email        string
	Status       Status
	BalanceMinor int64
	Currency     string
	CreatedAt    time.Time
}

// NewCustomer builds an active customer with a zero balance.
func NewCustomer(id, name, email, currency string, createdAt time.Time) (Customer, error) {
	customer := Customer{
		ID:        strings.TrimSpace(id),
		Status:    StatusActive,
		Currency:  strings.ToUpper(strings.TrimSpace(currency)),
		CreatedAt: createdAt.UTC(),
	}
	if customer.ID == "" {
		return Customer{}, ErrIDRequired
	}
	if customer.Currency == "" {
		customer.Currency = "USD"
	}
	if err := customer.SetName(name); err != nil {
		return Customer{}, err
	}
	if err := customer.SetEmail(email); err != nil {
		return Customer{}, err
	}
	if err := customer.SetCurrency(customer.Currency); err != nil {
		return Customer{}, err
	}
	if customer.CreatedAt.IsZero() {
		return Customer{}, ErrCreatedAtMissing
	}
	return customer, nil
}

func (c *Customer) SetName(name string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return ErrNameRequired
	}
	c.Name = name
	return nil
}

func (c *Customer) SetEmail(email string) error {
	email = strings.TrimSpace(email)
	address, err := mail.ParseAddress(email)
	if err != nil || address.Address != email {
		return ErrEmailInvalid
	}
	c.Email = email
	return nil
}

func (c *Customer) SetCurrency(currency string) error {
	currency = strings.ToUpper(strings.TrimSpace(currency))
	if len(currency) != 3 {
		return ErrCurrencyInvalid
	}
	for _, r := range currency {
		if r < 'A' || r > 'Z' {
			return ErrCurrencyInvalid
		}
	}
	c.Currency = currency
	return nil
}

func (c *Customer) SetStatus(status Status) error {
	if !status.Valid() {
		return ErrStatusInvalid
	}
	c.Status = status
	return nil
}

// Update changes the fields a client may edit. Status and balance are not
// client-editable yet; they belong to later workflows.
func (c *Customer) Update(name, email, currency string) error {
	if err := c.SetName(name); err != nil {
		return err
	}
	if err := c.SetEmail(email); err != nil {
		return err
	}
	if currency != "" {
		if err := c.SetCurrency(currency); err != nil {
			return err
		}
	}
	return nil
}
