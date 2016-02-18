#!/usr/bin/env bash

PROJECT_ROOT=$(pwd)

if [ ! -d $PROJECT_ROOT/rudder-isomorphic ]; then
  git clone git@github.com:ElementzInteractive/rudder-isomorphic-frontend.git $PROJECT_ROOT/rudder-isomorphic
  cd $PROJECT_ROOT/rudder-isomorphic
  ln -s ./envs/.envvars.local .envvars
  cd $PROJECT_ROOT
fi

if [ ! -d $PROJECT_ROOT/rudder-api ]; then
  git clone git@github.com:ElementzInteractive/rudder-api.git $PROJECT_ROOT/rudder-api
  cd $PROJECT_ROOT/rudder-api
  ln -s ./envs/.envvars.local .envvars
  cd $PROJECT_ROOT
fi
