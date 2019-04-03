import {createAction} from 'redux-actions';
import * as constants from './constants';

export const getMetricsRequest = createAction(constants.GET_METRICS_REQUEST);
export const getMetricsSuccess = createAction(constants.GET_METRICS_SUCCESS);
export const getMetricsError = createAction(constants.GET_METRICS_ERROR);

export const getMetricsDataByNameRequest = createAction(constants.GET_METRICS_DATA_BY_NAME_REQUEST);
export const getMetricsDataByNameSuccess = createAction(constants.GET_METRICS_DATA_BY_NAME_SUCCESS);
export const getMetricsDataByNameError = createAction(constants.GET_METRICS_DATA_BY_NAME_ERROR);

export const getChartDataRequest = createAction(constants.GET_CHART_DATA_REQUEST);
export const getChartDataSuccess = createAction(constants.GET_CHART_DATA_SUCCESS);
export const getChartDataError = createAction(constants.GET_CHART_DATA_ERROR);

export const emptyTimeFrameData = createAction(constants.EMPTY_TIME_FRAME_DATA);

export const getProductsRequest = createAction(constants.GET_PRODUCTS_REQUEST);
export const getProductsSuccess = createAction(constants.GET_PRODUCTS_SUCCESS);
export const getProductsError = createAction(constants.GET_PRODUCTS_ERROR);

export const getVariantsRequest = createAction(constants.GET_VARIANTS_REQUEST);
export const getVariantsSuccess = createAction(constants.GET_VARIANTS_SUCCESS);
export const getVariantsError = createAction(constants.GET_VARIANTS_ERROR);

export const getUserRequest = createAction(constants.GET_USER_REQUEST);
export const getUserSuccess = createAction(constants.GET_USER_SUCCESS);
export const getUserError = createAction(constants.GET_USER_ERROR);

export const getChannelRequest = createAction(constants.GET_CHANNEL_REQUEST);
export const getChannelSuccess = createAction(constants.GET_CHANNEL_SUCCESS);
export const getChannelError = createAction(constants.GET_CHANNEL_ERROR);

export const getCategoriesSuccess = createAction(constants.GET_CATEGORIES_SUCCESS);

export const getProductsCountRequest = createAction(constants.GET_PRODUCTS_COUNT_REQUEST);
export const getProductsCountSuccess = createAction(constants.GET_PRODUCTS_COUNT_SUCCESS);
export const getProductsCountError = createAction(constants.GET_PRODUCTS_COUNT_ERROR);

export const getVendorsRequest = createAction(constants.GET_VENDORS_REQUEST);
export const getVendorsSuccess = createAction(constants.GET_VENDORS_SUCCESS);
export const getVendorsError = createAction(constants.GET_VENDORS_ERROR);

export const getProductBySingleCategoryRequest = createAction(constants.GET_PRODUCT_BY_SINGLE_CATEGORY_REQUEST);
export const getProductBySingleCategorySuccess = createAction(constants.GET_PRODUCT_BY_SINGLE_CATEGORY_SUCCESS);
export const getProductBySingleCategoryError = createAction(constants.GET_PRODUCT_BY_SINGLE_CATEGORY_ERROR);

export const getVariantBySingleProductRequest = createAction(constants.GET_VARIANT_BY_SINGLE_PRODUCT_REQUEST);
export const getVariantBySingleProductSuccess = createAction(constants.GET_VARIANT_BY_SINGLE_PRODUCT_SUCCESS);
export const getVariantBySingleProductError = createAction(constants.GET_VARIANT_BY_SINGLE_PRODUCT_ERROR);

export const getTimeBySingleVariantRequest = createAction(constants.GET_TIME_BY_SINGLE_VARIANT_REQUEST);
export const getTimeBySingleVariantSuccess = createAction(constants.GET_TIME_BY_SINGLE_VARIANT_SUCCESS);
export const getTimeBySingleVariantError = createAction(constants.GET_TIME_BY_SINGLE_VARIANT_ERROR);

export const getDataLoadStatusSuccess = createAction(constants.GET_DATA_LOAD_STATUS_SUCCESS);
export const getDataLoadStatusError = createAction(constants.GET_DATA_LOAD_STATUS_ERROR);

export const getClearChartDataSuccess = createAction(constants.GET_CLEAR_CHARTDATA_SUCCESS);

export const getConnectShopifyAlertSuccess = createAction(constants.GET_CONNECT_SHOPIFY_ALERT_SUCCESS);

export const getLastUpdatedTimestampSuccess = createAction(constants.GET_LAST_UPDATED_TIMESTAMP_SUCCESS);

//goals
export const getActiveGoalsRequest = createAction(constants.GET_ACTIVE_GOALS_DATA_REQUEST);
export const getActiveGoalsSuccess = createAction(constants.GET_ACTIVE_GOALS_DATA_SUCCESS);
export const getActiveGoalsError = createAction(constants.GET_ACTIVE_GOALS_DATA_ERROR);

export const getAllGoalsRequest = createAction(constants.GET_ALL_GOALS_DATA_REQUEST);
export const getAllGoalsSuccess = createAction(constants.GET_ALL_GOALS_DATA_SUCCESS);
export const getAllGoalsError = createAction(constants.GET_ALL_GOALS_DATA_ERROR);

export const saveGoalRequest = createAction(constants.SAVE_GOAL_REQUEST);
export const saveGoalSuccess = createAction(constants.SAVE_GOAL_SUCCESS);
export const saveGoalError = createAction(constants.SAVE_GOAL_ERROR);


export const addGoalRequest = createAction(constants.ADD_GOAL_REQUEST);
export const addGoalSuccess = createAction(constants.ADD_GOAL_SUCCESS);
export const addGoalError = createAction(constants.ADD_GOAL_ERROR);

export const deleteGoalRequest = createAction(constants.DELETE_GOAL_REQUEST);
export const deleteGoalSuccess = createAction(constants.DELETE_GOAL_SUCCESS);
export const deleteGoalError = createAction(constants.DELETE_GOAL_ERROR);

export const archiveGoalRequest = createAction(constants.ARCHIVE_GOAL_REQUEST);
export const archiveGoalSuccess = createAction(constants.ARCHIVE_GOAL_SUCCESS);
export const archiveGoalError = createAction(constants.ARCHIVE_GOAL_ERROR);

export const showEditGoalModal = createAction(constants.SHOW_EDIT_GOAL_MODAL);
export const hideEditGoalModal = createAction(constants.HIDE_EDIT_GOAL_MODAL);

