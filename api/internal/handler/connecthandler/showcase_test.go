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

	pb "erp-api/gen/erp/showcase/v1"
	"erp-api/gen/erp/showcase/v1/showcasev1connect"
	"erp-api/internal/app/port"
	"erp-api/internal/app/usecase/showcase"
	"erp-api/internal/entity"
)

type fakeShowcaseUseCase struct {
	page port.ShowcasePage
	err  error
}

func (f fakeShowcaseUseCase) List(context.Context, showcase.ListInput) (port.ShowcasePage, error) {
	return f.page, f.err
}
func (f fakeShowcaseUseCase) Get(context.Context, string) (entity.ShowcaseItem, error) {
	return entity.ShowcaseItem{}, f.err
}
func (f fakeShowcaseUseCase) Create(context.Context, showcase.CreateInput) (entity.ShowcaseItem, error) {
	return entity.ShowcaseItem{}, f.err
}
func (f fakeShowcaseUseCase) Update(context.Context, showcase.UpdateInput) (entity.ShowcaseItem, error) {
	return entity.ShowcaseItem{}, f.err
}
func (f fakeShowcaseUseCase) Delete(context.Context, string) error { return f.err }

func showcaseServer(t *testing.T, uc showcase.UseCase) (showcasev1connect.ShowcaseServiceClient, func()) {
	t.Helper()
	path, handler := showcasev1connect.NewShowcaseServiceHandler(
		NewShowcase(uc, slog.New(slog.NewTextHandler(io.Discard, nil))),
	)
	mux := http.NewServeMux()
	mux.Handle(path, handler)
	ts := httptest.NewServer(mux)
	return showcasev1connect.NewShowcaseServiceClient(ts.Client(), ts.URL), ts.Close
}

func TestListShowcaseItemsMapsDomainToProto(t *testing.T) {
	client, closeServer := showcaseServer(t, fakeShowcaseUseCase{page: port.ShowcasePage{
		Total: 1,
		Items: []entity.ShowcaseItem{{
			ID:          "show_001",
			Title:       "Ship the design slice",
			Description: "Connect the gallery.",
			Status:      entity.ShowcaseStatusActive,
			Owner:       "Platform",
			AmountMinor: 1200,
			Currency:    "USD",
			Tags:        []string{"design"},
			Done:        true,
			CreatedAt:   time.Date(2026, 1, 12, 9, 12, 0, 0, time.UTC),
			UpdatedAt:   time.Date(2026, 1, 13, 9, 12, 0, 0, time.UTC),
		}},
	}})
	defer closeServer()

	res, err := client.ListShowcaseItems(context.Background(), connect.NewRequest(&pb.ListShowcaseItemsRequest{}))
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if res.Msg.GetTotal() != 1 || len(res.Msg.GetItems()) != 1 {
		t.Fatalf("response = %+v", res.Msg)
	}
	got := res.Msg.GetItems()[0]
	if !got.GetDone() || got.GetStatus() != pb.ShowcaseStatus_SHOWCASE_STATUS_ACTIVE ||
		got.GetCreatedAt() != "2026-01-12T09:12:00Z" {
		t.Fatalf("item = %+v", got)
	}
	if len(got.GetTags()) != 1 || got.GetTags()[0] != "design" {
		t.Fatalf("tags = %v", got.GetTags())
	}
}

func TestShowcaseErrorsMapToConnectCodes(t *testing.T) {
	client, closeServer := showcaseServer(t, fakeShowcaseUseCase{err: showcase.ErrNotFound})
	defer closeServer()

	_, err := client.GetShowcaseItem(context.Background(), connect.NewRequest(&pb.GetShowcaseItemRequest{Id: "missing"}))
	if connect.CodeOf(err) != connect.CodeNotFound {
		t.Fatalf("code = %v, want not_found", connect.CodeOf(err))
	}

	client, closeServer = showcaseServer(t, fakeShowcaseUseCase{err: showcase.ErrInvalid})
	defer closeServer()
	_, err = client.CreateShowcaseItem(context.Background(), connect.NewRequest(&pb.CreateShowcaseItemRequest{}))
	if connect.CodeOf(err) != connect.CodeInvalidArgument {
		t.Fatalf("code = %v, want invalid_argument", connect.CodeOf(err))
	}
}
