package store

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"testing"
)

// TestRecord is a simple record type for testing
type TestRecord struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Value int    `json:"value"`
}

func TestJSONLStore_Append_NewFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.jsonl")

	store := NewJSONLStore[TestRecord](path)

	record := TestRecord{ID: "1", Name: "test", Value: 42}
	if err := store.Append(record); err != nil {
		t.Fatalf("Append failed: %v", err)
	}

	// Verify file was created
	if _, err := os.Stat(path); os.IsNotExist(err) {
		t.Fatal("File was not created")
	}

	// Verify content
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile failed: %v", err)
	}

	var read TestRecord
	if err := json.Unmarshal(data[:len(data)-1], &read); err != nil { // -1 for newline
		t.Fatalf("Unmarshal failed: %v", err)
	}

	if read.ID != "1" || read.Name != "test" || read.Value != 42 {
		t.Errorf("Record mismatch: got %+v", read)
	}
}

func TestJSONLStore_Append_ExistingFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.jsonl")

	store := NewJSONLStore[TestRecord](path)

	// Append multiple records
	records := []TestRecord{
		{ID: "1", Name: "first", Value: 1},
		{ID: "2", Name: "second", Value: 2},
		{ID: "3", Name: "third", Value: 3},
	}

	for _, r := range records {
		if err := store.Append(r); err != nil {
			t.Fatalf("Append failed: %v", err)
		}
	}

	// Read all and verify
	read, err := store.ReadAll()
	if err != nil {
		t.Fatalf("ReadAll failed: %v", err)
	}

	if len(read) != 3 {
		t.Fatalf("Expected 3 records, got %d", len(read))
	}

	for i, r := range read {
		if r.ID != records[i].ID || r.Name != records[i].Name || r.Value != records[i].Value {
			t.Errorf("Record %d mismatch: got %+v, want %+v", i, r, records[i])
		}
	}
}

func TestJSONLStore_ReadAll_EmptyFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.jsonl")

	// Create empty file
	if err := os.WriteFile(path, []byte{}, 0644); err != nil {
		t.Fatal(err)
	}

	store := NewJSONLStore[TestRecord](path)

	records, err := store.ReadAll()
	if err != nil {
		t.Fatalf("ReadAll failed: %v", err)
	}

	if len(records) != 0 {
		t.Errorf("Expected 0 records, got %d", len(records))
	}
}

func TestJSONLStore_ReadAll_NonExistentFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "nonexistent.jsonl")

	store := NewJSONLStore[TestRecord](path)

	records, err := store.ReadAll()
	if err != nil {
		t.Fatalf("ReadAll should not error for non-existent file: %v", err)
	}

	if records != nil && len(records) != 0 {
		t.Errorf("Expected nil or empty slice, got %v", records)
	}
}

func TestJSONLStore_ReadAll_WithCorruptLine(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.jsonl")

	// Write mix of valid and corrupt lines
	content := `{"id":"1","name":"valid1","value":1}
{corrupt json line}
{"id":"2","name":"valid2","value":2}
`
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	store := NewJSONLStore[TestRecord](path)

	records, err := store.ReadAll()
	if err != nil {
		t.Fatalf("ReadAll failed: %v", err)
	}

	// Should have 2 valid records (corrupt line skipped)
	if len(records) != 2 {
		t.Fatalf("Expected 2 records, got %d", len(records))
	}

	if records[0].ID != "1" || records[1].ID != "2" {
		t.Errorf("Unexpected records: %+v", records)
	}
}

func TestJSONLStore_ReadAll_WithEmptyLines(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.jsonl")

	// Write with empty lines
	content := `{"id":"1","name":"first","value":1}

{"id":"2","name":"second","value":2}

`
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	store := NewJSONLStore[TestRecord](path)

	records, err := store.ReadAll()
	if err != nil {
		t.Fatalf("ReadAll failed: %v", err)
	}

	if len(records) != 2 {
		t.Fatalf("Expected 2 records, got %d", len(records))
	}
}

func TestJSONLStore_ConcurrentAppend(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.jsonl")

	store := NewJSONLStore[TestRecord](path)

	const numGoroutines = 10
	const recordsPerGoroutine = 10

	var wg sync.WaitGroup
	wg.Add(numGoroutines)

	for g := 0; g < numGoroutines; g++ {
		go func(gid int) {
			defer wg.Done()
			for i := 0; i < recordsPerGoroutine; i++ {
				record := TestRecord{
					ID:    NewMessageID(), // Use unique ID
					Name:  "goroutine",
					Value: gid*100 + i,
				}
				if err := store.Append(record); err != nil {
					t.Errorf("Concurrent append failed: %v", err)
				}
			}
		}(g)
	}

	wg.Wait()

	// Verify all records were written
	records, err := store.ReadAll()
	if err != nil {
		t.Fatalf("ReadAll failed: %v", err)
	}

	expected := numGoroutines * recordsPerGoroutine
	if len(records) != expected {
		t.Errorf("Expected %d records, got %d", expected, len(records))
	}
}

func TestJSONLStore_Path(t *testing.T) {
	path := "/some/path/test.jsonl"
	store := NewJSONLStore[TestRecord](path)

	if store.Path() != path {
		t.Errorf("Path() = %s, want %s", store.Path(), path)
	}
}

func TestJSONLStore_AppendOnly_Updates(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.jsonl")

	store := NewJSONLStore[TestRecord](path)

	// Append original record
	original := TestRecord{ID: "1", Name: "original", Value: 100}
	if err := store.Append(original); err != nil {
		t.Fatal(err)
	}

	// Append updated record (same ID)
	updated := TestRecord{ID: "1", Name: "updated", Value: 200}
	if err := store.Append(updated); err != nil {
		t.Fatal(err)
	}

	// ReadAll returns all records (both versions)
	records, err := store.ReadAll()
	if err != nil {
		t.Fatal(err)
	}

	if len(records) != 2 {
		t.Fatalf("Expected 2 records (append-only), got %d", len(records))
	}

	// First is original, second is updated
	if records[0].Name != "original" || records[1].Name != "updated" {
		t.Errorf("Records not in expected order: %+v", records)
	}
}

// GetLatestByID is a helper that demonstrates the pattern for getting latest state
func GetLatestByID(records []TestRecord, id string) *TestRecord {
	var latest *TestRecord
	for i := range records {
		if records[i].ID == id {
			latest = &records[i]
		}
	}
	return latest
}

func TestGetLatestByID(t *testing.T) {
	records := []TestRecord{
		{ID: "1", Name: "first", Value: 1},
		{ID: "2", Name: "second", Value: 2},
		{ID: "1", Name: "first-updated", Value: 10}, // Update to ID 1
		{ID: "3", Name: "third", Value: 3},
	}

	latest := GetLatestByID(records, "1")
	if latest == nil {
		t.Fatal("Expected to find record with ID 1")
	}
	if latest.Name != "first-updated" || latest.Value != 10 {
		t.Errorf("Expected latest version, got %+v", latest)
	}

	latest2 := GetLatestByID(records, "2")
	if latest2 == nil || latest2.Name != "second" {
		t.Errorf("Expected record 2, got %+v", latest2)
	}

	notFound := GetLatestByID(records, "999")
	if notFound != nil {
		t.Errorf("Expected nil for non-existent ID, got %+v", notFound)
	}
}
