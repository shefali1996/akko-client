import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter} from 'react-router';
import { Spin } from 'antd';
import swal from 'sweetalert';
import {includes, isEmpty, isEqual} from 'lodash';
import { hasClass } from '../helpers/Csv';
import { fetchRoutes, fetchStatusInterval, routeConstants } from '../constants';
import styles from '../constants/styles';
import { getDataLoadStatus, getChannel } from '../redux/dashboard/actions';

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
    const {location} = this.props;
    if (includes(fetchRoutes, location.pathname)) {
      this.setState({
        isDataFetched: false
      });
      this.getStatus();
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
      if (isEmpty(status.data)) {
        this.getStatus();
      } else {
        this.checkFetchStatus();
      }
    });
  }

  handleSWAL() {
    const modal = document.querySelector('.sweet-alert');
    if (modal && hasClass(modal, 'showSweetAlert')) {
      swal.close();
    }
  }
  checkFetchStatus = () => {
    const {channel, status} = this.state;
    const {location} = this.props;
    if (includes(fetchRoutes, location.pathname) && !isEmpty(status.data)) {
      if ((isEqual(routeConstants.setCogs, location.pathname) && status.data.num_products_pages_fetched === status.data.num_products_pages)
      || status.data.fetchedPercent >= 100) {
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
    getChannel
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
