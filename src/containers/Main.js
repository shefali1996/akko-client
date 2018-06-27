import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter} from 'react-router';
import { Spin } from 'antd';
import swal from 'sweetalert2';
import {includes, isEmpty, isEqual} from 'lodash';
import { hasClass } from '../helpers/Csv';
import { fetchRoutes, fetchStatusInterval, pollingInterval, routeConstants } from '../constants';
import styles from '../constants/styles';
import user from '../auth/user';
import { getDataLoadStatus, getChannel, getLuTimestamp } from '../redux/dashboard/actions';


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel:       this.props.channelData,
      status:        this.props.status,
      isDataFetched: true
    };
  }
  componentWillMount() {
    window.removeEventListener('popstate', this.handleSWAL);
    const {location, userData} = this.props;
    if (user.isAuthenticated !== null) {
      if (userData.accountSetupStatus === 0 && location.pathname !== routeConstants.connectShopify) {
        this.props.history.push(routeConstants.connectShopify);
      } else if (userData.accountSetupStatus === 1 && location.pathname === routeConstants.setCogs) {
        this.setState({isDataFetched: false});
        this.getStatus();
      } else if (userData.accountSetupStatus === 1 && location.pathname !== routeConstants.fetchStatus) {
        this.props.history.push(routeConstants.fetchStatus);
      }
      this.lastUpdatedInterval = setInterval(() => {
        this.props.getLuTimestamp();
      }, pollingInterval);
    }
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handleSWAL);
  }

  componentWillReceiveProps(props) {
    const {status, channelData} = props;
    this.setState({
      status,
      channel: channelData
    }, () => {
      if (user.isAuthenticated !== null && location.pathname === routeConstants.setCogs) {
        if (isEmpty(status.data)) {
          this.getStatus();
        } else {
          this.checkFetchStatus();
        }
      }
    });
  }

  handleSWAL() {
    if (swal.isVisible()) {
      swal.close();
    }
  }
  checkFetchStatus = () => {
    const {channel, status} = this.state;
    const {location} = this.props;
    if (!isEmpty(status.data)) {
      if (status.data.num_products_pages_fetched === status.data.num_products_pages || status.data.completed === 1) {
        this.setState({
          isDataFetched: true
        });
      } else {
        this.props.history.push('/fetch-status');
      }
    }
  }
  getStatus = () => {
    const {channel, status} = this.state;
    if (channel.data.shopId) {
      this.props.getDataLoadStatus(channel.data.shopId);
    } else if (!channel.isLoading) {
      this.props.getChannel();
    }
  }
  render() {
    return (
      <div className="main-container">
        {
          this.state.isDataFetched ?
          this.props.children
          : <div style={styles.mainLoading}>
            <Spin size="large" />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    channelData: state.dashboard.channelData,
    status:      state.dashboard.status,
    userData:    state.dashboard.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getDataLoadStatus,
    getChannel,
    getLuTimestamp
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
