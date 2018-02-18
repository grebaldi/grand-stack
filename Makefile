SHELL=/bin/bash
export PATH := $(PATH):./node_modules/.bin:./bin

install:
	yarn install

run:
	docker-compose up -d
	node --version
	node server

stop:
	docker-compose stop
