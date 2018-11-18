REPO = sammlerio
SERVICE = jobs-service
VER = latest
SIZE = $(shell docker images --format "{{.Repository}} {{.Size}}" | grep jobs-service | cut -d\   -f2)
NODE_VER := $(shell cat .nvmrc)

help:								## Show this help.
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''
.PHONY: help

build:							## Build the docker image.
	docker build --build-arg NODE_VER=$(NODE_VER) --force-rm -t ${REPO}/${SERVICE} -f Dockerfile.prod .
.PHONY: build

build-test:					## Build the docker image (test image)
	docker build --force-rm -t ${REPO}/${SERVICE}-test -f Dockerfile.test .
.PHONY: build-test

down-deps:					## Tear down the required services.
	docker-compose --f=docker-compose.deps.yml down -t 0
.PHONY: down-deps

gen-readme:					## Generate README.md (using docker-verb).
	docker run --rm -v ${PWD}:/opt/verb stefanwalther/verb
.PHONY: gen-readme

up-deps:						## Spawn required services (daemon mode).
	docker-compose --f=docker-compose.deps.yml up -d
.PHONY: up-deps

up-deps-i:					## Spawn required services (interactive mode).
	docker-compose --f=docker-compose.deps.yml up
.PHONY: up-deps-i

up-test:						## Bring up the test environment (docker-compose up => docker-compose.test.yml)
	docker-compose --f=docker-compose.test.yml up -d
.PHONY: up-test

down-test:
	docker-compose --f=docker-compose.test.yml down -t 0
.PHONY: down-test

run-integration-tests: 		## Run integration tests
	docker-compose --f=docker-compose.integration-tests.yml run jobs-service-test npm run test:integration
.PHONY: run-integration-tests


