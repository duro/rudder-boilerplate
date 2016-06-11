FROM node:5.11.1

## set some ENV vars
ENV HOME /root
ENV TERM dumb
ENV PROJECT_ROOT /opt/app

# install some global node modules
RUN npm install -g \
  node-inspector@0.12.5

# use changes to dependency files to force Docker not to use the cache
# when we change our application's dependencies:
RUN mkdir -p /tmp/app

# add our dependency files to a /tmp location
COPY package.json /tmp/app/package.json

# install dependencies
RUN cd /tmp/app/ && npm install

# create app log folder
RUN mkdir -p /var/log/rudder-iso-frontend

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/rudder-iso-frontend/rudder-iso-frontend.log

# add our app files
RUN mkdir -p $PROJECT_ROOT
COPY . $PROJECT_ROOT
WORKDIR $PROJECT_ROOT

## move our node_modules back into app
RUN cp -a /tmp/app/node_modules $PROJECT_ROOT

## build static assets
RUN ./bin/build-statics.sh

## expose app port
EXPOSE 3000
EXPOSE 8080

CMD ["bin/start.sh"]
