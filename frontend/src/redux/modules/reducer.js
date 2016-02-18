import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import {reducer as form} from 'redux-form';
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

export default (cookie) => combineReducers({
  routing: routeReducer,
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
