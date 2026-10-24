package connecthandler

import (
	"context"
	"errors"
	"log/slog"
	"time"

	"connectrpc.com/connect"

	pb "erp-api/gen/erp/customers/v1"
	"erp-api/internal/app/usecase/customers"
	"erp-api/internal/entity"
)

type Customers struct {
	uc  customers.UseCase
	log *slog.Logger
}

func NewCustomers(uc customers.UseCase, log *slog.Logger) *Customers {
	return &Customers{uc: uc, log: log}
}

func (h *Customers) ListCustomers(ctx context.Context, req *connect.Request[pb.ListCustomersRequest]) (*connect.Response[pb.ListCustomersResponse], error) {
	page, err := h.uc.List(ctx, customers.ListInput{
		Page:     int(req.Msg.GetPage()),
		PageSize: int(req.Msg.GetPageSize()),
		Search:   req.Msg.GetQuery(),
	})
	if err != nil {
		return nil, h.mapError("list customers", err)
	}
	out := &pb.ListCustomersResponse{Total: int32(page.Total)}
	for _, customer := range page.Customers {
		out.Customers = append(out.Customers, toProto(customer))
	}
	return connect.NewResponse(out), nil
}

func (h *Customers) GetCustomer(ctx context.Context, req *connect.Request[pb.GetCustomerRequest]) (*connect.Response[pb.GetCustomerResponse], error) {
	customer, err := h.uc.Get(ctx, req.Msg.GetId())
	if err != nil {
		return nil, h.mapError("get customer", err)
	}
	return connect.NewResponse(&pb.GetCustomerResponse{Customer: toProto(customer)}), nil
}

func (h *Customers) CreateCustomer(ctx context.Context, req *connect.Request[pb.CreateCustomerRequest]) (*connect.Response[pb.CreateCustomerResponse], error) {
	customer, err := h.uc.Create(ctx, customers.CreateInput{
		Name:     req.Msg.GetName(),
		Email:    req.Msg.GetEmail(),
		Currency: req.Msg.GetCurrency(),
	})
	if err != nil {
		return nil, h.mapError("create customer", err)
	}
	return connect.NewResponse(&pb.CreateCustomerResponse{Customer: toProto(customer)}), nil
}

func (h *Customers) UpdateCustomer(ctx context.Context, req *connect.Request[pb.UpdateCustomerRequest]) (*connect.Response[pb.UpdateCustomerResponse], error) {
	customer, err := h.uc.Update(ctx, customers.UpdateInput{
		ID:       req.Msg.GetId(),
		Name:     req.Msg.GetName(),
		Email:    req.Msg.GetEmail(),
		Currency: req.Msg.GetCurrency(),
	})
	if err != nil {
		return nil, h.mapError("update customer", err)
	}
	return connect.NewResponse(&pb.UpdateCustomerResponse{Customer: toProto(customer)}), nil
}

func (h *Customers) DeleteCustomer(ctx context.Context, req *connect.Request[pb.DeleteCustomerRequest]) (*connect.Response[pb.DeleteCustomerResponse], error) {
	if err := h.uc.Delete(ctx, req.Msg.GetId()); err != nil {
		return nil, h.mapError("delete customer", err)
	}
	return connect.NewResponse(&pb.DeleteCustomerResponse{}), nil
}

func (h *Customers) mapError(operation string, err error) error {
	switch {
	case errors.Is(err, customers.ErrNotFound):
		return connect.NewError(connect.CodeNotFound, errors.New("customer not found"))
	case errors.Is(err, customers.ErrInvalid):
		return connect.NewError(connect.CodeInvalidArgument, err)
	case errors.Is(err, customers.ErrConflict):
		return connect.NewError(connect.CodeAlreadyExists, errors.New("customer already exists"))
	default:
		h.log.Error("rpc failed", "operation", operation, "err", err)
		return connect.NewError(connect.CodeInternal, errors.New("internal error"))
	}
}

func toProto(customer entity.Customer) *pb.Customer {
	return &pb.Customer{
		Id:           customer.ID,
		Name:         customer.Name,
		Email:        customer.Email,
		Status:       pb.CustomerStatus(customer.Status),
		BalanceMinor: customer.BalanceMinor,
		Currency:     customer.Currency,
		CreatedAt:    customer.CreatedAt.UTC().Format(time.RFC3339),
	}
}
