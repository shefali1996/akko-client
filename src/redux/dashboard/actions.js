import swal from 'sweetalert2';
import * as actions from '../../redux/actions';
import { invokeApigWithErrorReport, invokeApigWithoutErrorReport } from '../../libs/apiUtils';
import * as api from '../../redux/api';
import { invokeApig } from '../../libs/awsLib';
import {plotByOptions, vendorOptions, categoryOptions} from '../../constants';
import lodash from "lodash";

const moment = require('moment');

const dataFetchStatus = (results) => {
  if (results.statusCode === 1001) {
    swal({
      title:               'Info',
      icon:                'info',
      text:                'We are importing your data from Shopify. It will only take a few minutes. Please hang on',
      closeOnClickOutside: false
    });
    throw new Error('Fetch data incomplete from shopify');
  }
};

export const getMetrics = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.getMetricsRequest()); 
      invokeApigWithErrorReport({path: api.metrics})
        .then((results) => {                    
          dataFetchStatus(results);
          dispatch(actions.getMetricsSuccess(results));
          resolve();
        })
        .catch(error => {
          console.log('get metrics error', error);
          dispatch(actions.getMetricsError('get metrics error'));
        });
    });
  };
};

export const getChartData = (option, activeMetrics, metric_map, queryParams, shopId) => {  
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let path = '';
      if (option === plotByOptions.time) {
        path = api.metricsPathForTime(activeMetrics.metric_name);
    } else if (option === plotByOptions.vendors) {
      path = api.metricsPathForVendor(activeMetrics.metric_name);
    } else if (option === plotByOptions.categories) {
      path = api.metricsPathForCategory(activeMetrics.metric_name);
    }
    invokeApigWithErrorReport({ path, queryParams})
      .then((results) => {
        const data=_.cloneDeep(metric_map)
        data.result=results
        dispatch(actions.getChartDataSuccess({metric_name: activeMetrics.metric_name, option, data}));
        resolve();
      });
    })
  };
};

export const getUser = () => {
  return (dispatch, getState) => {
    dispatch(actions.getUserRequest());
    invokeApigWithErrorReport({ path: api.user })
    .then((results) => {        
      dispatch(actions.getUserSuccess(results));
    })
    .catch(error => {
        console.log('get user error', error);
        dispatch(actions.getUserError('get user error'));
      });
  };
};

export const emptyTimeFrameData = () => {
  return (dispatch, getState) => {
    dispatch(actions.emptyTimeFrameData());
  };
};

export const getProducts = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.getProductsRequest());
      invokeApigWithErrorReport({ path: api.products })
        .then((results) => {
          dataFetchStatus(results);
          if (!results.products) {
            throw new Error('results.products is undefined');
          }
          dispatch(actions.getProductsSuccess(results.products));
          resolve(results.products);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};

export const fireSetCogsAPI = (params) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      invokeApigWithErrorReport({
        path:   api.products,
        method: 'PUT',
        body:   params
      })
      .then((results) => {
          resolve(results);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};

export const cogsStatus = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      invokeApigWithErrorReport({ path: api.cogsStatus })
        .then((results) => {
          resolve(results);
        })
        .catch(error => {
          console.log('get cogsStatus error', error);
          reject(error);
        });
    });
  };
};

export const getVariants = (products) => {
  return (dispatch, getState) => {
    dispatch(actions.getVariantsRequest());
    const variants = [];
    products.map((prod, i) => {
      prod.variants.map((v, j) => {
        variants.push(v);
      });
    });
    dispatch(actions.getVariantsSuccess(variants));
  };
};

export const getChannel = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.getChannelRequest());
      invokeApigWithErrorReport({ path: api.channel })
      .then((results) => {          
          dispatch(actions.getChannelSuccess(results));
          resolve(results);
        })
        .catch(error => {
          console.log('get channel error', error);
          dispatch(actions.getChannelError('get channel error'));
          reject(error);
        });
      });
  };
};

export const getCategories = ({activeMetrics, label, id, queryParams = {}, option, metric_map,currentSubOption,categoryLabel}) => {  
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let path = '';
      if (label === categoryOptions.product) {
        path = api.metricsPathForProductByCategory(activeMetrics.metric_name, id);
      } else if (label === categoryOptions.variant) {
        path = api.metricsPathForVariantsByProduct(activeMetrics.metric_name, id);
      }
      invokeApigWithErrorReport({ path, queryParams })
      .then((results) => {
        const data = _.cloneDeep(metric_map);
        data.result=results
          dispatch(actions.getCategoriesSuccess({metric_name: activeMetrics.metric_name, option, data,currentSubOption,categoryLabel,id}));
          resolve();
        })
        .catch(error => {
          console.log('get Categories error', error);
          dispatch(actions.getCategoriesError('get Categories error'));
        });
      });
  };
};

export const getVendors = ({activeMetrics, label, id, queryParams = {}, option, metric_map}) => {  
  return (dispatch, getState) => {
    dispatch(actions.getVendorsRequest());  
    return new Promise((resolve, reject) => {
      let path = '';
      if (label === vendorOptions.time) {
        path = api.metricsPathForTimeByVendor(activeMetrics.metric_name, id);
      }
      invokeApigWithErrorReport({ 
        path: path, 
        queryParams: queryParams
      })
      .then((results) => {        
          const data = _.cloneDeep(metric_map);
          data.result=results
          dispatch(actions.getVendorsSuccess({metric_name: activeMetrics.metric_name, option, data,label,id}));
          resolve();
        })
        .catch(error => {
          console.log('get Vendors error', error);
          dispatch(actions.getVendorsError('get Vendors error'));
        });
      });
    };
  };
  
  export const getProductBySingleCategory = ({activeMetrics, label, id, queryParams = {}, option, metric_map,currentSubOption,categoryLabel}) => {
    
  return (dispatch, getState) => {
    dispatch(actions.getProductBySingleCategoryRequest());
    return new Promise((resolve, reject) => {
      let path = api.metricsPathForProductBySingleCategory(activeMetrics.metric_name, id);
      invokeApigWithErrorReport({ 
        path: path, 
        queryParams: queryParams
      })
      .then((results) => {
        const data = _.cloneDeep(metric_map);
        data.result=results
        dispatch(actions.getProductBySingleCategorySuccess({metric_name: activeMetrics.metric_name, option,data,currentSubOption,categoryLabel,id}));
          resolve();
        })
        .catch(error => {
          console.log('get ProductBySingleCategory error', error);
          dispatch(actions.getProductBySingleCategoryError('get ProductBySingleCategory error'));
        });
      });
    };
  };
  
export const getVariantBySingleProduct = ({activeMetrics, label, id, queryParams = {}, option, metric_map,currentSubOption,categoryLabel}) => {
  
  return (dispatch, getState) => {
    dispatch(actions.getVariantBySingleProductRequest());
    return new Promise((resolve, reject) => {
      let path = api.metricsPathForVariantBySingleProduct(activeMetrics.metric_name, id);
      invokeApigWithErrorReport({ 
        path: path, 
        queryParams: queryParams
      })
        .then((results) => {
          const data = _.cloneDeep(metric_map);
          data.result=results
          dispatch(actions.getVariantBySingleProductSuccess({metric_name: activeMetrics.metric_name, option, data,currentSubOption,categoryLabel,id}));
          resolve();
        })
        .catch(error => {
          console.log('get VariantBySingleProduct error', error);
          dispatch(actions.getVariantBySingleProductError('get VariantBySingleProduct error'));
        });
      });
  };
};

export const getTimeBySingleVariant = ({activeMetrics, label, productId, id, queryParams = {}, option, metric_map,currentSubOption,categoryLabel}) => {
  
  return (dispatch, getState) => {
    dispatch(actions.getTimeBySingleVariantRequest());
    return new Promise((resolve, reject) => {
      let path = api.metricsPathForTimeBySingleVariant(activeMetrics.metric_name, productId, id);
      invokeApigWithErrorReport({ 
        path: path, 
        queryParams: queryParams
      })
      .then((results) => {
        const data = _.cloneDeep(metric_map);        
        data.result=results
        dispatch(actions.getTimeBySingleVariantSuccess({metric_name: activeMetrics.metric_name, option, data,currentSubOption,categoryLabel,id}));
          resolve();
        })
        .catch(error => {
          console.log('get TimeBySingleVariant error', error);
          dispatch(actions.getTimeBySingleVariantError('get TimeBySingleVariant error'));
        });
      });
  };
};

export const getCount = () => {
  return (dispatch, getState) => {
    dispatch(actions.getProductsCountRequest());
    return new Promise((resolve, reject) => {
      invokeApigWithErrorReport({ path: api.getCount })
      .then((results) => {
        dispatch(actions.getProductsCountSuccess(results));
        })
        .catch(error => {
          console.log('get count error', error);
          dispatch(actions.getProductsCountRequest('Error: get count error'));
        });
    });
  };
};

export const getDataLoadStatus = (shopId) => {
  return (dispatch, getState) => {
    invokeApigWithErrorReport({ path: api.dataLoadStatus(shopId) })
      .then((results) => {        
        const {
          num_customers_pages,
          num_orders_pages,
          num_products_pages,
          num_products_pages_fetched,
          num_customers_pages_fetched,
          num_orders_pages_fetched
        } = results;
        results.num_total_pages = num_customers_pages + num_orders_pages + num_products_pages;
        results.num_total_pages_fetched = num_customers_pages_fetched + num_orders_pages_fetched + num_products_pages_fetched;
        results.fetchedPercent = Math.floor((results.num_total_pages_fetched * 100) / results.num_total_pages);
        dispatch(actions.getDataLoadStatusSuccess(results));
      })
      .catch(error => {
        console.log('get status error', error);
        dispatch(actions.getDataLoadStatusError('get status error'));
      });
  };
};

export const getLuTimestamp = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      invokeApigWithoutErrorReport({ path: api.getLuTimestamp })
        .then((results) => {
          console.log('results----------------', results);
          results.lastUpdated = moment(results.lastUpdated, 'YYYY-MM-DD HH:mm:ss').valueOf();
          dispatch(actions.getLastUpdatedTimestampSuccess(results));
          resolve();
        })
        .catch(error => {
          console.log('get lu timestamp error', error);
        });
      });
  };
};

export const connectShopify = (body = {}) => {  
  
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      invokeApigWithErrorReport({
        path:   api.connectShopify,
        method: 'POST',
        body
      })
      
        .then((result) => {          
          if(result.uri == undefined){
            dispatch(actions.getConnectShopifyAlertSuccess(result));
            resolve();
            swal({
              type:              'error',
              title:             `Error`,
              html:              "This shop is owned by a different akko user. Please contact us at" + ' <a href="mailto:help@akko.io"> help@akko.io</a>' + "for further assistance",
              allowOutsideClick: false,
              confirmButtonText: 'OK',
              focusConfirm:      false
            })      
          } else{
            window.location = result.uri;
          }
        })
        .catch(error => {
          console.log('connectShopify error', error);
          reject();
        });
      });
    };
};

export const updateShopify = (body = {}) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      invokeApigWithErrorReport({
        path:   api.connectShopify,
        method: 'PUT',
        body
      })
      .then((result) => {
          localStorage.setItem('isAuthenticated', 'isAuthenticated');
          resolve();
        })
        .catch(error => {
          console.log('updateShopify error', error);
          reject();
        });
    });
  };
};

export const getClearChartData = () => {
  return (dispatch, getState) => {
    dispatch(actions.getClearChartDataSuccess());
  };
};

export const getMetricsWithoutLoading=()=>{
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      invokeApigWithErrorReport({path: api.metrics})
        .then((results) => {                    
          dataFetchStatus(results);
          dispatch(actions.getMetricsSuccess(results));
          resolve();
        })
        .catch(error => {
          console.log('get metrics error', error);
          dispatch(actions.getMetricsError('get metrics error'));
        });
    });
  };
}

export const getMetricsDataByName=(queryParams)=>{  
  return (dispatch,getState)=>{
    return new Promise((resolve,reject)=>{
      invokeApigWithErrorReport({path: api.metricsDataByName(queryParams)})
      .then((results)=>{        
        dispatch(actions.getMetricsDataByNameSuccess({results,queryParams}));
        resolve();
      })
      .catch(error=>{
        console.log('get metrics error', error);
        dispatch(actions.getMetricsError('get metrics error'));
      });
    });
  };
}
