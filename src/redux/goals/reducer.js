import {handleActions} from 'redux-actions';
import update from 'immutability-helper';
import {GET_ALL_GOALS_DATA_SUCCESS,GET_ACTIVE_GOALS_DATA_SUCCESS,DELETE_GOAL_SUCCESS} from '../constants';
import {omit} from 'lodash';

const intialState = {
}

const getAllGoals = (state, action) => {
    const data = action.payload;
    let newData = {}
    if(data.length>0){
        for (const goal of data) {
            const goalId = goal.goalId;
            newData[goalId] = goal;
        }
        return Object.assign(state,newData);
    }
    else{
        return state;
    }   
}

const deleteGoalSuccess = (state,action)=>{
    const new_data = omit(state,action.payload.id);
    return new_data;
}

const getActiveGoalsSuccess = (state,action) =>{
    const data = action.payload;
    let newData = {}
    if(data.length>0){
        for (const goal of data) {
            const goalId = goal.goalId;
            newData[goalId] = goal;
        }
        return Object.assign(state,newData);
    }
    else{
        return state;
    }   
}


export default handleActions({
    [GET_ALL_GOALS_DATA_SUCCESS]:       getAllGoals,
    [GET_ACTIVE_GOALS_DATA_SUCCESS]:    getActiveGoalsSuccess,
    [DELETE_GOAL_SUCCESS]:              deleteGoalSuccess,
},intialState);