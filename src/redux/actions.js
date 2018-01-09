import {createAction} from 'redux-actions';
import * as constants from './constants';

export const getMetricsRequest = createAction(constants.GET_METRICS_REQUEST);
export const getMetricsSuccess = createAction(constants.GET_METRICS_SUCCESS);
export const getMetricsError = createAction(constants.GET_METRICS_ERROR);
