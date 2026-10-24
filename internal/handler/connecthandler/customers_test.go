package connecthandler

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"connectrpc.com/connect"

	pb "erp-api/gen/erp/customers/v1"
	"erp-api/gen/erp/customers/v1/customersv1connect"
	"erp-api/internal/app/port"
	"erp-api/internal/app/usecase/customers"
	"erp-api/internal/entity"
)

type fakeUseCase struct {
	page port.CustomerPage
	err  error
}

func (f fakeUseCase) List(context.Context, customers.ListInput) (port.CustomerPage, error) {
	return f.page, f.err
}
func (f fakeUseCase) Get(context.Context, string) (entity.Customer, error) {
	return entity.Customer{}, f.err
}
func (f fakeUseCase) Create(context.Context, customers.CreateInput) (entity.Customer, error) {
	return entity.Customer{}, f.err
}
func (f fakeUseCase) Update(context.Context, customers.UpdateInput) (entity.Customer, error) {
	return entity.Customer{}, f.err
}
func (f fakeUseCase) Delete(context.Context, string) error { return f.err }

func server(t *testing.T, uc customers.UseCase) (customersv1connect.CustomersServiceClient, func()) {
	t.Helper()
	path, handler := customersv1connect.NewCustomersServiceHandler(
		NewCustomers(uc, slog.New(slog.NewTextHandler(io.Discard, nil))),
	)
	mux := http.NewServeMux()
	mux.Handle(path, handler)
	ts := httptest.NewServer(mux)
	return customersv1connect.NewCustomersServiceClient(ts.Client(), ts.URL), ts.Close
}

func TestListMapsDomainToProto(t *testing.T) {
	client, closeServer := server(t, fakeUseCase{page: port.CustomerPage{
		Total: 1,
		Customers: []entity.Customer{{
			ID: "cus_001", Name: "Northwind", Email: "ap@northwind.example",
			Status: entity.StatusOnHold, BalanceMinor: 1245000, Currency: "USD",
			CreatedAt: time.Date(2026, 1, 12, 9, 12, 0, 0, time.UTC),
		}},
	}})
	defer closeServer()

	res, err := client.ListCustomers(context.Background(), connect.NewRequest(&pb.ListCustomersRequest{}))
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if res.Msg.GetTotal() != 1 || len(res.Msg.GetCustomers()) != 1 {
		t.Fatalf("response = %+v", res.Msg)
	}
	got := res.Msg.GetCustomers()[0]
	if got.GetStatus() != pb.CustomerStatus_CUSTOMER_STATUS_ON_HOLD || got.GetCreatedAt() != "2026-01-12T09:12:00Z" {
		t.Fatalf("customer = %+v", got)
	}
}

func TestErrorsMapToConnectCodes(t *testing.T) {
	client, closeServer := server(t, fakeUseCase{err: customers.ErrNotFound})
	defer closeServer()

	_, err := client.GetCustomer(context.Background(), connect.NewRequest(&pb.GetCustomerRequest{Id: "missing"}))
	if connect.CodeOf(err) != connect.CodeNotFound {
		t.Fatalf("code = %v, want not_found", connect.CodeOf(err))
	}
}
