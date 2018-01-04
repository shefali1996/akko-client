import * as actions from '../../redux/actions';
import { invokeApig } from '../../libs/awsLib';
import {metrics} from '../../redux/api';


export const getMetrics = () => {
  return (dispatch, getState) => {
    dispatch(actions.getMetricsRequest());
    invokeApig({ path: metrics })
      .then((results) => {
        dispatch(actions.getMetricsSuccess(results));
      })
      .catch(error => {
        dispatch(actions.getMetricsSuccess('get metrics error'));
        console.log('get metrics error', error);
      });
  };
};
