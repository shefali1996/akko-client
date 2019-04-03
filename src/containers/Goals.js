import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import Goals from '../components/goals';
import {getAllGoals} from '../redux/page/goals/actions';
import {showModal} from '../redux/page/addGoal/action';
import * as dashboardActions from '../redux/dashboard/actions';


const mapStateToProps = state => {
    const {goalsPage,dashboard,goals,addGoal} = state; 
    return {
        goalList:goalsPage.data,
        userData: dashboard.userData.data,
        data:goals,
        metricsData:dashboard.metricsData,
        isLoading:goalsPage.isLoading,
        isSuccess:goalsPage.isSuccess,
        isError:goalsPage.isError,
        message:goalsPage.message,
        showGoalModal:  addGoal.visible
    };
  };

  const mapDispatchToProps = (dispatch) => {
   return {
    getMetrics: () => {
      return dispatch(dashboardActions.getMetrics());
    },
    getProducts: () => {
      return dispatch(dashboardActions.getProducts());
    },
    getVariants: (products) => {
      return dispatch(dashboardActions.getVariants(products));
    },
    getUser: () => {
      return dispatch(dashboardActions.getUser());
    },
    getChannel: () => {
      return dispatch(dashboardActions.getChannel());
    },
    getMetricsDataByName:(metricsName)=>{
     return dispatch(dashboardActions.getMetricsDataByName(metricsName))
    },
    getAllGoals: () => {
        return dispatch(getAllGoals());
      },
      openEditGoal: (data)=>{
        return dispatch(showModal(data));
      },
   }    
  };


  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Goals));

