import React, { Component, PropTypes } from 'react';
import styles from './Message.less';
import cx from 'classnames';
import { autobind } from 'core-decorators';

export default class Message extends Component {

  static propTypes = {
    messageKey: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'notice',
      'warning',
      'success',
      'error'
    ]).isRequired,
    onDestroy: PropTypes.func.isRequired,
    destroyAfter: PropTypes.number.isRequired
  }

  componentDidMount() {
    setTimeout(this.handleDestroy, this.props.destroyAfter);
  }

  @autobind
  handleDestroy() {
    this.props.onDestroy(this.props.messageKey);
  }

  render() {
    return (
      <div className={cx([styles.wrapper, styles[this.props.type]])}>
        <span>{this.props.text}</span>
      </div>
    );
  }
}
