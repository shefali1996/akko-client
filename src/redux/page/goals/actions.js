import { invokeApigWithErrorReport, invokeApigWithoutErrorReport } from '../../../libs/apiUtils';
import {getAllGoalsRequest,getAllGoalsSuccess,getAllGoalsError}  from '../../actions';
import {allGoals}  from '../../api';


export const getAllGoals = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
          dispatch(getAllGoalsRequest());
          invokeApigWithErrorReport({ path: allGoals(),context:'goal' })
          .then((results) => {  
              dispatch(getAllGoalsSuccess(results));
              resolve(results);
            })
            .catch(error => {
              dispatch(getAllGoalsError('get goals error'));
              reject(error);
            });
          });
      };
}

