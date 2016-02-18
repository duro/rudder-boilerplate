import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import createReducers, { isImmutable } from './modules/reducer';

export default function createStore(history, client, cookie, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = syncHistory(history);

  const middleware = [thunk, createMiddleware(client), reduxRouterMiddleware];

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
    for (const key in data) {
      if (isImmutable(key)) {
        data[key] = Immutable.fromJS(data[key]);
      }
    }
  }

  const reducer = createReducers(cookie);
  const store = finalCreateStore(reducer, data);

  reduxRouterMiddleware.listenForReplays(store);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
