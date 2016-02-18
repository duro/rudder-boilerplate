import React, { Component, PropTypes } from 'react';
import { addMessage } from 'redux/modules/notifications';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';

@connect(null, { addMessage } )
export default class Dashboard extends Component {

  static propTypes = {
    addMessage: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Test the notification system</h2>
        <ButtonToolbar>
          <Button
            bsStyle="info"
            onClick={
              this.props.addMessage.bind(this, 'notice', 'This is a Notice')
            }> Notice </Button>
          <Button
            bsStyle="warning"
            onClick={
              this.props.addMessage.bind(this, 'warning', 'This is a Warning')
            }> Warning </Button>
          <Button
            bsStyle="success"
            onClick={
              this.props.addMessage.bind(this, 'success', 'This is Success')
            }> Success </Button>
          <Button
            bsStyle="danger"
            onClick={
              this.props.addMessage.bind(this, 'error', 'This is an Error')
            }> Error </Button>
        </ButtonToolbar>
      </div>
    );
  }
}
