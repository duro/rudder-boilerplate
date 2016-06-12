# Rudder Boilerplate

This boilerplate is a starting point for a micro service oriented front-end and back-end application that is pure JavaScript. The front-end is a ~~Isomorphic~~ **Universal** React UI that uses Redux as a State layer. The core back-end is a Hapi API server, using Sequelize as an ORM. The environment has been containerized with Docker for development and deployment.

This repo is consolidated for ease of getting started, but the `frontend` and `api` portions should be broken down into seperate repos to keep teams able to work independently.

## OSX: Local Development Setup

First, you will need to have a working Docker Machine setup on your local machine. You will also need a mechanism for rsync-ing files into the Docker Machine.

### Dependencies

#### Get Docker Toolbox

Head on over to https://www.docker.com/docker-toolbox and download the latest version of Docker Toolbox. This will install Virtualbox and the command line tools `docker-machine` and `docker-compose`

#### Rsync

We use rsync to sync code from your local machine into the docker machine for use by Docker. This allows native support for file system watchers inside the container.

The code in this repo should be sync'd to the `/projects/rudder-boilerplate` folder inside the docker machine.

For OS-X users, you can easily use the `docker-rsync` tool to automate this for you. There is also a provided make command `make sync` in this repo to make this easy.

##### Install docker-rsync

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

It can be handy to add the following lines to your shell profile to make sure that with each shell your Docker Machine is running, and the proper env vars are set:

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

### Starting Application

Once you have completed the installation of the dependencies above. You are ready to setup the cluster.

1. Pull down repo
2. Run `make setup`
3. Run `make sync` (in one tab)
4. Open a new tab in Terminal and run `make up`

## Linux: Local Development Setup

Since Linux supports docker natively, the setup is much easier.

### Install Docker and Docker Compose

You can follow this tutorial to make sure they are both installed:

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-14-04

**NOTE:** Make sure you restart your machine after install.

### Starting Application

Once you have completed the installation of the dependencies above. You are ready to setup the cluster.

1. Pull down repo to `~/Workspace/projects/rudder-boilerplate`

    `git clone git@github.com:duro/rudder-boilerplate.git ~/Workspace/projects/rudder-boilerplate`

2. Create a symlink to be used as a volume, and maintain compatibility with your OS X friends

    `ln -s ~/Workspace/projects /projects`

3. `cd ~/Workspace/projects/rudder-boilerplate`
4. `make setup`
5. `make up`
