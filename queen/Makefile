.PHONY: build install test lint clean help

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
DATE ?= $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
LDFLAGS := -ldflags "-X main.Version=$(VERSION) -X main.Commit=$(COMMIT) -X main.Date=$(DATE)"

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build the queen binary
	go build $(LDFLAGS) -o queen ./cmd/queen

install: ## Install queen to $GOPATH/bin
	go install $(LDFLAGS) ./cmd/queen

test: ## Run tests with coverage
	go test -v -race -coverprofile=coverage.out ./...
	@echo ""
	@echo "Coverage summary:"
	@go tool cover -func=coverage.out | tail -1

test-short: ## Run tests without race detector (faster)
	go test -v -short ./...

lint: ## Run linter
	@command -v golangci-lint >/dev/null 2>&1 || { echo "golangci-lint not installed. Run: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest"; exit 1; }
	golangci-lint run

fmt: ## Format code
	go fmt ./...
	goimports -w .

tidy: ## Tidy go modules
	go mod tidy

clean: ## Clean build artifacts
	rm -f queen coverage.out

coverage-html: test ## Generate HTML coverage report
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

check: lint test ## Run lint and tests

all: tidy fmt lint test build ## Run all checks and build
