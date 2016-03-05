#!/usr/bin/env bash

source 'envs/.envvars.test'

# function cleanupDB {
#   echo "remove SQLite DB"
#   rm -rf /tmp/lockerroom.db
# }

function run {
  "$@"
  local status=$?
  if [ $status -ne 0 ]; then
    # cleanupDB
    exit 1
  fi
  return $status
}

# Wait till Postgres is available before continuing
while true; do
    psql -c "select pg_postmaster_start_time()" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        break
    fi
    echo "Waiting to connect to Postgres..."
    sleep 1
done

if [ "$NODE_ENV" == "test" ]; then
  if psql -lqt | cut -d \| -f 1 | grep -w ${RUDDER_DB_NAME}; then
    echo "${RUDDER_DB_NAME} database already exists...moving on"
  else
    echo "${RUDDER_DB_NAME} database does not exist"
    echo "...create TEST user $RUDDER_DB_USER with password $RUDDER_DB_PASS"
    psql -c "create user \"$RUDDER_DB_USER\" with password '$RUDDER_DB_PASS'"

    echo "...create TEST database $RUDDER_DB_NAME with owner $RUDDER_DB_USER encoding='utf8' template template0"
    psql -c "create database \"$RUDDER_DB_NAME\" with owner \"$RUDDER_DB_USER\" encoding='utf8' template template0"
  fi
fi

# run npm run gulp lint

run lab \
  --verbose \
  --transform 'test/_helpers/transformer.js' \
  --sourcemaps \
  --ignore __core-js_shared__,core,Reflect,_babelPolyfill,regeneratorRuntime
