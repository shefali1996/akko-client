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

export const getChartData = (option, activeMetrics, queryParams) => {
  return (dispatch, getState) => {
    let path = '';
    if (option === plotByOptions.time) {
      path = api.metricsPathForTime(activeMetrics.metric_name);
    } else if (option === plotByOptions.product) {
      path = api.metricsPathForProduct(activeMetrics.metric_name);
    } else if (option === plotByOptions.customer) {
      path = api.metricsPathForCustomer(activeMetrics.metric_name);
    }
    return invokeApig({ path, queryParams});
  };
};
