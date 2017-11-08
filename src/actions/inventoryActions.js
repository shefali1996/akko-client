import {
	INVENTORY_GET_STARTED,
	INVENTORY_GET_SUCCESS,
	INVENTORY_GET_FAILURE
} from './types';
import { invokeApig } from '../libs/awsLib';
// import {convertInventoryJSONToObject} from '../constants';

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
		invokeApig({ path: "/inventory" }).then((results) => {
            //todo: inventory should defined to redux store
            // dispatch(inventoryGetSuccess(results));
            
        })
        .catch(error => {
            console.log("get inventory error", error);
        });;
	};
};
  