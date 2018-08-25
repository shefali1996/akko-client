import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import $ from 'jquery';
import _ from 'lodash';
import Navigationbar from '../components/Navigationbar';
import ExploreMetrics from '../components/ExploreMetrics';
import Footer from '../components/Footer';
import styles from '../constants/styles';
import invalidImg from '../assets/images/FontAwesome472.svg';
import * as dashboardActions from '../redux/dashboard/actions';
import {METRICS_CARD, dashboardGrid} from '../constants/index';
import {ExpenseCard, InitialFetchIncompleteCard, InvalidCard, LoaderCards, ValidCards} from '../components/dashboard/index';
import {getColumn} from '../helpers/functions';
import { stat } from 'fs';

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
    this.handleClickMetrics = this.handleClickMetrics.bind(this);
    this.column = 4;
    this.top = 0;
  }

  componentWillMount() {
    if(_.isEmpty(this.props.metricsData.data) || _.isEmpty(this.props.userData.data)){
      this.props.getUser();
      this.props.getChannel();
      this.refreshData();
    } else{
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
  
  componentDidMount() {
    const element = document.getElementById('cardSection');
    elementResizeEvent(element, () => {
      this.setHeightWidth(element.clientWidth);
    });
    this.setHeightWidth(element.clientWidth);
    this.props.getLuTimestamp()
  }

  componentWillReceiveProps(props) {
    this.props, props
    const element = document.getElementById('cardSection');
    this.setHeightWidth(element.clientWidth);
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
    this.props.getMetrics().then(() => {
      this.props.getProducts().then((products) => {
      this.props.getVariants(products);
      });
    });
  }
  
  setHeightWidth(w) {
    // ---------------set height------------
    const elements = document.getElementsByClassName('dashboard-card-container');    
    const elementHeights = Array.prototype.map.call(elements, (el) => {
      return el.clientHeight;
    });     
    let maxHeight = Math.max.apply(null, elementHeights);
    if( screen.height > 800 && maxHeight < 408 && screen.width >1700){
      maxHeight = 408;
    }
    // if( screen.height < 800 ){
    //   maxHeight = 378;
    // }
    // if(screen.width === 1280 ){
    //   maxHeight=345;
    // }
    if (maxHeight !== this.maxHeight) {
      $('.dashboard-card-container').css({height: `${maxHeight}px`});
    }
    // -----------------set width--------------------
    const x = 100;
    let n = Math.floor(w / 320);
    const r = w % 320;
    let a = 0;
    n = n > 4 ? 4 : n;
    if (n !== this.column) {
      this.column = n;
      a = x / n;
      $('.dashboard-card-container').css({width: `${a}%`, transition: 'width .05s lenear'});
      if (this.state.explore) {
        this.scrollTop(this.state.activeMetricsId);
      }
    }
  }
  
  scrollTop = (id) => {
    const element = $(`#${id}`);
    $('html, body').animate({
      scrollTop: element.offset().top - 80
    }, 100);
  }
  
  handleClickMetrics(id, value) {
    this.scrollTop(id);
    this.setState({
      explore:         true,
      activeMetrics:   value,
      activeMetricsId: id,
    });
  }
  render() {          
    const {metricsData, activeMetrics} = this.state;
    const{message,originalMessage}=this.props.metricsData.data
    const renderCards = [];
    const dashboardGridInfo = getColumn();
    const dataLoaded = this.state.userDataLoaded && this.state.channelDataLoaded && this.state.metricDataLoaded;
    if ( !dataLoaded || this.state.dataLoadStatus.length == 0 ) {  
      for (let i = 0; i < dashboardGridInfo.numColumn; i++) {
        renderCards.push(<LoaderCards key={i} width={dashboardGridInfo.colWidth} />);
      }
    } else if (dataLoaded &&message || dataLoaded && originalMessage ) {  
      for (let i = 0; i < dashboardGridInfo.numColumn; i++) {
        renderCards.push(<InitialFetchIncompleteCard key={i} propsData={this.props} height={this.state.maxHeight} onClickFetchStatus={() => this.props.history.push('/fetch-status')} status={this.props.dataLoadStatus.data.completed == undefined ? null : this.props.dataLoadStatus.data.completed} width={dashboardGridInfo.colWidth} />);
      }
    } else {    
      metricsData.map((value, index) => {
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
        if (value.title === 'Expenses' || value.title === 'Expenses Breakdown') {
          const expensesData = value.value;
          if (expensesData.total_sale === -1 || expensesData.total_cogs === -1 || expensesData.total_discount === -1 || expensesData.total_shipping === -1 || expensesData.total_tax === -1) {
            invalid = true;
            value.title = 'Expenses Breakdown';
          }
          const expenseCard = invalid ?
            <InvalidCard key={index} height={this.state.maxHeight} index={index} width={dashboardGridInfo.colWidth} value={value} userData={this.state.userData} onClickSetCogs={() => this.props.history.push('/set-cogs')} />
            : <ExpenseCard key={index} index={index} width={dashboardGridInfo.colWidth} value={value} maxHeight={this.state.maxHeight}/>;
          renderCards.push(expenseCard);
        } else {
          const validCards = invalid ? <InvalidCard height={this.state.maxHeight}key={index} index={index} width={dashboardGridInfo.colWidth} value={value} userData={this.state.userData} onClickSetCogs={() => this.props.history.push('/set-cogs')} />
            : _.isEmpty(value.availableContexts)  ?
                <ValidCards key={index} height={this.state.maxHeight} index={index} style={{cursor:'none'}} width={dashboardGridInfo.colWidth} value={value} active={active} data={_.cloneDeep(data)}  />
            :   <ValidCards key={index} height={this.state.maxHeight} index={index} width={dashboardGridInfo.colWidth} value={value} active={active} openExploreMetric="openExploreMetric" data={_.cloneDeep(data)} handleClickMetrics={this.handleClickMetrics} />;
          renderCards.push(validCards);
        }
      });
    }
    return (
      <div>
        <Navigationbar history={this.props.history} companyName={this.state.userData.company} />
        <Grid className="page-container">
          <Row className="analysis">
            <Col>
              <div className="left-box-100 margin-t-5">
                <Row id="cardSection" className="report-cards">
                  {renderCards}
                </Row>
              </div>
              <div className="right-box-0">
                <ExploreMetrics
                  closeFilter={() => {
                    this.setState({
                      explore:         false,
                      activeMetricsId: 'none',
                    });
                  }}
                  clearChartData={this.props.clearChartData}
                  activeMetrics={this.state.activeMetrics}
                  channelData={this.state.channelData}
                  open={this.state.explore}
                  getVendors={this.props.chartData.data.getVendors}
                  getProductBySingleCategory={this.props.chartData.data.getProductBySingleCategory}
                  getTimeBySingleProduct={this.props.chartData.data.getTimeBySingleProduct}
                  getVariantBySingleProduct={this.props.chartData.data.getVariantBySingleProduct}
                  getTimeBySingleVariant={this.props.chartData.data.getTimeBySingleVariant}
                  getCategories={this.props.chartData.data.getCategories}
                  categoriesData={this.state.categoriesData}
                  {...this.props}
                  />
              </div>
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
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
    dataLoadStatus: state.dashboard.dataLoadStatus
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
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
