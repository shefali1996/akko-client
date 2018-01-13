import * as actions from '../../redux/actions';
import { invokeApig } from '../../libs/awsLib';
import {metrics, user, channel} from '../../redux/api';


export const getMetrics = () => {
  return (dispatch, getState) => {
    dispatch(actions.getMetricsRequest());
    invokeApig({ path: metrics })
      .then((results) => {
        dispatch(actions.getMetricsSuccess(results));
      })
      .catch(error => {
        console.log('get metrics error', error);
        dispatch(actions.getMetricsSuccess('get metrics error'));
      });
  };
};

export const getUser = () => {
  return (dispatch, getState) => {
    dispatch(actions.getUserRequest());
    invokeApig({ path: user })
      .then((results) => {
        dispatch(actions.getUserSuccess(results));
      })
      .catch(error => {
        console.log('get user error', error);
        dispatch(actions.getUserError('get user error'));
      });
  };
};

export const getChannel = () => {
  return (dispatch, getState) => {
    dispatch(actions.getChannelRequest());
    invokeApig({ path: channel })
      .then((results) => {
        dispatch(actions.getChannelSuccess(results));
      })
      .catch(error => {
        console.log('get channel error', error);
        dispatch(actions.getChannelError('get channel error'));
      });
  };
};
