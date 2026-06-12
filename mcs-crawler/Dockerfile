FROM golang:1.26-alpine AS builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /app/crawler ./cmd/crawler

FROM alpine:3.20

RUN apk add --no-cache tzdata ca-certificates wget && \
    cp /usr/share/zoneinfo/America/Bogota /etc/localtime && \
    echo "America/Bogota" > /etc/timezone

RUN adduser -D -u 1000 appuser

WORKDIR /app

COPY --from=builder /app/crawler .
COPY --from=builder /app/.env ./

RUN mkdir -p /app/downloads && chown -R appuser:appuser /app/downloads

USER appuser

EXPOSE 8082

VOLUME ["/app/downloads"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8082/api/v1/crawler/status || exit 1

ENTRYPOINT ["./crawler"]
