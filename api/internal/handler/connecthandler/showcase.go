package connecthandler

import (
	"context"
	"errors"
	"log/slog"
	"time"

	"connectrpc.com/connect"

	pb "erp-api/gen/erp/showcase/v1"
	"erp-api/internal/app/usecase/showcase"
	"erp-api/internal/entity"
)

type Showcase struct {
	uc  showcase.UseCase
	log *slog.Logger
}

func NewShowcase(uc showcase.UseCase, log *slog.Logger) *Showcase {
	return &Showcase{uc: uc, log: log}
}

func (h *Showcase) ListShowcaseItems(ctx context.Context, req *connect.Request[pb.ListShowcaseItemsRequest]) (*connect.Response[pb.ListShowcaseItemsResponse], error) {
	page, err := h.uc.List(ctx, showcase.ListInput{
		Page:     int(req.Msg.GetPage()),
		PageSize: int(req.Msg.GetPageSize()),
		Search:   req.Msg.GetQuery(),
		Status:   entity.ShowcaseStatus(req.Msg.GetStatus()),
	})
	if err != nil {
		return nil, h.mapError("list showcase items", err)
	}
	out := &pb.ListShowcaseItemsResponse{Total: int32(page.Total)}
	for _, item := range page.Items {
		out.Items = append(out.Items, showcaseToProto(item))
	}
	return connect.NewResponse(out), nil
}

func (h *Showcase) GetShowcaseItem(ctx context.Context, req *connect.Request[pb.GetShowcaseItemRequest]) (*connect.Response[pb.GetShowcaseItemResponse], error) {
	item, err := h.uc.Get(ctx, req.Msg.GetId())
	if err != nil {
		return nil, h.mapError("get showcase item", err)
	}
	return connect.NewResponse(&pb.GetShowcaseItemResponse{Item: showcaseToProto(item)}), nil
}

func (h *Showcase) CreateShowcaseItem(ctx context.Context, req *connect.Request[pb.CreateShowcaseItemRequest]) (*connect.Response[pb.CreateShowcaseItemResponse], error) {
	item, err := h.uc.Create(ctx, showcase.CreateInput{
		Title:       req.Msg.GetTitle(),
		Description: req.Msg.GetDescription(),
		Status:      entity.ShowcaseStatus(req.Msg.GetStatus()),
		Owner:       req.Msg.GetOwner(),
		AmountMinor: req.Msg.GetAmountMinor(),
		Currency:    req.Msg.GetCurrency(),
		Tags:        req.Msg.GetTags(),
		Done:        req.Msg.GetDone(),
	})
	if err != nil {
		return nil, h.mapError("create showcase item", err)
	}
	return connect.NewResponse(&pb.CreateShowcaseItemResponse{Item: showcaseToProto(item)}), nil
}

func (h *Showcase) UpdateShowcaseItem(ctx context.Context, req *connect.Request[pb.UpdateShowcaseItemRequest]) (*connect.Response[pb.UpdateShowcaseItemResponse], error) {
	item, err := h.uc.Update(ctx, showcase.UpdateInput{
		ID:          req.Msg.GetId(),
		Title:       req.Msg.GetTitle(),
		Description: req.Msg.GetDescription(),
		Status:      entity.ShowcaseStatus(req.Msg.GetStatus()),
		Owner:       req.Msg.GetOwner(),
		AmountMinor: req.Msg.GetAmountMinor(),
		Currency:    req.Msg.GetCurrency(),
		Tags:        req.Msg.GetTags(),
		Done:        req.Msg.GetDone(),
	})
	if err != nil {
		return nil, h.mapError("update showcase item", err)
	}
	return connect.NewResponse(&pb.UpdateShowcaseItemResponse{Item: showcaseToProto(item)}), nil
}

func (h *Showcase) DeleteShowcaseItem(ctx context.Context, req *connect.Request[pb.DeleteShowcaseItemRequest]) (*connect.Response[pb.DeleteShowcaseItemResponse], error) {
	if err := h.uc.Delete(ctx, req.Msg.GetId()); err != nil {
		return nil, h.mapError("delete showcase item", err)
	}
	return connect.NewResponse(&pb.DeleteShowcaseItemResponse{}), nil
}

func (h *Showcase) mapError(operation string, err error) error {
	switch {
	case errors.Is(err, showcase.ErrNotFound):
		return connect.NewError(connect.CodeNotFound, errors.New("showcase item not found"))
	case errors.Is(err, showcase.ErrInvalid):
		return connect.NewError(connect.CodeInvalidArgument, err)
	default:
		h.log.Error("rpc failed", "operation", operation, "err", err)
		return connect.NewError(connect.CodeInternal, errors.New("internal error"))
	}
}

func showcaseToProto(item entity.ShowcaseItem) *pb.ShowcaseItem {
	return &pb.ShowcaseItem{
		Id:          item.ID,
		Title:       item.Title,
		Description: item.Description,
		Status:      pb.ShowcaseStatus(item.Status),
		Owner:       item.Owner,
		AmountMinor: item.AmountMinor,
		Currency:    item.Currency,
		Tags:        append([]string(nil), item.Tags...),
		Done:        item.Done,
		CreatedAt:   item.CreatedAt.UTC().Format(time.RFC3339),
		UpdatedAt:   item.UpdatedAt.UTC().Format(time.RFC3339),
	}
}
