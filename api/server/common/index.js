'use strict';

import convertValidationErrors from './lib/convertValidationErrors';
import processOperationalErrors from './lib/processOperationalErrors';
import streamFileToS3 from './lib/streamFileToS3';

exports.register = (server, options, next) => {

  // Expose some shared functions for use throughout the server
  server.expose({
    convertValidationErrors,
    streamFileToS3,
    processOperationalErrors: processOperationalErrors(server)
  })

  // Make the Sequelize models easily accessible from the request object
  server.ext('onPreAuth', (request, reply) => {
      request.models = server.plugins['sequelize'].db.sequelize.models;
      reply.continue();
  });

  next();

}

exports.register.attributes = {
  name: 'common',
  version: '1.0.0'
}
