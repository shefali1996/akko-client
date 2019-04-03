import { invokeApigWithErrorReport, invokeApigWithoutErrorReport } from '../../../libs/apiUtils';
import * as actions  from '../../actions';
import {addGoalURL,deleteGoalURL}  from '../../api';


export const addGoal = data => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
          dispatch(actions.addGoalRequest());
          invokeApigWithErrorReport({ method:'POST',path: addGoalURL(),context:'goal',body:data })
          .then((results) => {   
              dispatch(actions.addGoalSuccess(results));
              resolve(results);
            })
            .catch(error => {
              dispatch(actions.addGoalError('adding goal error'));
              reject(error);
            });
          });
      };
}



export const deleteGoal = goalId => {
  return (dispatch, getState) => {

      return new Promise((resolve, reject) => {
          dispatch(actions.deleteGoalRequest());
          invokeApigWithErrorReport({ path: deleteGoalURL(goalId),context:'goal',method:'DELETE' })
          .then((results) => {      
              dispatch(actions.deleteGoalSuccess({id:goalId}));
              resolve(results);
            })
            .catch(error => {
              dispatch(actions.deleteGoalError('deleting goal error'));
              reject(error);
            });
          });
    };
}

export const showModal = (data) =>{
  return (dispatch,getState) => {
    dispatch(actions.showEditGoalModal(data));
  }
}

export const hideModal = () =>{
  return (dispatch,getState) => {
    dispatch(actions.hideEditGoalModal());
  }
}
