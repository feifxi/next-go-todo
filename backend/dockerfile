FROM golang:latest AS builder
WORKDIR /app
COPY . .
RUN go mod download
ENV CGO_ENABLED=0
RUN go build -o myapp .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/myapp .
EXPOSE 8080
CMD ["./myapp"]