import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import createReducers, { isImmutable, shouldIgnore } from './modules/reducer';
import { routerMiddleware } from 'react-router-redux';

export default function createStore(history, client, cookie, data) {
  const middleware = [
    thunk,
    createMiddleware(client),
    routerMiddleware(history)
  ];

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../utils/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  // Convert our rehydrated data to Immutable data unless
  // it is in the exlusion list
  if (data) {
    Object.keys(data).forEach(key => {
      if (shouldIgnore(key)) {
        Object.assign(data, { [key]: undefined });
      } else if (isImmutable(key)) {
        Object.assign(data, { [key]: Immutable.fromJS(data[key]) });
      }
    });
  }

  const reducer = createReducers(cookie);
  const store = finalCreateStore(reducer, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
