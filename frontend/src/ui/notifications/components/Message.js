import React, {Component, PropTypes} from 'react';
import styles from './Message.less';
import cx from 'classnames';

export default class Message extends Component {

  static propTypes = {
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
    setTimeout(this.props.onDestroy, this.props.destroyAfter);
  }

  render() {
    return (
      <div className={cx([styles.wrapper, styles[this.props.type]])}>
        <span>{this.props.text}</span>
      </div>
    );
  }
}
