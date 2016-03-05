import Immutable from 'immutable';
import { routeActions } from 'react-router-redux';

/**
 * Private: Initial State
 */

const initialState = new Immutable.fromJS({
  isLoggedIn: false,
  token: null,
  redirectTo: null,
  redirectOnLogin: false,
  user: {},
  err: {},
  isError: false,
  isUnauthorized: false
});

/**
 * Public: Action Types
 */

export const actionTypes = {
  USER_LOGIN_REQUEST: 'USER_LOGIN_REQUEST',
  USER_LOGIN_COMPLETE: 'USER_LOGIN_COMPLETE',
  USER_LOGIN_UNAUTHORIZED: 'USER_LOGIN_UNAUTHORIZED',
  USER_LOGIN_ERROR: 'USER_LOGIN_ERROR',

  USER_FETCH_REQUEST: 'USER_FETCH_REQUEST',
  USER_FETCH_COMPLETE: 'USER_FETCH_COMPLETE',
  USER_FETCH_ERROR: 'USER_FETCH_ERROR',

  USER_LOGOUT: 'USER_LOGOUT',

  USER_FORCE_LOGIN: 'USER_FORCE_LOGIN',
  USER_FORCE_LOGIN_WITH_REDIRECT: 'USER_FORCE_LOGIN_WITH_REDIRECT',

  USER_CLEAR_REDIRECT: 'USER_CLEAR_REDIRECT'
};

/**
 * Public: Action Creators
 */

export function loginUser(email, password) {
  return {
    types: [
      actionTypes.USER_LOGIN_REQUEST,
      actionTypes.USER_LOGIN_COMPLETE,
      actionTypes.USER_LOGIN_ERROR
    ],
    promise: (client) => client.post('/auth', {
      data: {
        email,
        password
      }
    })
  };
}

export function fetchUser() {
  return (dispatch, getState) => {
    const token = getState().auth.get('token');
    return dispatch({
      types: [
        actionTypes.USER_FETCH_REQUEST,
        actionTypes.USER_FETCH_COMPLETE,
        actionTypes.USER_FETCH_ERROR
      ],
      promise: (client) => {
        return client.get(`/user/me`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': token
          }
        });
      }
    });
  };
}

export function logoutUser() {
  return {
    type: actionTypes.USER_LOGOUT
  };
}

export function isUserLoaded(globalState) {
  return globalState.auth && globalState.auth.get('user').size === 0;
}

export function forceLogin() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.USER_FORCE_LOGIN,
    });

    return dispatch(routeActions.replace({ pathname: '/' }));
  };
}

export function forceLoginWithRedirect(pathname, query) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.USER_FORCE_LOGIN_WITH_REDIRECT,
      pathname,
      query
    });

    return dispatch(routeActions.replace({ pathname: '/' }));
  };
}

export function redirectLoggedInUser() {
  return (dispatch, getState) => {
    const { auth } = getState();
    if (auth.get('redirectOnLogin')) {
      const redirect = auth.get('redirect');
      dispatch({
        type: actionTypes.USER_CLEAR_REDIRECT
      });

      return dispatch(
        routeActions.replace({
          pathname: redirect.get('pathname'),
          query: redirect.get('query').toJS()
        })
      );
    }

    return dispatch(
      routeActions.replace({
        pathname: '/dashboard'
      })
    );
  };
}

/**
 * Public: Reducer
 */

export default (cookie) => {
  const cookiedInitialState = initialState.merge({
    token: cookie.get('token'),
    isLoggedIn: (cookie.get('token')) ? true : false
  });

  return function reducer(state = cookiedInitialState, action = {}) {
    switch (action.type) {

      case actionTypes.USER_LOGIN_COMPLETE:
        const { result } = action;
        cookie.set('token', result.token, { path: '/', maxage: 1000 * 60 * 60 * 24 });
        return state.merge({
          user: result,
          token: result.token,
          isLoggedIn: true,
          err: {},
          isError: false,
          isUnauthorized: false
        });

      case actionTypes.USER_LOGIN_UNAUTHORIZED:
        cookie.remove('token', { path: '/' });
        return state.merge({
          user: {},
          token: null,
          isLoggedIn: false,
          err: action.err,
          isError: false,
          isUnauthorized: true,
          redirectOnLogin: false,
          redirect: undefined
        });

      case actionTypes.USER_LOGIN_ERROR:
        cookie.remove('token', { path: '/' });
        return state.merge({
          user: {},
          token: null,
          isLoggedIn: false,
          err: action.err,
          isError: true,
          isUnauthorized: false,
          redirectOnLogin: false,
          redirect: undefined
        });

      case actionTypes.USER_FETCH_COMPLETE:
        return state.merge({
          user: action.result
        });

      case actionTypes.USER_LOGOUT:
        cookie.remove('token', { path: '/' });
        return state.merge({
          user: {},
          token: null,
          isLoggedIn: false,
          err: {},
          isError: false,
          isUnauthorized: false,
          redirectOnLogin: false,
          redirect: undefined
        });

      case actionTypes.USER_FORCE_LOGIN:
        cookie.remove('token', { path: '/' });
        return state.merge({
          user: {},
          err: {},
          token: null,
          isLoggedIn: false,
          isError: false,
          isUnauthorized: false,
          redirectOnLogin: false,
          redirect: undefined
        });

      case actionTypes.USER_FORCE_LOGIN_WITH_REDIRECT:
        cookie.remove('token', { path: '/' });
        return state.merge({
          user: {},
          err: {},
          isError: false,
          token: null,
          isLoggedIn: false,
          isUnauthorized: false,
          redirectOnLogin: true,
          redirect: {
            pathname: action.pathname,
            query: action.query
          }
        });

      case actionTypes.USER_CLEAR_REDIRECT:
        return state.merge({
          redirectOnLogin: false,
          redirect: undefined
        });

      default:
        return state;
    }
  };
};
