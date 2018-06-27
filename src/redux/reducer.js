import { combineReducers } from 'redux';
import dashboard from './dashboard/reducer';
import exploration from './dashboard/reducer_exploration';
import products from './dashboard/products';

export default combineReducers({
  // the keys here are going to be the property of state that we are producing.
  dashboard,
  exploration,
  products
});
