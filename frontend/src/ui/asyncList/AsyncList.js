import React, { Component, PropTypes } from 'react';
import { loadList, isLoaded } from 'redux/modules/asyncList';
import { asyncConnect } from 'redux-connect';

@asyncConnect(
  [{
    key: 'listItems',
    promise: store => {
      const { dispatch, getState } = store;
      const globalState = getState();
      if (!isLoaded(globalState)) {
        return dispatch(loadList());
      }

      return globalState.asyncList.get('listItems');
    }
  }],
  null,
  { loadList, isLoaded }
)
export default class AsyncList extends Component {

  static propTypes = {
    listItems: PropTypes.object
  }

  render() {
    const { listItems } = this.props;

    return (
      <div>
        <h2>Async List Test</h2>
        <ul>
          {listItems.map((item, index) => <li key={index}>{item.get('title')}</li>)}
        </ul>
      </div>
    );
  }
}
