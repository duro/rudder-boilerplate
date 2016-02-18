import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from 'redux/modules/auth';
import { toggleSidebar } from 'redux/modules/layout';
import { Grid, Row, Col } from 'react-bootstrap';
import SiteLogo from './components/SiteLogo';
import MainNav from './components/MainNav';
import Toolbar from './components/Toolbar';
import { Notifications } from 'ui/notifications';
import styles from './AppLayout.less';
import cx from 'classnames';

@connect(
  state => ({
    auth: state.auth,
    layout: state.layout
  }),
  { logoutUser, toggleSidebar }
)
export default class AppLayout extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    children: PropTypes.object
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logoutUser();
  }

  handleToggle() {
    this.props.toggleSidebar();
  }

  render() {
    const lwClasses = {
      [styles.toggled]: this.props.layout.get('sidebarToggled')
    };

    return (
      <div>
        <Notifications vertOffset={60} />
        <div className={cx(styles.layoutWrapper, lwClasses)}>
          <div className={styles.sidebarWrapper}>
            <div className={styles.sidebar}>
              <SiteLogo />
              <MainNav />
            </div>
          </div>
          <div className={styles.pageContentWrapper}>
            <div className={styles.pageContent}>
              <Grid fluid>
                <Toolbar
                  auth={this.props.auth}
                  onLogout={this.handleLogout.bind(this)}
                  onToggle={this.handleToggle.bind(this)}
                />
                <Row>
                  <Col xs={12}>
                    {this.props.children}
                  </Col>
                </Row>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
