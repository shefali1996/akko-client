import {createAction} from 'redux-actions';
import * as constants from './constants';

export const getMetricsRequest = createAction(constants.GET_METRICS_REQUEST);
export const getMetricsSuccess = createAction(constants.GET_METRICS_SUCCESS);
export const getMetricsError = createAction(constants.GET_METRICS_ERROR);

export const getUserRequest = createAction(constants.GET_USER_REQUEST);
export const getUserSuccess = createAction(constants.GET_USER_SUCCESS);
export const getUserError = createAction(constants.GET_USER_ERROR);

export const getChannelRequest = createAction(constants.GET_CHANNEL_REQUEST);
export const getChannelSuccess = createAction(constants.GET_CHANNEL_SUCCESS);
export const getChannelError = createAction(constants.GET_CHANNEL_ERROR);
