.PHONY: build up sync kill setup

build:
	docker-compose build

up:
	docker-compose up

sync:
	docker-rsync -dst /projects/ default

kill:
	docker-compose kill

clean-sync:
	docker-machine ssh default "sudo rm -Rf /projects/rudder-boilerplate"

setup:
	./bin/setup.sh
