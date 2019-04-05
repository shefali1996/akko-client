import { handleActions } from "redux-actions";
import update from "immutability-helper";
import * as constants from "../../constants";

const intialState = {
  type:"",
  visible: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ""
};

const showModal = (state, action) =>{
  return update(state, {
    type:       {$set: action.payload.type},
    id:         {$set: action.payload.id},
    visible:    { $set: true },
    isLoading:  { $set: false },
    isError:    { $set: false },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });
}
  

const hideModal = (state,action) => 
  update(state, {
    type:       {$set:""},
    visible:    { $set: false },
    isLoading:  { $set: false },
    isError:    { $set: false },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });


  const addGoalRequest = (state,action) => 
  update(state, {
    visible:    { $set: true },
    isLoading:  { $set: true },
    isError:    { $set: false },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });


  const addGoalSuccess = (state,action) => 
  update(state, {
    visible:    { $set: false },
    isLoading:  { $set: false },
    isError:    { $set: false },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });


  const addGoalError = (state,action) => 
  update(state, {
    visible:    { $set: true },
    isLoading:  { $set: false },
    isError:    { $set: true },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });



  const deleteGoalRequest = (state,action) => 
  update(state, {
    visible:    { $set: true },
    isLoading:  { $set: true },
    isError:    { $set: false },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });


  const deleteGoalSuccess = (state,action) => 
  update(state, {
    visible:    { $set: false },
    isLoading:  { $set: false },
    isError:    { $set: false },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });


  const deleteGoalError = (state,action) => 
  update(state, {
    visible:    { $set: true },
    isLoading:  { $set: false },
    isError:    { $set: true },
    isSuccess:  { $set: false },
    message:    { $set: "" }
  });



export default handleActions({
  [constants.SHOW_EDIT_GOAL_MODAL]: showModal,
  [constants.HIDE_EDIT_GOAL_MODAL]: hideModal,
  [constants.ADD_GOAL_REQUEST]:     addGoalRequest,
  [constants.ADD_GOAL_SUCCESS]:     addGoalSuccess,
  [constants.ADD_GOAL_ERROR]:       addGoalError,
  [constants.DELETE_GOAL_REQUEST]:  deleteGoalRequest,
  [constants.DELETE_GOAL_SUCCESS]:  deleteGoalSuccess,
  [constants.DELETE_GOAL_ERROR]:    deleteGoalError,  
}, intialState);
