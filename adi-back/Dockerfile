FROM golang:1.20 AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server main.go

FROM scratch
COPY ./config/.env /config/.env
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/server /server
ENTRYPOINT [ "/server" ]

EXPOSE 4000
