import { handleActions } from "redux-actions";
import update from "immutability-helper";
import { cloneDeep, find, findIndex, isEqual } from "lodash";
import {
  GET_ALL_GOALS_DATA_SUCCESS,
  GET_ACTIVE_GOALS_DATA_ERROR,
  GET_ALL_GOALS_DATA_REQUEST,
  GET_ALL_GOALS_DATA_ERROR,
  DELETE_GOAL_SUCCESS
} from "../../constants";


const intialState = {
  data: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ""
};

const getAllGoalsRequest = (state, action) =>
  update(state, {
    isLoading: { $set: true },
    isError: { $set: false },
    isSuccess: { $set: false },
    message: { $set: "" }
  });

const getAllGoalsSuccess = (state, action) => {
  const { payload: data } = action;
  const list =
    data.length > 0
      ? data.map(goal => {
          return goal.goalId;
        })
      : [];
  return update(state, {
    data: { $set: list },
    isLoading: { $set: false },
    isError: { $set: false },
    isSuccess: { $set: true },
    message: { $set: "" }
  });
};

const getAllGoalsError = (state, action) =>
  update(state, {
    isLoading: { $set: false },
    isError: { $set: true },
    isSuccess: { $set: false },
    message: { $set: action.payload }
  });

const deleteGoalSuccess = (state,action) =>{
    const newList = state.data.filter((value)=>{
        if(value === action.payload.id){
            return false;
        }
        else return true;
    })
    return update(state, {
        data: { $set: newList },
        isLoading: { $set: false },
        isError: { $set: false },
        isSuccess: { $set: true },
        message: { $set: "" }
      });
}

export default handleActions(
  {
    [GET_ALL_GOALS_DATA_REQUEST]:   getAllGoalsRequest,
    [GET_ALL_GOALS_DATA_SUCCESS]:   getAllGoalsSuccess,
    [GET_ALL_GOALS_DATA_ERROR]:     getAllGoalsError,
    [DELETE_GOAL_SUCCESS]:          deleteGoalSuccess
  },
  intialState
);
