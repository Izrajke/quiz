##
## Build
##
FROM golang:1.17-alpine AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN cd /app/cmd/quiz && CGO_ENABLED=0 go build -o /server

#
# Deploy
#
FROM debian:buster

WORKDIR /

COPY --from=build /server /
COPY --from=build /app/.env /

EXPOSE 8080

CMD ["/server"]