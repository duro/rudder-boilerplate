#!/usr/bin/env bash

# load env vars
if [ -f .envvars ]; then
  source .envvars
else
  echo "Could not find a .envvars file. Make sure you copy the correct one from the envs directory"
  exit 1
fi

if [ "$NODE_ENV" == "production" ]; then
  exec npm run build
fi
