package migrations

import "embed"

// Files are applied by the Postgres adapter at startup, in name order.
//
//go:embed *.sql
var Files embed.FS
