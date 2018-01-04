import { combineReducers } from 'redux';
import inventoryReducer from './inventory/reducer';
import dashboard from './dashboard/reducer';

export default combineReducers({
  // the keys here are going to be the property of state that we are producing.
  inventoryReducer,
  dashboard
});
