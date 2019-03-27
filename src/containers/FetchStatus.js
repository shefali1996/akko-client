import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter} from 'react-router';
import isEmpty from "lodash/isEmpty"
import FetchStatus from '../components/FetchStatus';
import { pollingInterval } from '../constants';
import user from '../auth/user';
import {getDataLoadStatus, getChannel} from '../redux/dashboard/actions';

class FetchStatusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel:        this.props.channelData,
      status:         this.props.dataLoadStatus,
      fetchedPercent: 0
    };
  }

  componentWillMount() {
    this.getStatus();
    this.statusInterval = setInterval(() => {
      if (user.isAuthenticated != null && dataLoadStatus.data.completed !== 1) {
        this.getStatus();
      } else{
        clearInterval(this.statusInterval);
      }
    }, pollingInterval.fetchStatusInterval);
  }

  componentWillReceiveProps(props) {
    const {status, channelData, dataLoadStatus} = props;
    if(dataLoadStatus.data.completed == 1){
      this.setState({
        fetchedPercent: 100
      })
      clearInterval(this.statusInterval);
      this.props.history.push('/dashboard');
    } else{
      this.setState({
        status:         dataLoadStatus,
        channel:        channelData,
        fetchedPercent: dataLoadStatus.data.fetchedPercent || 0
      }, () => {
        this.checkFetchStatus();
      });
    }
  }
  checkFetchStatus = () => {
    const {channel, status} = this.state;
    if ((!isEmpty(status.data) && status.data.fetchedPercent >= 100) || status.data.completed === -1) {
      clearInterval(this.statusInterval);
      this.props.history.push('/dashboard');
    }
  }
  getStatus = () => {
    const {channel} = this.state;
    if (channel.data.shopId) {
      this.props.getDataLoadStatus(channel.data.shopId);
    } else if (!channel.isLoading) {
      this.props.getChannel().then((res)=>{
        this.props.getDataLoadStatus(res.shopId);
      });
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
    channelData:    state.dashboard.channelData,
    status:         state.dashboard.status,
    dataLoadStatus: state.dashboard.dataLoadStatus,
    userData:       state.dashboard.userData,
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
