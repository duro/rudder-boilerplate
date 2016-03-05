import Immutable from 'immutable';

/**
 * Private: Initial State
 */

const initialState = new Immutable.fromJS({
  loaded: false,
  listItems: []
});

/**
 * Public: Action Types
 */

export const actionTypes = {
  ASYNC_LIST_LOAD_REQUEST: 'ASYNC_LIST_LOAD_REQUEST',
  ASYNC_LIST_LOAD_SUCCESS: 'ASYNC_LIST_LOAD_SUCCESS',
  ASYNC_LIST_LOAD_ERROR: 'ASYNC_LIST_LOAD_ERROR'
};

/**
 * Public: Action Creators
 */

export function loadList() {
  return (dispatch) => {
    // const token = getState().auth.get('token');
    return dispatch({
      types: [
        actionTypes.ASYNC_LIST_LOAD_REQUEST,
        actionTypes.ASYNC_LIST_LOAD_SUCCESS,
        actionTypes.ASYNC_LIST_LOAD_ERROR
      ],
      promise: (client) => client.get('/test')
    });
  };
}

export function isLoaded(globalState) {
  return globalState.asyncList && globalState.asyncList.get('loaded');
}

/**
 * Public: Reducer
 */

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case actionTypes.ASYNC_LIST_LOAD_SUCCESS:
      return state.merge({
        loaded: true,
        listItems: action.result
      });

    default:
      return state;
  }
}
