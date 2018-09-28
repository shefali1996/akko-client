import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import {cloneDeep} from 'lodash';
import * as constants from '../../redux/constants';

const initialState = {
  chartData: {
    data: {
      customTimeframeDataMap:     {},
      defaultDataMap:             {},
      categoriesData:             {},
      vendorsData:                {},
      productBySingleCategoryData:{},
      timeBySingleProductData:    {},
      variantBySingleProductData: {},
      timeBySingleVariantData:    {},
    },
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  }
};

const getChartDataRequest = (state, action) => update(state, {
  chartData: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getChartDataSuccess = (state, action) => {

  const {metric_name, option, data} = action.payload;
  const newData = cloneDeep(state.chartData.data);
  const key = `${metric_name}:${option}`;
  if (data.timeFrame) {
    newData.customTimeframeDataMap[key] = data;
  } else {
    newData.defaultDataMap[key] = data;
  }    
  return update(state, {
    chartData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getChartDataError = (state, action) => update(state, {
  chartData: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

const emptyTimeFrameData = (state, action) => {
  const newData = cloneDeep(state.chartData.data);
  newData.customTimeframeDataMap = {};
  return update(state, {
    chartData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getCategoriesSuccess = (state, action) => { 
  const {metric_name, option, data,currentSubOption,categoryLabel,id} = action.payload;
  const newData = cloneDeep(state.chartData.data);
  const key = `${metric_name}:${option}:${categoryLabel}:${currentSubOption}:${id}`;
  if (data.timeFrame) {
    newData.customTimeframeDataMap[key] = data;
  } else {
    newData.defaultDataMap[key] = data;
  }
  return update(state, {
    chartData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getVendorsSuccess = (state, action) => {
  const {metric_name, option, data,label,id} = action.payload;
  const newData = cloneDeep(state.chartData.data);
  const key = `${metric_name}:${option}:${label}:${id}`;
  if (data.timeFrame) {
    newData.customTimeframeDataMap[key] = data;
  } else {    
    newData.defaultDataMap[key] = data;
  }
  return update(state, {
    chartData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getProductBySingleCategorySuccess = (state, action) => {
  const {metric_name, option, data,currentSubOption,categoryLabel,id} = action.payload;
  const newData = cloneDeep(state.chartData.data);
  const key = `${metric_name}:${option}:${categoryLabel}:${currentSubOption}:${id}`;
  if (data.timeFrame) {
    newData.customTimeframeDataMap[key] = data;
  } else {
    newData.defaultDataMap[key] = data;
  }
  return update(state, {
    chartData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getVariantBySingleProductSuccess = (state, action) => {
  const {metric_name, option, data,categoryLabel,currentSubOption,id} = action.payload;
  const newData = cloneDeep(state.chartData.data);
  const key = `${metric_name}:${option}:${categoryLabel}:${currentSubOption}:${id}`;
  if (data.timeFrame) {
    newData.customTimeframeDataMap[key] = data;
  } else {
    newData.defaultDataMap[key] = data;
  }
  return update(state, {
    chartData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getTimeBySingleVariantSuccess = (state, action) => {
  const {metric_name, option, data,currentSubOption,categoryLabel,id} = action.payload;  
  const newData = cloneDeep(state.chartData.data);
  const key = `${metric_name}:${option}:${categoryLabel}:${currentSubOption}:${id}`;
  if (data.timeFrame) {
    newData.customTimeframeDataMap[key] = data;
  } else {
    newData.defaultDataMap[key] = data;
  }
  return update(state, {
    chartData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};

const getClearChartDataSuccess = (state, action) => {
  return update(state, {
    chartData: {
      data: {$set:{
        customTimeframeDataMap:     {},
        defaultDataMap:             {},
        categoriesData:             {},
        vendorsData:                {},
        productBySingleCategoryData:{},
        timeBySingleProductData:    {},
        variantBySingleProductData: {},
        timeBySingleVariantData:    {},
      }},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
}

export default handleActions({
  [constants.GET_CHART_DATA_REQUEST]: getChartDataRequest,
  [constants.GET_CHART_DATA_SUCCESS]: getChartDataSuccess,
  [constants.GET_CHART_DATA_ERROR]:   getChartDataError,
  [constants.GET_CLEAR_CHARTDATA_SUCCESS]:   getClearChartDataSuccess,
  [constants.EMPTY_TIME_FRAME_DATA]:  emptyTimeFrameData,
  [constants.GET_CATEGORIES_SUCCESS]: getCategoriesSuccess,
  [constants.GET_VENDORS_SUCCESS]: getVendorsSuccess,
  [constants.GET_PRODUCT_BY_SINGLE_CATEGORY_SUCCESS]: getProductBySingleCategorySuccess,
  [constants.GET_VARIANT_BY_SINGLE_PRODUCT_SUCCESS]: getVariantBySingleProductSuccess,
  [constants.GET_TIME_BY_SINGLE_VARIANT_SUCCESS]: getTimeBySingleVariantSuccess,
}, initialState);
