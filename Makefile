.PHONY: install build start-server dev develop lint test coverage

install:
	npm install

build:
	npm run build

start-server:
	npm run start-server

dev:
	npm run dev

develop:
	npm run develop

lint:
	npm run lint

test:
	npm test

coverage:
	npm run test:coverage