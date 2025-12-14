// Package store provides generic JSONL storage for queen data.
package store

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"sync"
)

// JSONLStore provides append-only JSONL storage for any type.
type JSONLStore[T any] struct {
	path string
	mu   sync.RWMutex
}

// NewJSONLStore creates a new JSONL store at the given path.
func NewJSONLStore[T any](path string) *JSONLStore[T] {
	return &JSONLStore[T]{path: path}
}

// Path returns the file path of the store.
func (s *JSONLStore[T]) Path() string {
	return s.path
}

// Append writes a new record to the store.
func (s *JSONLStore[T]) Append(record T) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.OpenFile(s.path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return fmt.Errorf("open file: %w", err)
	}
	defer f.Close()

	data, err := json.Marshal(record)
	if err != nil {
		return fmt.Errorf("marshal: %w", err)
	}

	if _, err := f.Write(append(data, '\n')); err != nil {
		return fmt.Errorf("write: %w", err)
	}

	return nil
}

// ReadAll reads all records from the store.
func (s *JSONLStore[T]) ReadAll() ([]T, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	f, err := os.Open(s.path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("open: %w", err)
	}
	defer f.Close()

	var records []T
	scanner := bufio.NewScanner(f)
	lineNum := 0
	for scanner.Scan() {
		lineNum++
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}

		var record T
		if err := json.Unmarshal(line, &record); err != nil {
			// Log warning but continue - don't fail on corrupt lines
			fmt.Fprintf(os.Stderr, "WARN: line %d parse error: %v\n", lineNum, err)
			continue
		}
		records = append(records, record)
	}

	return records, scanner.Err()
}
