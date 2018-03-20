import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import {cloneDeep, find} from 'lodash';
import * as constants from '../../redux/constants';

const initialState = {
  metricsData: {
    data:      {},
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  },
  userData: {
    data:      {},
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  },
  channelData: {
    data:      {},
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  }
};

const getMetricsRequest = (state, action) => update(state, {
  metricsData: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getMetricsSuccess = (state, action) => update(state, {
  metricsData: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
const updateMetricsSuccess = (state, action) => {
  let newData = state.metricsData.data;
  if (action.payload.metrics.length) {
    newData = cloneDeep(state.metricsData.data);
    newData.lastUpdated = action.payload.lastUpdated;
    newData.metrics.map((obj, i) => {
      const updatedMetric = find(action.payload.metrics, {metric_name: obj.metric_name});
      if (updatedMetric) {
        obj = updatedMetric;
      }
    });
  }
  return update(state, {
    metricsData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getMetricsError = (state, action) => update(state, {
  metricsData: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

const getUserRequest = (state, action) => update(state, {
  userData: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getUserSuccess = (state, action) => update(state, {
  userData: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
const getUserError = (state, action) => update(state, {
  userData: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

const getChannelRequest = (state, action) => update(state, {
  channelData: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getChannelSuccess = (state, action) => update(state, {
  channelData: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
const getChannelError = (state, action) => update(state, {
  channelData: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

export default handleActions({
  [constants.GET_METRICS_REQUEST]:    getMetricsRequest,
  [constants.GET_METRICS_SUCCESS]:    getMetricsSuccess,
  [constants.GET_METRICS_ERROR]:      getMetricsError,
  [constants.UPDATE_METRICS_SUCCESS]: updateMetricsSuccess,
  [constants.GET_USER_REQUEST]:       getUserRequest,
  [constants.GET_USER_SUCCESS]:       getUserSuccess,
  [constants.GET_USER_ERROR]:         getUserError,
  [constants.GET_CHANNEL_REQUEST]:    getChannelRequest,
  [constants.GET_CHANNEL_SUCCESS]:    getChannelSuccess,
  [constants.GET_CHANNEL_ERROR]:      getChannelError
}, initialState);
