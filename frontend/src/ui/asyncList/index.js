export default [{
  path: '/async',
  component: require('./AsyncList'),
  // getComponent(location, cb) {
  //   require.ensure([], (require) => {
  //     cb(null, require('./AsyncList'));
  //   });
  // }
}];
