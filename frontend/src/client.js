/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js
 * IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
// import io from 'socket.io-client';
import {Provider} from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import useScroll from 'react-router-scroll';
import cookieDough from 'cookie-dough';

import getRoutes from './routes';

require('./global.less');

const client = new ApiClient();
const dest = document.getElementById('root');
const cookie = cookieDough();
const store = createStore(browserHistory, client, cookie, window.__data);
const history = syncHistoryWithStore(browserHistory, store);

// Uncomment below to turn on Web Socket connection
// function initSocket() {
//   const socket = io('', {path: '/ws'});
//   socket.on('news', (data) => {
//     console.log(data);
//     socket.emit('my other event', { my: 'data from client' });
//   });
//   socket.on('msg', (data) => {
//     console.log(data);
//   });
//
//   return socket;
// }
// global.socket = initSocket();

const component = (
  <Router
    history={history}
    render={(props) =>
      <ReduxAsyncConnect
        {...props}
        helpers={{client}}
        filter={item => !item.deferred}
        render={applyRouterMiddleware(useScroll())}
      />
    }>
      { getRoutes(store) }
  </Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./utils/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div id="dev_app_container">
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
