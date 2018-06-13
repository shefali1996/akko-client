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
  },
  productCount: {
    data:      {},
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  },
  status: {
    data:      {},
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  },
  lastUpdated: {
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
const getStatusSuccess = (state, action) => update(state, {
  status: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
const getStatusError = (state, action) => update(state, {
  status: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

const getLastUpdatedTimestampSuccess = (state, action) => update(state, {
  lastUpdated: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});

const getProductsCountRequest = (state, action) => update(state, {
  productCount: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getProductsCountSuccess = (state, action) => update(state, {
  productCount: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
const getProductsCountError = (state, action) => update(state, {
  productCount: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

export default handleActions({
  [constants.GET_METRICS_REQUEST]:                getMetricsRequest,
  [constants.GET_METRICS_SUCCESS]:                getMetricsSuccess,
  [constants.GET_METRICS_ERROR]:                  getMetricsError,
  [constants.GET_USER_REQUEST]:                   getUserRequest,
  [constants.GET_USER_SUCCESS]:                   getUserSuccess,
  [constants.GET_USER_ERROR]:                     getUserError,
  [constants.GET_CHANNEL_REQUEST]:                getChannelRequest,
  [constants.GET_CHANNEL_SUCCESS]:                getChannelSuccess,
  [constants.GET_CHANNEL_ERROR]:                  getChannelError,
  [constants.GET_PRODUCTS_COUNT_REQUEST]:         getProductsCountRequest,
  [constants.GET_PRODUCTS_COUNT_SUCCESS]:         getProductsCountSuccess,
  [constants.GET_PRODUCTS_COUNT_ERROR]:           getProductsCountError,
  [constants.GET_DATA_LOAD_STATUS_SUCCESS]:       getStatusSuccess,
  [constants.GET_DATA_LOAD_STATUS_ERROR]:         getStatusError,
  [constants.GET_LAST_UPDATED_TIMESTAMP_SUCCESS]: getLastUpdatedTimestampSuccess
}, initialState);
