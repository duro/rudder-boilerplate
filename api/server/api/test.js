exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/api/test',
    config: {
      tags: ['test'],
      description: 'This is a test',
      notes: 'This is a test',
      auth: false,
      handler: (request, reply) => {
        reply([
          {title: "This is a test"},
          {title: "This is a another test"},
          {title: "This is one more test"}
        ]);
      }
    }
  });

  next();
}

exports.register.attributes = {
  name: 'test',
}
