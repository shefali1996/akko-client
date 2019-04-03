import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import cloneDeep from "lodash/cloneDeep"
import find from "lodash/find"
import findIndex from "lodash/findIndex"
import isEqual from "lodash/isEqual"


import * as constants from '../../redux/constants';

let i=0
const initialState = {
  metricsData: {
    data:      {},
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  },
  goalsData:{
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
  },
  dataLoadStatus: {
    data:      [],
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  },
  connectShopifyAlert: {
    data:      [],
    isLoading: false,
    isError:   false,
    isSuccess: false,
    message:   ''
  },
  metricsDataByName:{
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    data:{metricNameData:[]
    }  }
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

const getMetricsDataByNameSuccess = (state, action) => {
  i++
  const {results,queryParams}=action.payload
  const newData= cloneDeep(state.metricsDataByName.data)
  const metrics=state.metricsData.data.metrics  
  metrics.forEach((k)=>{
    newData.metricNameData[7] && newData.metricNameData[7].length?"":newData.metricNameData[7]=[]
    const index=findIndex(metrics,(o)=>{return o.db_name===k.db_name})
    if(results.metric_name){ 
      if((!Array.isArray(newData.metricNameData[index]) && typeof(newData.metricNameData[index])==="object") ){  
     if(isEqual(newData.metricNameData[index],results)){       
         return
     }
     else if(results.metric_name===k.db_name){             
      newData.metricNameData[index]=results
      }
    }
    else if(results.metric_name===k.db_name){      
      newData.metricNameData[index]=results
    }
    else if(index!==7){
      newData.metricNameData[index]=[]
    }
  }
  else{
    Array.isArray(results)?newData.metricNameData[7]=results:newData.metricNameData[index]=[]
  }
  })
  
  return update(state, {
  metricsDataByName: {
    data:      {$set: newData},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});
}
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
    message:   {$set: ''},
    aaaa:{$set:''}
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
const getDataLoadStatusSuccess = (state, action) => update(state, {
  dataLoadStatus: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
})
const getConnectShopifyAlertSuccess = (state, action) => update(state, {
  connectShopifyAlert: {
    data:      {$set: action.payload},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
})

const getActiveGoalsRequest = (state, action) => update(state, {
  goalsData: {
    isLoading: {$set: true},
    isError:   {$set: false},
    isSuccess: {$set: false},
    message:   {$set: ''}
  }
});
const getActiveGoalsSuccess = (state, action) =>{
  const {payload:data} = action;
  const list = data.length > 0 ? data.map((goal)=>{return goal.goalId}) : [];
  
  return update(state, {
  goalsData: {
    data:      {$set: list},
    isLoading: {$set: false},
    isError:   {$set: false},
    isSuccess: {$set: true},
    message:   {$set: ''}
  }
});}
const getActiveGoalsError = (state, action) => update(state, {
  goalsData: {
    isLoading: {$set: false},
    isSuccess: {$set: false},
    isError:   {$set: true},
    message:   {$set: action.payload}
  }
});

const archiveGoalSuccess = (state,action) =>{
  const {payload:{goalId}} = action;
  const {goalsData:{data=[]}} = state;
  const newData = data.filter((val)=>{
    if(val!==goalId){
      return true;
    }else return false;
  });
  return update(state, {
    goalsData: {
      data:      {$set: newData},
      isLoading: {$set: false},
      isError:   {$set: false},
      isSuccess: {$set: true},
      message:   {$set: ''}
    }
  });
}

const deleteGoalSuccess = (state,action) =>{
  if(state.goalsData.data){
    const newList = state.goalsData.data.filter((value)=>{
      if(value === action.payload.id){
          return false;
      }
      else return true;
  })
  return update(state, {
     goalsData:{ data: { $set: newList },
      isLoading: { $set: false },
      isError: { $set: false },
      isSuccess: { $set: true },
      message: { $set: "" }
    }});
  }else{
    return state;
  }
}

export default handleActions({
  [constants.GET_METRICS_REQUEST]:                getMetricsRequest,
  [constants.GET_METRICS_SUCCESS]:                getMetricsSuccess,
  [constants.GET_METRICS_DATA_BY_NAME_SUCCESS]:   getMetricsDataByNameSuccess,
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
  [constants.GET_LAST_UPDATED_TIMESTAMP_SUCCESS]: getLastUpdatedTimestampSuccess,
  [constants.GET_DATA_LOAD_STATUS_SUCCESS]:       getDataLoadStatusSuccess,
  [constants.GET_CONNECT_SHOPIFY_ALERT_SUCCESS]:  getConnectShopifyAlertSuccess,
  [constants.GET_ACTIVE_GOALS_DATA_REQUEST]:      getActiveGoalsRequest,
  [constants.GET_ACTIVE_GOALS_DATA_SUCCESS]:      getActiveGoalsSuccess,
  [constants.GET_ACTIVE_GOALS_DATA_ERROR]:        getActiveGoalsError,
  [constants.ARCHIVE_GOAL_SUCCESS]:               archiveGoalSuccess,
  [constants.DELETE_GOAL_SUCCESS]:                deleteGoalSuccess
}, initialState);
