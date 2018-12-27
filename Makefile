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

up-dev-i:						## Bring up the dev-environment (with watching the source)
	docker-compose --f=docker-compose.dev.yml up
.PHONY: up-dev-i

down-dev:
	docker-compose --f=docker-compose.deps.yml down -t 0
.PHONY: down-dev

up-test:						## Bring up the test environment (docker-compose up => docker-compose.test.yml)
	docker-compose --f=docker-compose.test.yml up -d
.PHONY: up-test

reset-storage: reset-nats reset-mongo		## Delete storage of all services being involved (nats-streaming, mongo, etc.)
.PHONY: reset-storage

reset-nats:					## Delete the storage of nats-streaming
	rm -rf ./.datastore
.PHONY: reset-nats

reset-mongo:				## Delete the storage of mongo
	rm -rf ./.data
.PHONY: reset-mongo

down-test:
	docker-compose --f=docker-compose.test.yml down -t 0
.PHONY: down-test

run-tests: 					## Run tests (+ unit tests) tests
	docker-compose --f=docker-compose.integration-tests.yml run jobs-service-test npm run test
	docker-compose --f=docker-compose.integration-tests.yml down -t 0
.PHONY: run-integration-tests

circleci: build build-test run-tests	## Simulate the CircleCI tests
.PHONY: circleci


