import React, { Component, PropTypes } from 'react';
import { addMessage } from 'redux/modules/notifications';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

@connect(null, { addMessage })
export default class Dashboard extends Component {

  static propTypes = {
    addMessage: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <Helmet title="Dashboard" />
        <h1>Dashboard</h1>
        <h2>Test the notification system</h2>
        <ButtonToolbar>
          <NoticeTrigger
            bsStyle="info"
            clickHandler={ this.props.addMessage }
            label="Notice"
            noticeType="notice"
            noticeMsg="This is a Notice" />
          <NoticeTrigger
            bsStyle="warning"
            clickHandler={ this.props.addMessage }
            label="Warning"
            noticeType="warning"
            noticeMsg="This is a Warning" />
          <NoticeTrigger
            bsStyle="success"
            clickHandler={ this.props.addMessage }
            label="Success"
            noticeType="success"
            noticeMsg="This is Success" />
          <NoticeTrigger
            bsStyle="danger"
            clickHandler={ this.props.addMessage }
            label="Error"
            noticeType="error"
            noticeMsg="This is an Error" />
        </ButtonToolbar>
      </div>
    );
  }
}

class NoticeTrigger extends Component {

  static propTypes = {
    bsStyle: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired,
    noticeType: PropTypes.string.isRequired,
    noticeMsg: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }

  @autobind
  handleClick() {
    const { noticeType, noticeMsg } = this.props;
    this.props.clickHandler(noticeType, noticeMsg);
  }

  render() {
    const { bsStyle, label } = this.props;
    return (
      <Button
        bsStyle={ bsStyle }
        onClick={ this.handleClick }>
          { label }
      </Button>
    );
  }
}
