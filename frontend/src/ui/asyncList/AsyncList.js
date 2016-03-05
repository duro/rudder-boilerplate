import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadList, isLoaded } from 'redux/modules/asyncList';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadList());
    }
  }
}])
@connect(
  state => ({
    listItems: state.asyncList.get('listItems')
  }),
  { loadList, isLoaded }
)
export default class AsyncList extends Component {

  static propTypes = {
    listItems: PropTypes.object
  }

  // static reduxAsyncConnect(params, store) {
  //   const {dispatch, getState} = store;
  //   if (!isLoaded(getState())) {
  //     return dispatch(loadList());
  //   }
  // }

  render() {
    const { listItems } = this.props;

    return (
      <div>
        <h2>Async List Test</h2>
        <ul>
          {listItems.map((item, index) => <li key={index}>{item.get('title')}</li> )}
        </ul>
      </div>
    );
  }
}
