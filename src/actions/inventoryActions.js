import {
	INVENTORY_GET_STARTED,
	INVENTORY_GET_SUCCESS,
	INVENTORY_GET_FAILURE
  } from './types';
  
  export const inventoryGetStarted = (dataset) => {
	return {
	  type: INVENTORY_GET_STARTED,
	  dataset
	};
  };
  
  export const inventoryGetSuccess = (res) => {
	return {
	  type: INVENTORY_GET_SUCCESS,
	  data: res
	};
  };
  
  export const inventoryGetFailure = (error) => {
	return {
	  type: INVENTORY_GET_FAILURE,
	  error: error
	};
  };
  
  export const inventoryGetRequest = (dataset, history) => {
	return (dispatch) => {
		console.log(dispatch)
	};
  };
  