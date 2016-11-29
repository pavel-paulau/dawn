build:
	go build -v

fmt:
	gofmt -w -s *.go

docker:
	CGO_ENABLED=0 go build -v -a --ldflags "-s" && upx -q6 dawn
	docker build --rm -t perflab/dawn .
