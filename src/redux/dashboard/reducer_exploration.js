import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import * as constants from '../../redux/constants';

const initialState = {
  chartData: {
    data:      {},
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
const getChartDataSuccess = (state, action) => update(state, {
  chartData: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
const getChartDataError = (state, action) => update(state, {
  chartData: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

export default handleActions({
  [constants.GET_CHART_DATA_REQUEST]: getChartDataRequest,
  [constants.GET_CHART_DATA_SUCCESS]: getChartDataSuccess,
  [constants.GET_CHART_DATA_ERROR]:   getChartDataError,
}, initialState);
