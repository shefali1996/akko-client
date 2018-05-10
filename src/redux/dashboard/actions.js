import * as actions from '../../redux/actions';
import { invokeApig } from '../../libs/awsLib';
import * as api from '../../redux/api';
import {plotByOptions, categoryOptions} from '../../constants';


export const getMetrics = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.getMetricsRequest());
      invokeApig({path: api.metrics})
        .then((results) => {
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

export const updateMetrics = (lastUpdated) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      invokeApig({
        path:        api.metrics,
        queryParams: {
          lastUpdated
        }
      })
        .then((results) => {
          dispatch(actions.updateMetricsSuccess(results));
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
    let path = '';
    if (option === plotByOptions.time) {
      path = api.metricsPathForTime(activeMetrics.metric_name, shopId);
    } else if (option === plotByOptions.product) {
      path = api.metricsPathForProduct(activeMetrics.metric_name);
    } else if (option === plotByOptions.customer) {
      path = api.metricsPathForCustomer(activeMetrics.metric_name);
    } else if (option === plotByOptions.categories) {
      path = api.metricsPathForCategory(activeMetrics.metric_name);
    }
    invokeApig({ path, queryParams})
      .then((results) => {
        if (!results.metrics) {
          throw new Error('results.metrics is undefined');
        }
        metric_map.result = results;
        dispatch(actions.getChartDataSuccess({metric_name: activeMetrics.metric_name, option, metric_map}));
      });
  };
};

export const getUser = () => {
  return (dispatch, getState) => {
    dispatch(actions.getUserRequest());
    invokeApig({ path: api.user })
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


export const getCustomers = () => {
  return (dispatch, getState) => {
    invokeApig({
      path:        api.customers(),
      queryParams: {
        avgOrderValue:    true,
        reOrderFrequency: true
      }
    })
      .then((results) => {
        if (!results.customers) {
          throw new Error('results.customers is undefined');
        }
        dispatch(actions.getCustomersSuccess(results.customers));
      });
  };
};


export const getProducts = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.getProductsRequest());
      invokeApig({ path: api.products })
        .then((results) => {
          if (!results.products) {
            throw new Error('results.products is undefined');
          }
          dispatch(actions.getProductsSuccess(results));
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
      invokeApig({
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

export const getVariants = (products) => {
  return (dispatch, getState) => {
    dispatch(actions.getVariantsRequest());
    const variants = [];
    const getVariant = (i = 0) => {
      const next = i + 1;
      invokeApig({
        path:        api.getProductVariants(products[i].productId),
        queryParams: {
          cogs: true
        }
      }).then((results) => {
        if (!results.variants) {
          throw new Error('results.variants is undefined');
        }
        results.productId = products[i].productId;
        variants.push(results);
        if (products.length > next) {
          getVariant(next);
        } else {
          dispatch(actions.getVariantsSuccess(variants));
        }
      }).catch(error => {
        console.log('Error get variants', error);
      });
    };
    getVariant();
  };
};

export const updateVariants = (variantsInfo) => {
  return (dispatch, getState) => {
    const variants = [];
    const updateVariant = (i = 0) => {
      const next = i + 1;
      invokeApig({
        path:        api.getProductVariants(variantsInfo[i].productId),
        queryParams: {
          cogs:        true,
          lastUpdated: variantsInfo[i].lastUpdated
        }
      }).then((results) => {
        if (!results.variants) {
          throw new Error('results.variants is undefined');
        }
        results.productId = variantsInfo[i].productId;
        variants.push(results);
        if (variantsInfo.length > next) {
          updateVariant(next);
        } else {
          dispatch(actions.updateVariantsSuccess(variants));
        }
      }).catch(error => {
        console.log('Error update variants', error);
      });
    };
    updateVariant();
  };
};

export const getChannel = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(actions.getChannelRequest());
      invokeApig({ path: api.channel })
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

export const getCategories = ({activeMetrics, label, id, queryParams = {}}) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let path = '';
      if (label === categoryOptions.product) {
        path = api.metricsPathForProductByCategory(activeMetrics.metric_name, id);
      } else if (label === categoryOptions.variant) {
        path = api.metricsPathForVariantsByProduct(activeMetrics.metric_name, id);
      }
      invokeApig({ path, queryParams })
        .then((results) => {
          dispatch(actions.getCategoriesSuccess(results));
          resolve();
        })
        .catch(error => {
          console.log('get Categories error', error);
          dispatch(actions.getCategoriesError('get Categories error'));
        });
    });
  };
};

export const getCount = () => {
  return (dispatch, getState) => {
    dispatch(actions.getProductsCountRequest());
    return new Promise((resolve, reject) => {
      invokeApig({ path: api.getCount })
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
    invokeApig({ path: api.dataLoadStatus(shopId) })
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
