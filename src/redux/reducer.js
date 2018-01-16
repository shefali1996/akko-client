import { combineReducers } from 'redux';
import inventoryReducer from './inventory/reducer';
import dashboard from './dashboard/reducer';
import exploration from './dashboard/reducer_exploration';
import customers from './dashboard/customers';
import products from './dashboard/products';

export default combineReducers({
  // the keys here are going to be the property of state that we are producing.
  inventoryReducer,
  dashboard,
  exploration,
  customers,
  products
});
