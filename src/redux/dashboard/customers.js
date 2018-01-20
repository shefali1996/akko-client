import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import * as constants from '../../redux/constants';

const initialState = {
  customers: {
    data:      {},
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  }
};

const getCustomersRequest = (state, action) => update(state, {
  customers: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getCustomersSuccess = (state, action) => update(state, {
  customers: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
const getCustomersError = (state, action) => update(state, {
  customers: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

export default handleActions({
  [constants.GET_CUSTOMERS_REQUEST]: getCustomersRequest,
  [constants.GET_CUSTOMERS_SUCCESS]: getCustomersSuccess,
  [constants.GET_CUSTOMERS_ERROR]:   getCustomersError,
}, initialState);
