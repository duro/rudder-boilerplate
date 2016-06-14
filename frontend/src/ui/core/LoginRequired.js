import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUser, forceLoginWithRedirect } from 'redux/modules/auth';

@connect(
  state => ({
    auth: state.auth,
    routing: state.routing
  }),
  { fetchUser, forceLoginWithRedirect }
)
export default class LoginRequired extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
    forceLoginWithRedirect: PropTypes.func.isRequired,
    children: PropTypes.object
  }

  componentWillMount() {
    if (!this.props.auth.get('isLoggedIn')) {
      const {
        routing: { locationBeforeTransitions: { pathname, query } }
      } = this.props;
      this.props.forceLoginWithRedirect(pathname, query);
    } else if (__CLIENT__ && this.props.auth.get('user').size === 0) {
      this.props.fetchUser();
    }
  }

  render() {
    if (this.props.auth.get('user').size === 0) {
      return null;
    }

    return this.props.children;
  }
}
