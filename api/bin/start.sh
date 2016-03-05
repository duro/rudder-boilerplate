#!/usr/bin/env bash

# load env vars
if [ -f .envvars ]; then
  source .envvars
else
  echo "Could not find a .envvars file. Make sure you copy the correct one from the envs directory"
  exit 1
fi

# If no DOCKER_ENV is set, die
if [ -z $DOCKER_ENV ]; then
  echo "Your .envvars file must declare a DOCKER_ENV var"
  exit 1
fi

# Check to see if our node_modules directory does not exist
if [ ! -d $PROJECT_ROOT/node_modules ]; then
  # If not, it was probably wiped out by Vagrant mounting a host volume
  # on the start of the container, which wipes out the the node_modules
  # folder that was created by the image. So we will just copy it back in
  # from the /tmp folder just like we do in the Dockerfile
  echo "Copying node_modules"
  cp -a /tmp/app/node_modules $PROJECT_ROOT

  # And we'll also rebuild our static files
  # npm run gulp build
fi

# Wait till Postgres is available before continuing
while true; do
    psql -c "select pg_postmaster_start_time()" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        break
    fi
    echo "Waiting to connect to Postgres..."
    sleep 1
done


if [ "$DOCKER_ENV" == "local" ] || [ "$DOCKER_ENV" == "dev" ] ]; then
  if psql -lqt | cut -d \| -f 1 | grep -w $RUDDER_DB_NAME; then
    echo "$RUDDER_DB_NAME database already exists...moving on"
  else
    echo "$RUDDER_DB_NAME database does not exist"
    echo "...create MAIN user $RUDDER_DB_USER with password $RUDDER_DB_PASS"
    psql -c "create user \"$RUDDER_DB_USER\" with password '$RUDDER_DB_PASS'"

    echo "...create MAIN database $RUDDER_DB_NAME with owner $RUDDER_DB_USER encoding='utf8' template template0"
    psql -c "create database \"$RUDDER_DB_NAME\" with owner \"$RUDDER_DB_USER\" encoding='utf8' template template0"
  fi
fi

if [ "$DOCKER_ENV" == "local" ] || [ "$DOCKER_ENV" == "dev" ]; then
  echo "Run migrations..."
  sequelize db:migrate

  if [ $? -eq 0 ]; then
    echo "Migrations successful"
  else
    exit $?
  fi
fi

if [ "$DEBUGGER" = true ]; then
  # start app (with debugging)
  echo "Starting app with debugging"
  if [ "$DEBUG_BRK" = false ]; then
    exec nodemon \
        -V \
        --web-host 0.0.0.0 \
        --debug-port 5995 \
        --web-port 8778 \
        --debug-brk false \
        --preload false \
        --exec node-debug index.js
  else
    exec nodemon \
        -V \
        --web-host 0.0.0.0 \
        --debug-port 5995 \
        --web-port 8787 \
        --preload false \
        --exec node-debug index.js
  fi
else
  # start app (no debugging)
  echo "Starting app"
  exec nodemon -V index.js
fi
