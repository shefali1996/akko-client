import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import * as constants from '../../redux/constants';

const initialState = {
  products: {
    data: {
      products: {},
      variants: {}
    },
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  }
};

const getProductsRequest = (state, action) => update(state, {
  products: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getProductsSuccess = (state, action) => {
  const newData = _.cloneDeep(state.products.data);
  newData.products = action.payload;
  return update(state, {
    products: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
const getProductsError = (state, action) => update(state, {
  products: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});
const getVariantsSuccess = (state, action) => {
  const newData = _.cloneDeep(state.products.data);
  newData.variants = action.payload;
  return update(state, {
    products: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
};
export default handleActions({
  [constants.GET_PRODUCTS_REQUEST]: getProductsRequest,
  [constants.GET_PRODUCTS_SUCCESS]: getProductsSuccess,
  [constants.GET_PRODUCTS_ERROR]:   getProductsError,
  [constants.GET_VARIANTS_SUCCESS]: getVariantsSuccess,
}, initialState);
