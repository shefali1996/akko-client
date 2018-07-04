import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter} from 'react-router';
import {isEmpty} from 'lodash';
import FetchStatus from '../components/FetchStatus';
import { fetchStatusInterval } from '../constants';
import {getDataLoadStatus, getChannel} from '../redux/dashboard/actions';

class FetchStatusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel:        this.props.channelData,
      status:         this.props.status,
      fetchedPercent: 0
    };
  }

  componentWillMount() {
    this.getStatus();
    this.statusInterval = setInterval(() => {
      this.getStatus();
    }, fetchStatusInterval);
  }

  componentWillReceiveProps(props) {
    const {status, channelData} = props;
    this.setState({
      status,
      channel:        channelData,
      fetchedPercent: status.data.fetchedPercent || 0
    }, () => {
      this.checkFetchStatus();
    });
  }
  checkFetchStatus = () => {
    const {channel, status} = this.state;
    if (!isEmpty(status.data) && status.data.fetchedPercent >= 100) {
      clearInterval(this.statusInterval);
      this.props.history.push('/dashboard');
    }
  }
  getStatus = () => {
    const {channel} = this.state;
    if (channel.data.shopId) {
      this.props.getDataLoadStatus(channel.data.shopId);
    } else if (!channel.isLoading) {
      this.props.getChannel();
    }
  }
  render() {
    return (
      <FetchStatus percent={this.state.fetchedPercent} {...this.props} />
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getDataLoadStatus,
      getChannel
    },
    dispatch
  );
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FetchStatusContainer));
