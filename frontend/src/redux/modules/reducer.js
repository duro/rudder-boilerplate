import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import { reducer as form } from 'redux-form';
import authReducer from './auth';
import layout from './layout';
import notifications from './notifications';
import asyncList from './asyncList';

// Make sure you add any reducers that are not immutable to this list
const notImmutable = [
  'routing',
  'form',
  'reduxAsyncConnect'
];

// Add any reducers that should ignore SSR data
const ssrIgnore = [
  'notifications'
];

export default (cookie) => combineReducers({
  routing: routerReducer,
  form,
  reduxAsyncConnect,
  auth: authReducer(cookie),
  layout,
  notifications,
  asyncList
});

export function isImmutable(reducerKey) {
  return notImmutable.indexOf(reducerKey) < 0;
}

export function shouldIgnore(reducerKey) {
  return ssrIgnore.indexOf(reducerKey) >= 0;
}
