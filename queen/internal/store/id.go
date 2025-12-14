package store

import (
	"crypto/rand"
	"sync"
	"time"

	"github.com/oklog/ulid/v2"
)

var (
	idMu    sync.Mutex
	entropy = ulid.Monotonic(rand.Reader, 0)
)

// NewMessageID generates a new message ID with "qm-" prefix.
func NewMessageID() string {
	return "qm-" + generateULID()
}

// NewAssignmentID generates a new assignment ID with "qa-" prefix.
func NewAssignmentID() string {
	return "qa-" + generateULID()
}

// NewReservationID generates a new reservation ID with "qr-" prefix.
func NewReservationID() string {
	return "qr-" + generateULID()
}

func generateULID() string {
	idMu.Lock()
	defer idMu.Unlock()
	return ulid.MustNew(ulid.Timestamp(time.Now()), entropy).String()
}
