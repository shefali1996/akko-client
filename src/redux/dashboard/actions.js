import * as actions from '../../redux/actions';
import { invokeApig } from '../../libs/awsLib';
import * as api from '../../redux/api';
import {plotByOptions} from '../../constants';


export const getMetrics = () => {
  return (dispatch, getState) => {
    dispatch(actions.getMetricsRequest());
    invokeApig({ path: api.metrics })
      .then((results) => {
        dispatch(actions.getMetricsSuccess(results));
      })
      .catch(error => {
        console.log('get metrics error', error);
        dispatch(actions.getMetricsSuccess('get metrics error'));
      });
  };
};

export const getChartData = (option, activeMetrics, metric_map, queryParams) => {
  return (dispatch, getState) => {
    let path = '';
    if (option === plotByOptions.time) {
      path = api.metricsPathForTime(activeMetrics.metric_name);
    } else if (option === plotByOptions.product) {
      path = api.metricsPathForProduct(activeMetrics.metric_name);
    } else if (option === plotByOptions.customer) {
      path = api.metricsPathForCustomer(activeMetrics.metric_name);
    }
    invokeApig({ path, queryParams})
      .then((results) => {
        if (!results.metrics) {
          throw new Error('results.metrics is undefined');
        }
        metric_map.result = results;
        dispatch(actions.getChartDataSuccess({metric_name: activeMetrics.metric_name, option, metric_map}));
      });
  };
};

export const getUser = () => {
  return (dispatch, getState) => {
    dispatch(actions.getUserRequest());
    invokeApig({ path: api.user })
      .then((results) => {
        dispatch(actions.getUserSuccess(results));
      })
      .catch(error => {
        console.log('get user error', error);
        dispatch(actions.getUserError('get user error'));
      });
  };
};

export const emptyTimeFrameData = () => {
  return (dispatch, getState) => {
    dispatch(actions.emptyTimeFrameData());
  };
};

export const getChannel = () => {
  return (dispatch, getState) => {
    dispatch(actions.getChannelRequest());
    invokeApig({ path: api.channel })
      .then((results) => {
        dispatch(actions.getChannelSuccess(results));
      })
      .catch(error => {
        console.log('get channel error', error);
        dispatch(actions.getChannelError('get channel error'));
      });
  };
};
