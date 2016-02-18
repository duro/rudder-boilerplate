import Immutable from 'immutable';
import shortid from 'shortid';

/**
 * Private: Initial State
 */

const initialState = new Immutable.OrderedMap();

/**
 * Public: Action Types
 */

export const actionTypes = {
  MESSAGE_ADD: 'MESSAGE_ADD',
  MESSAGE_DESTROY: 'MESSAGE_DESTROY'
};

/**
 * Public: Action Creators
 */

export function addMessage(msgType, msgText) {
  return {
    type: actionTypes.MESSAGE_ADD,
    id: shortid.generate(),
    message: {
      msgType,
      msgText
    }
  };
}

export function destroyMessage(id) {
  return {
    type: actionTypes.MESSAGE_DESTROY,
    id
  };
}

/**
 * Public: Reducer
 */

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case actionTypes.MESSAGE_ADD:
      return state.set(action.id, Immutable.Map(action.message));

    case actionTypes.MESSAGE_DESTROY:
      return state.delete(action.id);

    default:
      return state;
  }
}
