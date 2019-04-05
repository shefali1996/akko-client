import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import { Row, Col,Grid} from 'react-bootstrap';
import swal from 'sweetalert2';
import $ from 'jquery';
import cloneDeep from "lodash/cloneDeep"
import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"
import Navigationbar from '../components/Navigationbar';
import ExploreMetrics from '../components/ExploreMetrics';
import Footer from '../components/Footer';
import * as dashboardActions from '../redux/dashboard/actions';
import {showModal, hideModal} from '../redux/page/addGoal/action';
import {ExpenseCard, InitialFetchIncompleteCard, InvalidCard, LoaderCards, ValidCards} from '../components/dashboard/index';
import {getColumn} from '../helpers/functions';
import {AddGoalCard,GoalCompletedCard,GoalFailedCard,GoalOnGoingCard,GoalLoading} from "../components/goals/card";
import GoalModal from './editGoalModal';
import {routeConstants,routeExplore} from '../constants'

//GOAL CARD TYPE
const ONGOING = "ONGOING";
const ACTIVE = "ACTIVE";
const FAILED = "FAILED";
const SUCCESS = "SUCCESS";



const moment = require('moment');
const elementResizeEvent = require('element-resize-event');

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metricsData:       [],
      activeMetricsId:   'none',
      userData:          {},
      userDataLoaded:    {},
      channelData:       {},
      channelDataLoaded: {},
      lastUpdated:       0,
      dataLoadStatus:    [],
      shopId:            '',
      explore:           false
    };
    this.setHeightWidth = this.setHeightWidth.bind(this);
    this.column = 4;
    this.top = 0;
  }

  componentWillMount() {
    if(isEmpty(this.props.metricsData.data) || isEmpty(this.props.userData.data)){
      this.refreshData();
      this.props.getUser();
      this.props.getChannel();
    }else{
      this.setState({
        metricsData:       this.props.metricsData.data.metrics || [],
        userData:          this.props.userData.data || {},
        userDataLoaded:    !this.props.userData.isLoading,
        channelData:       this.props.channelData.data || {},
        dataLoadStatus:    this.props.dataLoadStatus.data || [],
        channelDataLoaded: !this.props.channelData.isLoading,
      });
    }
  }
  componentDidUpdate(){
    if(this.state.explore && screen.width<768){
      swal({
        type:              'warning',
        html:              "This page works best on larger screens.Please try again from a device with a larger screen, like a laptop or tablet",
        allowOutsideClick: false,
        confirmButtonText: 'ok',
        focusConfirm:      false,
      });
      this.setState({
        explore:false
      })
    }
  }
  componentDidMount() {

    this.refreshGoal();
    const element = document.getElementById('cardSection');
    const goals = document.getElementById('goalCardSection');
    elementResizeEvent(element, () => {
      this.setHeightWidth(element.clientWidth);
    });

    elementResizeEvent(goals, () => {
      this.setHeightWidth(goals.clientWidth);
    });

    this.setHeightWidth(element.clientWidth);
    this.setHeightWidth(goals.clientWidth);
    this.props.getLuTimestamp()
  }

  componentWillReceiveProps(props) {
    this.props, props
    const element = document.getElementById('cardSection');
    document.title = `${this.state.userData.company == undefined ? "Akko" : `${this.state.userData.company} | Akko`} `;
    this.setState({
      metricsData:       props.metricsData.data.metrics || [],
      metricDataLoaded:  !props.metricsData.isLoading,
      userData:          props.userData.data || {},
      userDataLoaded:    !props.userData.isLoading,
      channelData:       props.channelData.data || {},
      dataLoadStatus:     props.dataLoadStatus.data || [],
      channelDataLoaded: !props.channelData.isLoading,
    });    
    if(props.channelData.data.shopId != undefined && this.state.shopId != props.channelData.data.shopId && props.dataLoadStatus.data.length == 0){
      this.setState({
        shopId:         props.channelData.data.shopId,
      })      
      this.props.getDataLoadStatus(props.channelData.data.shopId);
    }
  }
  
  refreshData() {
  
    this.props.getMetrics().then((res) => {
      const {metrics=[]} = res;
      metrics.map((k)=>{
        this.props.getMetricsDataByName(k.db_name).then((res)=>{
        })
      })
      this.props.getProducts().then((products) => {
      this.props.getVariants(products);
      });
    });
    this.refreshGoal();
  }
  

  handleGoalArchieve=(goalId)=>{
    const {archiveGoal,getActiveGoals,channelData:{data:{shopId=""}={}}={}} = this.props;
    archiveGoal(goalId).then(res=>{
      getActiveGoals();
    })
  }

  refreshGoal = ()=>{
    const {getActiveGoals} = this.props;
    getActiveGoals();
  }

  

  setHeightWidth(w) {    
    // ---------------set height------------    
      if (this.state.explore) {
        this.scrollTop(this.state.activeMetricsId);
      }
    }
  
  
  scrollTop = (id) => {
    const element = $(`#${id}`);
    $('html, body').animate({
      scrollTop: element.offset().top - 80
    }, 100);
  }
  
  setReceiveProps=(data)=>{
    this.setState({
      receiveProps:data
    })
  }
  arrayPush=()=>{
    const metricsData =this.props.metricsData.data.metrics
    const metricsDataByName=cloneDeep(this.props.metricsDataByName.data)
    const pushLength=(metricsData && metricsData.length)-(metricsDataByName && metricsDataByName.metricNameData.length)
    const metricsDataWithEmptyArray=metricsDataByName.metricNameData
    let i=0
     while(i<pushLength){
      metricsDataWithEmptyArray.push([])
        i++
     }
    return metricsDataWithEmptyArray     
  }
  render() {            
    const {metricsData, activeMetrics} = this.state;
    const {handleGoalArchieve} = this;
    const{message,originalMessage,metrics}=this.props.metricsData.data
    const {metricNameData}=this.props.metricsDataByName.data
    const metricsDataWithEmptyArray=metricNameData.length && this.arrayPush()
    const renderCards = [];
    const dashboardGridInfo = getColumn();
    const counter=metrics?metrics.length:4
    const dataLoaded = this.state.userDataLoaded && this.state.channelDataLoaded && this.state.metricDataLoaded;
    if ( !dataLoaded || this.state.dataLoadStatus.length == 0 ||!metricsDataWithEmptyArray) {    
      for (let i = 0; i <counter; i++) {
        renderCards.push(<LoaderCards key={i} width={dashboardGridInfo.colWidth} />);
      }
    } else if (dataLoaded &&message || dataLoaded && originalMessage ) {  
      for (let i = 0; i < dashboardGridInfo.numColumn; i++) {
        renderCards.push(<InitialFetchIncompleteCard key={i} propsData={this.props}  onClickFetchStatus={() => this.props.history.push('/fetch-status')} status={this.props.dataLoadStatus.data.completed == undefined ? null : this.props.dataLoadStatus.data.completed} width={dashboardGridInfo.colWidth} />);
      }
    } else {   
      metricsDataWithEmptyArray.map((value, index) => {      
        if(!value.length && Array.isArray(value)){      
          renderCards.push(<LoaderCards key={index*20} width={dashboardGridInfo.colWidth} />);
        }
        else{
          let active = '';
          const format = 'MMM YY';
          const label1 = moment().utc().format(format);
          const label2 = moment().utc().subtract(1, 'months').format(format);
          const label3 = moment().utc().subtract(2, 'months').format(format);
          const label4 = moment().utc().subtract(3, 'months').format(format);
          if (`card_${index}` === this.state.activeMetricsId) {
            active = 'active-metrics';
          }
          let invalid = false;
          if (value.value === -1 || value.value_one_month_back === -1 || value.value_two_months_back === -1 || value.value_three_months_back === -1) {
            invalid = true;
          }
          const data = [
            {label: label4, value: value.value_three_months_back, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
            {label: label3, value: value.value_two_months_back, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
            {label: label2, value: value.value_one_month_back, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
            {label: label1, value: value.value, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
          ];
          if (value.title === undefined || value.title === 'Expenses Breakdown') {
            const expensesData = {}
            value.forEach((k)=>{
              const me=k.metric_name
              expensesData[k.metric_name]=k.value
            })
            if (expensesData.total_sale === -1 || expensesData.total_cogs === -1 || expensesData.total_discount === -1 || expensesData.total_shipping === -1 || expensesData.total_tax === -1) {
              invalid = true;
              value.title = 'Expenses Breakdown';
            } 
            const expenseCard = invalid ?
            <InvalidCard key={index}  index={index} width={dashboardGridInfo.colWidth} value={value} userData={this.state.userData} onClickSetCogs={() => this.props.history.push('/set-cogs')} />
            : <ExpenseCard key={index} index={index} width={dashboardGridInfo.colWidth} value={expensesData} />;
            renderCards.push(expenseCard);
        } else {
          const validCards = invalid ? <InvalidCard key={index} index={index} width={dashboardGridInfo.colWidth} value={value} userData={this.state.userData} onClickSetCogs={() => this.props.history.push('/set-cogs')} />
          : isEmpty(value.availableContexts)  ?
                <ValidCards history = {this.props.history} key={index}  index={index} style={{cursor:'none'}} width={dashboardGridInfo.colWidth} value={value} active={active} data={cloneDeep(data)}  />
                :   <ValidCards history = {this.props.history} key={index} index={index} width={dashboardGridInfo.colWidth} value={value} active={active} openExploreMetric="openExploreMetric" data={cloneDeep(data)} />;
                renderCards.push(validCards);
              }
            }
          });
    }

    const goalCards = [];
    const {goalsData={},goals={},openAddGoal,metricsData:{data:{metrics:metricList=[]}={}}={}} = this.props;
    if(!goalsData.isLoading && goalsData.data){
        let metrics = {};
        metricList.forEach((value,index)=>{
          metrics[value.db_name] = value;
        })
        if(goalsData.data.length>0){
        goalsData.data.forEach((value,index)=>{
        
        const data = goals[value];
        switch(data.status){
          case ONGOING :
          case ACTIVE:
          goalCards.push(<GoalOnGoingCard key={index+data.goalId} metrics={metrics} data={data} openEditModal={openAddGoal}></GoalOnGoingCard>);
          break;
          case FAILED:
          goalCards.push(<GoalFailedCard key={index+data.goalId} metrics={metrics} data={data} onOkay={handleGoalArchieve}></GoalFailedCard>);
          break;
          case SUCCESS:
          goalCards.push(<GoalCompletedCard  key={index+data.goalId} data={data} metrics={metrics} onGotIt={handleGoalArchieve}></GoalCompletedCard>)
            break;
          default:
            console.log("invalid Goal status");
        }
      })}
      let i = 1;
      while(goalCards.length<4){
        goalCards.push(<AddGoalCard key={"addGoal"+i} openAddGoal = {()=>this.props.history.push(routeConstants.addGoals)}></AddGoalCard>)
        i++;
      }
    }else{
      let i = 1;
      while(goalCards.length<4){
        goalCards.push(<GoalLoading key={"loadingGoal"+i} openAddGoal = {this.props.openAddGoal}></GoalLoading>)
        i++;
       }
      }
    return (
      <div>
        <Grid className="page-container">
        {
          this.props.showGoalModal ?
          <GoalModal afterDelete={this.refreshGoal} afterAdd={this.refreshGoal}></GoalModal>
        :
          <Row className="analysis">
            <Col>
              <div className="left-box-100 margin-t-5">
              <div className="dashboard-section">GOALS</div>
              <Row id="goalCardSection" className="report-cards">
                {goalCards}
              </Row>
              <div className="dashboard-section">METRICS</div>
                <Row id="cardSection" className="report-cards">
                  {renderCards}
                </Row>
              </div>        
            </Col>
          </Row>
        }
        </Grid>
      </div>
    );
  }
}

const getActiveGoals = (data)=>{
  const {dashboard:{goalsData:{data:goalsData=[]}},goals} = data;
  let activeGoals = {};
  if(goalsData.length>0){
    for (const goal of goalsData) {
      activeGoals[goal] = goals[goal];
    }
  }
  return activeGoals;
}

const mapStateToProps = state => {
  return {
    metricsData:    state.dashboard.metricsData,
    chartData:      state.exploration.chartData,
    productData:    state.products.products,
    userData:       state.dashboard.userData,
    channelData:    state.dashboard.channelData,
    lastUpdated:    state.dashboard.lastUpdated,
    categoriesData: state.dashboard.categoriesData,
    goalsData:      state.dashboard.goalsData,
    goals:          getActiveGoals(state),
    dataLoadStatus: state.dashboard.dataLoadStatus,
    metricsDataByName:state.dashboard.metricsDataByName,
    showGoalModal:  state.addGoal.visible
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMetrics: () => {
      return dispatch(dashboardActions.getMetrics());
    },
    getChartData: (path, activeMetrics, metric_map, queryParams, shopId) => {
      return dispatch(dashboardActions.getChartData(path, activeMetrics, metric_map, queryParams, shopId));
    },
    emptyTimeFrameData: () => {
      return dispatch(dashboardActions.emptyTimeFrameData());
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
    getDataLoadStatus: (shopId) => {
      return dispatch(dashboardActions.getDataLoadStatus(shopId));
    },
    updateMetrics: (lastUpdated) => {
      return dispatch(dashboardActions.updateMetrics(lastUpdated));
    },
    getCategories: (params) => {
      return dispatch(dashboardActions.getCategories(params));
    },
    getVendors: (params) => {
      return dispatch(dashboardActions.getVendors(params));
    },
    getProductBySingleCategory: (params) => {
      return dispatch(dashboardActions.getProductBySingleCategory(params));
    },
    getTimeBySingleProduct: (params) => {
      return dispatch(dashboardActions.getTimeBySingleProduct(params));
    },
    getVariantBySingleProduct: (params) => {
      return dispatch(dashboardActions.getVariantBySingleProduct(params));
    },
    getTimeBySingleVariant: (params) => {
      return dispatch(dashboardActions.getTimeBySingleVariant(params));
    },
    updateProducts: (params) => {
      return dispatch(dashboardActions.updateProducts(params));
    },
    clearChartData: () => {
      return dispatch(dashboardActions.getClearChartData());
    },
    getLuTimestamp:()=>{
      return dispatch(dashboardActions.getLuTimestamp());
    },
    getMetricsDataByName:(metricsName)=>{
     return dispatch(dashboardActions.getMetricsDataByName(metricsName))
    },
    getActiveGoals: ()=>{
      return dispatch(dashboardActions.getActiveGoals())
    },
    openAddGoal: (data)=>{
      return dispatch(showModal(data));
    },
    archiveGoal :goalId => dispatch(dashboardActions.archiveGoal(goalId))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
