package port

import "errors"

// ErrNotFound lets a repository report a missing row without leaking gorm or
// SQL to the application layer.
var ErrNotFound = errors.New("not found")
