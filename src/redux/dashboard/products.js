import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import * as constants from '../../redux/constants';

const initialState = {
  products: {
    data: {
      products: [],
      variants: []
    },
    isProductLoading:  false,
    isVariantsLoading: false,
    isError:           false,
    isSuccess:         false,
    message:           ''
  }
};

const getProductsRequest = (state, action) => update(state, {
  products: {
    isProductLoading: {$set: true},
    isError:          {$set: false},
    isSuccess:        {$set: false},
    message:          {$set: ''}
  }
});
const getProductsSuccess = (state, action) => {
  const newData = _.cloneDeep(state.products.data);
  newData.products = action.payload;
  return update(state, {
    products: {
      data:             {$set: newData},
      isProductLoading: {$set: false},
      isError:          {$set: false},
      isSuccess:        {$set: true},
      message:          {$set: ''}
    }
  });
};
const getProductsError = (state, action) => update(state, {
  products: {
    isProductLoading: {$set: false},
    isSuccess:        {$set: false},
    isError:          {$set: true},
    message:          {$set: action.payload}
  }
});

const getVariantsRequest = (state, action) => update(state, {
  products: {
    isVariantsLoading: {$set: true},
    isError:           {$set: false},
    isSuccess:         {$set: false},
    message:           {$set: ''}
  }
});
const getVariantsSuccess = (state, action) => {
  const newData = _.cloneDeep(state.products.data);
  newData.variants = action.payload;
  return update(state, {
    products: {
      data:              {$set: newData},
      isVariantsLoading: {$set: false},
      isError:           {$set: false},
      isSuccess:         {$set: true},
      message:           {$set: ''}
    }
  });
};
const getVariantsError = (state, action) => update(state, {
  products: {
    isVariantsLoading: {$set: false},
    isSuccess:         {$set: false},
    isError:           {$set: true},
    message:           {$set: action.payload}
  }
});

const updateVariantsSuccess = (state, action) => {
  const newData = _.cloneDeep(state.products.data);
  action.payload.map((results, i) => {
    if (results.lastUpdated !== -1 && !isEmpty(results.variants)) {
      const updatedVariants = [];
      const i = _.findIndex(newData.variants, ['productId', results.productId]);
      if (i >= 0) {
        newData.variants[i].variants.map((preVariant, i) => {
          let isUpdated = false;
          results.variants.map((newVariant, k) => {
            if (preVariant.id === newVariant.id) {
              updatedVariants.push(newVariant);
              isUpdated = true;
            }
          });
          if (!isUpdated) {
            updatedVariants.push(preVariant);
          }
        });
        newData.variants[i].variants = updatedVariants;
        newData.variants[i].lastUpdated = results.lastUpdated;
      }
    }
  });
  return update(state, {
    products: {
      data:              {$set: newData},
      isVariantsLoading: {$set: false},
      isError:           {$set: false},
      isSuccess:         {$set: true},
      message:           {$set: ''}
    }
  });
};
export default handleActions({
  [constants.GET_PRODUCTS_REQUEST]: getProductsRequest,
  [constants.GET_PRODUCTS_SUCCESS]: getProductsSuccess,
  [constants.GET_PRODUCTS_ERROR]:   getProductsError,

  [constants.GET_VARIANTS_REQUEST]: getVariantsRequest,
  [constants.GET_VARIANTS_SUCCESS]: getVariantsSuccess,
  [constants.GET_VARIANTS_ERROR]:   getVariantsError,

  [constants.UPDATE_VARIANTS_SUCCESS]: updateVariantsSuccess,
}, initialState);
