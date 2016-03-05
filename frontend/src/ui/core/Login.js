import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginUser, redirectLoggedInUser } from 'redux/modules/auth';
import LoginForm from './forms/LoginForm';
import styles from './Login.less';

@connect(
  state => ({auth: state.auth}),
  { loginUser, redirectLoggedInUser }
)
export default class Login extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    redirectLoggedInUser: PropTypes.func.isRequired,
  }

  componentWillMount() {
    if (this.props.auth.get('isLoggedIn')) {
      this.props.redirectLoggedInUser();
    }
  }

  handleSubmit(formData) {
    this.props.loginUser(formData.email, formData.password);
  }

  render() {
    const { auth } = this.props;
    const errors = [];

    if (auth.get('isError')) {
      errors.push(
        <div
          key="error"
          className="alert alert-danger"
          role="alert">
          There was a problem authenticating. Please contact admin.
        </div>
      );
    }

    if (auth.get('isUnauthorized')) {
      errors.push(
        <div
          key="auth"
          className="alert alert-danger"
          role="alert">
          There was a problem with your credentials
        </div>
      );
    }

    if (this.props.auth.get('isLoggedIn')) {
      return null;
    }

    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginModule}>
          <h1>Login</h1>
          {errors}
          <LoginForm onSubmit={this.handleSubmit.bind(this)} />
        </div>
      </div>
    );
  }
}
