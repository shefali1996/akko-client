import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import {cloneDeep} from 'lodash';
import * as constants from '../../redux/constants';

const initialState = {
  chartData: {
    data: {
      customTimeframeDataMap: {},
      defaultDataMap:         {},
      categoriesData:         {}
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
  const {metric_name, option, metric_map} = action.payload;
  const newData = cloneDeep(state.chartData.data);
  const key = `${metric_name}:${option}`;
  if (metric_map.timeFrame) {
    newData.customTimeframeDataMap[key] = metric_map;
  } else {
    newData.defaultDataMap[key] = metric_map;
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
  const newData = cloneDeep(state.chartData.data);
  newData.categoriesData = action.payload;
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
export default handleActions({
  [constants.GET_CHART_DATA_REQUEST]: getChartDataRequest,
  [constants.GET_CHART_DATA_SUCCESS]: getChartDataSuccess,
  [constants.GET_CHART_DATA_ERROR]:   getChartDataError,
  [constants.EMPTY_TIME_FRAME_DATA]:  emptyTimeFrameData,
  [constants.GET_CATEGORIES_SUCCESS]: getCategoriesSuccess,
}, initialState);
