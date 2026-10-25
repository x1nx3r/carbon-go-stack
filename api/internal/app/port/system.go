package port

import "time"

type Clock interface {
	Now() time.Time
}

type IDs interface {
	NewID() string
}
