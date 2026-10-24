package connecthandler

import (
	"context"
	"log/slog"
	"time"

	"connectrpc.com/connect"
)

// Logging records one line per unary RPC with its Connect code.
func Logging(log *slog.Logger) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			start := time.Now()
			res, err := next(ctx, req)
			log.Info("rpc",
				"procedure", req.Spec().Procedure,
				"code", connect.CodeOf(err).String(),
				"duration", time.Since(start),
			)
			return res, err
		}
	}
}

// Recovery turns a panic into CodeInternal instead of dropping the connection.
func Recovery(log *slog.Logger) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (res connect.AnyResponse, err error) {
			defer func() {
				if recovered := recover(); recovered != nil {
					log.Error("rpc panic", "procedure", req.Spec().Procedure, "panic", recovered)
					err = connect.NewError(connect.CodeInternal, errInternal)
				}
			}()
			return next(ctx, req)
		}
	}
}
