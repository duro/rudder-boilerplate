import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { redirectLoggedInUser, forceLogin } from 'redux/modules/auth';

@connect(
  state => ({
    auth: state.auth,
    routing: state.routing
  }),
  { redirectLoggedInUser, forceLogin }
)
export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired,
    forceLogin: PropTypes.func.isRequired,
    redirectLoggedInUser: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const currentyLoggedIn = this.props.auth.get('isLoggedIn');
    const willBeLoggedIn = nextProps.auth.get('isLoggedIn');

    if (currentyLoggedIn && !willBeLoggedIn) {
      this.props.forceLogin();
    } else if (!currentyLoggedIn && willBeLoggedIn) {
      this.props.redirectLoggedInUser();
    }
  }

  render() {
    return (
      <div id="app_container">
        {this.props.children}
      </div>
    );
  }
}
