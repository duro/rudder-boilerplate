import React, { Component, PropTypes } from 'react';
import { loadList, isLoaded } from 'redux/modules/asyncList';
import { asyncConnect } from 'redux-connect';

@asyncConnect(
  [{
    promise: (props) => {
      const { store: { getState, dispatch } } = props;
      return (!isLoaded(getState())) ? dispatch(loadList()) : undefined;
    }
  }],
  state => ({
    listItems: state.asyncList.get('listItems')
  })
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
