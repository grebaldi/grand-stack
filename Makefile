SHELL=/bin/bash
export PATH := $(PATH):./node_modules/.bin:./bin

install:
	yarn install

run:
	docker-compose up -d
	node --version
	babel-node --version
	babel-node server

stop:
	docker-compose stop
