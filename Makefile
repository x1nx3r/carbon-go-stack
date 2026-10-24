.PHONY: generate generate-go generate-web lint test db-up db-down seed run-api web-install web-dev

BUF ?= $(shell command -v buf 2>/dev/null || echo $(CURDIR)/web/node_modules/.bin/buf)

# The contract is canonical at contract/. Both generators run from here so
# their out paths stay stable.
generate: generate-go generate-web

generate-go:
	PATH="$(CURDIR)/web/node_modules/.bin:$$PATH:$$(go env GOPATH)/bin" $(BUF) generate --template buf.gen.go.yaml

generate-web:
	PATH="$(CURDIR)/web/node_modules/.bin:$$PATH" $(BUF) generate --template buf.gen.web.yaml

lint:
	$(MAKE) -C api lint
	npm --prefix web run lint

test:
	$(MAKE) -C api test
	npm --prefix web run typecheck

db-up:
	$(MAKE) -C api db-up

db-down:
	$(MAKE) -C api db-down

seed:
	$(MAKE) -C api seed

run-api:
	$(MAKE) -C api run

web-install:
	npm --prefix web install

web-dev:
	npm --prefix web run dev
