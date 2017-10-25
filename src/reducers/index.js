import { combineReducers } from 'redux';
import inventory from './inventoryReducer'
const reducer = combineReducers({
    inventory
});

export default reducer;