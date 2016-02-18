.PHONY: up sync setup

up:
	docker-compose up

sync:
	docker-rsync -dst /projects/ default

setup:
	./bin/setup.sh
