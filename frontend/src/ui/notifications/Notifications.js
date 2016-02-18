import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import * as actions from 'redux/modules/notifications';
import Message from './components/Message';
import styles from './Notifications.less';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@connect(
  state => ({ notifications: state.notifications }),
  { ...actions }
)
export default class Notifications extends Component {

  static propTypes = {
    vertOffset: PropTypes.number.isRequired,
    horizOffset: PropTypes.number.isRequired,
    position: PropTypes.oneOf(['tr', 'tl', 'bl', 'br']).isRequired,
    destroyMessage: PropTypes.func.isRequired,
    notifications: PropTypes.object.isRequired
  }

  static defaultProps = {
    vertOffset: 5,
    horizOffset: 5,
    position: 'tr',
  };

  handleDestroy(id) {
    this.props.destroyMessage(id);
  }

  renderMessages() {
    const messages = [];
    if (this.props.notifications.size > 0) {
      this.props.notifications.reverse().forEach((message, id) => {
        messages.push(
          <Message
            key={id}
            type={message.get('msgType')}
            text={message.get('msgText')}
            destroyAfter={3800}
            onDestroy={this.handleDestroy.bind(this, id)} />
        );
      });
    }
    return messages;
  }

  render() {
    let wrapperStyles;

    switch (this.props.position) {
      case 'tl':
        wrapperStyles = {
          top: this.props.vertOffset,
          left: this.props.horizOffset
        };
        break;

      case 'bl':
        wrapperStyles = {
          bottom: this.props.vertOffset,
          left: this.props.horizOffset
        };
        break;

      case 'br':
        wrapperStyles = {
          bottom: this.props.vertOffset,
          right: this.props.horizOffset
        };
        break;

      default:
        wrapperStyles = {
          top: this.props.vertOffset,
          right: this.props.horizOffset
        };
    }

    return (
      <div className={styles.wrapper} style={wrapperStyles}>
        <ReactCSSTransitionGroup
          transitionName="message"
          transitionEnterTimeout={800}
          transitionLeaveTimeout={500}>
            { this.renderMessages() }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
