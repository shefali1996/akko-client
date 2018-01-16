import {createAction} from 'redux-actions';
import * as constants from './constants';

export const getMetricsRequest = createAction(constants.GET_METRICS_REQUEST);
export const getMetricsSuccess = createAction(constants.GET_METRICS_SUCCESS);
export const getMetricsError = createAction(constants.GET_METRICS_ERROR);

export const getChartDataRequest = createAction(constants.GET_CHART_DATA_REQUEST);
export const getChartDataSuccess = createAction(constants.GET_CHART_DATA_SUCCESS);
export const getChartDataError = createAction(constants.GET_CHART_DATA_ERROR);

export const emptyTimeFrameData = createAction(constants.EMPTY_TIME_FRAME_DATA);

export const getCustomersRequest = createAction(constants.GET_CUSTOMERS_REQUEST);
export const getCustomersSuccess = createAction(constants.GET_CUSTOMERS_SUCCESS);
export const getCustomersError = createAction(constants.GET_CUSTOMERS_ERROR);

export const getProductsRequest = createAction(constants.GET_PRODUCTS_REQUEST);
export const getProductsSuccess = createAction(constants.GET_PRODUCTS_SUCCESS);
export const getProductsError = createAction(constants.GET_PRODUCTS_ERROR);

export const getVariantsRequest = createAction(constants.GET_VARIANTS_REQUEST);
export const getVariantsSuccess = createAction(constants.GET_VARIANTS_SUCCESS);
export const getVariantsError = createAction(constants.GET_VARIANTS_ERROR);
