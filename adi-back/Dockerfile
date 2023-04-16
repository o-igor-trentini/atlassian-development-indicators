FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server cmd/adiback.go

FROM scratch
COPY config/.env /config/.env
COPY --from=builder /app/server /server
ENTRYPOINT [ "/server" ]
