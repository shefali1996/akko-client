import { combineReducers } from 'redux';
import { inventory } from './inventory/reducer';

export default combineReducers({
  // the keys here are going to be the property of state that we are producing.
  inventory
});
