.PHONY: run seed test vet fmt lint generate tools db-up db-down

run:
	go run ./cmd/erp-api

seed:
	go run ./cmd/seed

test:
	go test ./...

vet:
	go vet ./...

fmt:
	gofmt -l cmd internal migrations

lint: fmt vet

generate:
	PATH="$$PATH:$$(go env GOPATH)/bin" buf generate

tools:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.36.11
	go install connectrpc.com/connect/cmd/protoc-gen-connect-go@v1.19.1

# Throwaway development database. No volume: stopping it discards the data.
db-up:
	docker run --rm -d --name erp-postgres \
		-e POSTGRES_USER=erp \
		-e POSTGRES_PASSWORD=erp \
		-e POSTGRES_DB=erp \
		-p 55432:5432 \
		postgres:17-alpine

db-down:
	docker rm -f erp-postgres
