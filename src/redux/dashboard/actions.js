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


export const emptyTimeFrameData = () => {
  return (dispatch, getState) => {
    dispatch(actions.emptyTimeFrameData());
  };
};


export const getCustomers = () => {
  return (dispatch, getState) => {
    invokeApig({
      path:        api.customers(),
      queryParams: {
        avgOrderValue:    true,
        reOrderFrequency: true
      }
    })
      .then((results) => {
        if (!results.customers) {
          throw new Error('results.customers is undefined');
        }
        dispatch(actions.getCustomersSuccess(results.customers));
      });
  };
};
