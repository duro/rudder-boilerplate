# The API

##### Key Libraries Used

* **[Hapi](http://hapijs.com/):** Web server framework
  * **[hapi-swagger](https://github.com/glennjones/hapi-swagger):** Auto documentation generation for Hapi routes
  * **[boom](https://github.com/hapijs/boom):** HTTP Error response helper
  * **[confidence](https://github.com/hapijs/confidence):** Configuration helper
  * **[hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2):** Hapi JWT authentication strategy
* **[Sequelize](http://docs.sequelizejs.com/en/latest/):** ORM for database interaction

## Local Development Setup

First, you will need to have a working Docker Machine setup on your local machine. You will also need a mechanism for rsync-ing files into the Docker Machine.

### Dependencies

#### Get Docker Toolbox

Head on over to https://www.docker.com/docker-toolbox and download the latest version of Docker Toolbox. This will install Virtualbox and the command line tools `docker-machine` and `docker-compose`

#### Rsync

We use rsync to sync code from your local machine into the docker machine for use by Docker. This allows native support for file system watchers inside the container.

The code in this repo should be sync'd to the `/projects/api` folder inside the docker machine.

For OS-X users, you can easily use the `docker-rsync` tool to automate this for you. There is also a provided make command `make sync` in this repo to make this easy.

##### OS X: Install docker-rsync

docker-rsync is installed via the Brew package manager for OS X.

1. `brew update`
2. `brew tap synack/docker`
3. `brew install docker-rsync`

### Setting up your Docker Host

Use Docker Machine to setup a docker host. This projects expects your Docker Machine to be named `default`.

Run the following commands to setup this Docker Machine

```bash
docker-machine create -d virtualbox default
```

Docker will need certain env vars to be set so the docker client know how to communicate with this docker machine.

Run the following in each shell where a docker command will be run to make sure that docker communicates with the right machine:

```bash
eval "$(docker-machine env default)"
```

It can be handy to add the following lines to your shell profile to make sure that with each shell you Docker Machine is running, and the proper env vars are set:

```bash
docker-machine start default
eval "$(docker-machine env default)"
```

### Setup host file alias to point to the docker machine

Find out the IP of the docker machine by running:

```bash
docker-machine ip default
```

Put the following entry in your `/etc/hosts` file:

```
<machine_ip> docker.internal
```

### Link project environment vars

Docker relies heavily on Environment Variables to pass config into the container. Before deploying your containers to the Docker Host, you will need to create a symlink to the appropriate .envvar file for local development.

From the project root on your local, run:

```bash
ln -s ./envs/.envvars.local .envvars
```

### Fire it up

From the project root, run:

```bash
make sync
```

In another shell tab:

```bash
make up
```

### Access app

You should now be able to access the documentation for the API to test that your env is running:

http://docker.internal:8007/documentation

## Local Development Tasks

### Get your container ID

Run the following:

```bash
docker ps
```

Look for the line that is running an image named `api` and note the container ID that precedes it.

### Connect to running container

After running `docker ps` you will be able to see the container ID of the running app container. To open a shell into the running container, run:

```bash
docker exec -it <CONTAINER_ID> bash
```

### Installing NPM Modules

Connect to the running container, and use `npm install --save MODULE` or `npm install --save-dev MODULE` to install it inside the container.

**IMPORTANT NOTE:** Since rsync is not bi-directional, after you are done installing, make sure you bring the modified `package.json` back to the host by copying the output of `cat package.json` and pasting it into your local file system so it can be comitted to Git.

### Debugging

A debugger is ready to go inside the container. It is setup to start in the local and development environments. It will be initiaited on start of the server as long as the following env var (in `/envs/.envvars.local`) is present:

```bash
export DEBUGGER=true
```

Once the app has been started with the Debugger turned on, you can connect to the debugger at the following URL:

http://docker.internal:8787/?ws=docker.internal:8787&port=5959

## Database Migrations

Sequelize has support for Database Migration. All changes to the DB should be scripted via Migrations.

Migrations are places in the `./migrations` directory.

Please make sure that you incrementally name your migration files like so:

```
0000-migration-1.js
0001-migration-2.js
0002-migration-3.js
```

**IMPORTANT NOTE:** Migrations and database schema changes are sensitive changes in application development. If multiple developers are working on features that require database migrations, they should be careful to coordinate with each other to make sure that their migrations are running in the proper order, and do not conflict with each other.

### Running Migrations

Migrations are run inside the container. To run them, `docker exec` into the container and use the `sequelize` CLI to run them.

```bash
# From your local host
docker exec -it <container_id> bash

# Once inside the container
source .envvars
sequelize db:migrate
```
