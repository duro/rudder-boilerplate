export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return {
    path: '/',
    component: require('./ui/core/App'),
    indexRoute: {
      component: require('./ui/core/Login')
    },
    childRoutes: [
      ...require('./ui/asyncList'),
      {
        component: require('./ui/core/LoginRequired'),
        childRoutes: [{
          component: require('./ui/core/AppLayout'),
          childRoutes: [
            ...require('./ui/dashboard')
          ]
        }]
      }
    ]
  };
};
