process.env.BABEL_ENV = 'server-' + process.env.NODE_ENV;
require('babel-register');
