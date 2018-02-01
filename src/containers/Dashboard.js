import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import ReactPlaceholder from 'react-placeholder';
import { Select, Spin } from 'antd';
import $ from 'jquery';
import {isUndefined} from 'lodash';
import Navigationbar from '../components/Navigationbar';
import Chart from '../components/Chart';
import PriceBox from '../components/PriceBox';
import ExploreMetrics from '../components/ExploreMetrics';
import Footer from '../components/Footer';
import { invokeApig } from '../libs/awsLib';
import styles from '../constants/styles';
import invalidImg from '../assets/images/FontAwesome472.svg';
import * as dashboardActions from '../redux/dashboard/actions';
import { pollingInterval } from '../constants';
import LineChart from '../components/LineChart';

const moment = require('moment');
const elementResizeEvent = require('element-resize-event');

const {Option} = Select;
const METRICS_CARD = 'metrics_card';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metricsData:       [],
      width:             '25%',
      metricDataLoaded:  false,
      activeMetricsId:   'none',
      activeChartData:   false,
	  userData:          {},
	  userDataLoaded:    {},
	  channelData:       {},
	  channelDataLoaded: {},
      // explore:           true
    };
    this.setWidth = this.setWidth.bind(this);
    this.handleClickMetrics = this.handleClickMetrics.bind(this);
    this.column = 4;
    this.top = 0;
  }

  componentWillMount() {
    this.props.getMetrics().then(() => {
      this.props.getUser();
      this.props.getChannel();
      this.props.getCustomers();
      this.props.getProducts().then((products) => {
        this.props.getVariants(products);
      });
    });
  }

  componentDidMount() {
    const element = document.getElementById('cardSection');
    elementResizeEvent(element, () => {
      this.setWidth(element.clientWidth);
    });
    this.loadInterval = setInterval(() => {
      if (!isUndefined(this.props.metricsData.data.lastUpdated)) {
        this.props.updateMetrics(this.props.metricsData.data.lastUpdated);
      }
    }, pollingInterval);
  }
  componentWillUnmount() {
    clearInterval(this.loadInterval);
  }
  componentWillReceiveProps(props) {
    this.setState({
      metricsData:       props.metricsData.data.metrics || [],
      metricDataLoaded:  !props.metricsData.isLoading,
      userData:          props.userData.data || {},
      userDataLoaded:    !props.userData.isLoading,
      channelData:       props.channelData.data || {},
      channelDataLoaded: !props.channelData.isLoading,
    });
  }
  setWidth(w) {
    const x = 100;
    let n = Math.floor(w / 320);
    const r = w % 320;
    let a = 0;
    n = n > 4 ? 4 : n;
    if (n !== this.column) {
      this.column = n;
      a = x / n;
      this.setState({
        width: `${a}%`,
      });
      if (this.state.explore) {
        const {activeMetricsId, activeMetrics, activeChartData} = this.state;
        this.handleClickMetrics(activeMetricsId, activeMetrics, activeChartData);
      }
    }
  }
  handleClickMetrics(id, value, chartData) {
    const element = $(`#${id}`);
    $('html, body').animate({
      scrollTop: element.offset().top - 80
    }, 100);
    this.setState({
      explore:         true,
      activeMetrics:   value,
      activeMetricsId: id,
      activeChartData: chartData
    });
  }
  invalidCard(value) {
    return (<Card className="charts-card-style" style={styles.metricsCardStyle}>
      <CardHeader
        title={value.title}
        titleStyle={styles.chartsHeaderTitle}
        subtitleStyle={styles.expenseCardSubtitle}
        />
      <CardText style={styles.expenseCardText}>
        <div className="invalid-block text-center">
          <span className="image-container"><img src={invalidImg} alt="invalid" /></span>
          <div className="invalid-text">
            {this.state.userData.cogsStatus == 1
              ? <div><div>We've successfully set COGS for all your products.</div>
                <div>Now, hang on for a few moments while we update all your metrics.</div>
              </div>
            : 'Please set COGS for your products to calculate these values.'
          }
          </div>
          {this.state.userData.cogsStatus == 1
          ? '' :
          <div className="flex-center padding-t-20">
            <Button className="login-button" onClick={() => this.props.history.push('/set-cogs')}>
                SET COGS
            </Button>
          </div>
		  }
        </div>
      </CardText>
    </Card>
    );
  }

  initialFetchIncompleteCard() {
    return (<Card className="charts-card-style" style={styles.metricsCardStyle}>
      <CardHeader
        titleStyle={styles.chartsHeaderTitle}
        subtitleStyle={styles.expenseCardSubtitle}
        />
      <CardText style={styles.expenseCardText}>
        <div className="invalid-block text-center">
          <span className="image-container"><img src={invalidImg} alt="invalid" /></span>
          <div className="invalid-text">Hang on. We are importing your data and calculating all your metrics.</div>
        </div>
      </CardText>
    </Card>
    );
  }

  expenseCard(expensesData) {
    return (<Card className="charts-card-style" style={styles.metricsCardStyle}>
      <CardHeader
        title="Expenses Breakdown"
        titleStyle={styles.chartsHeaderTitle}
        />
      <CardText style={styles.expenseCardText}>
        <Row>
          <Col md={12} className="expense-text">
            <Row className="padding-t-5">
              <Col md={7}>Total Sales</Col>
              <Col md={5} className="text-right">${expensesData.total_sales.toFixed(2)}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>COGS</Col>
              <Col md={5} className="text-right">${expensesData.total_cogs.toFixed(2)}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>Discounts</Col>
              <Col md={5} className="text-right">${expensesData.total_discount.toFixed(2)}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>Shipping</Col>
              <Col md={5} className="text-right">${expensesData.total_shipping.toFixed(2)}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>Tax</Col>
              <Col md={5} className="text-right">${expensesData.total_tax.toFixed(2)}</Col>
            </Row>
            <hr />
            <Row className="final-row">
              <Col md={7}>Gross Profit</Col>
              <Col md={5} className="text-right"><span className="dash" />${expensesData.gross_profit.toFixed(2)}</Col>
            </Row>
          </Col>
        </Row>
      </CardText>
            </Card>
    );
  }
  render() {
    const {metricsData} = this.state;
    const renderCards = [];
    const number_of_dummy_cards = 3;
    const dataLoaded = this.state.metricDataLoaded && this.state.userDataLoaded
    && this.state.channelDataLoaded;
    // if (dataLoaded && this.state.channelData.initial_fetch_status !== 'success') {
    //   for (let i = 0; i < number_of_dummy_cards; i++) {
    //     renderCards.push(<Col style={{width: this.state.width}} className="dashboard-card-container">
    //       {this.initialFetchIncompleteCard()}
    //                      </Col>);
    //   }
    // } else {
    if (!dataLoaded) {
      // Add dummy loading cards
      const CustomSpin = (
        <div style={{width: '100%', textAlign: 'center'}}>
          <Spin size="large" />
        </div>
      );
      for (let i = 0; i < number_of_dummy_cards; i++) {
        renderCards.push(<Col style={{width: this.state.width}} className="dashboard-card-container">
          <Card
            className="price-card-style"
            style={styles.metricsCardStyle}
            >
            <CardText>
              <div style={{padding: '40%'}}>
                {CustomSpin}
              </div>
            </CardText>
          </Card>
        </Col>);
      }
    } else {
      metricsData.map((value, index) => {
  		  let active = '';
  		  const label1 = moment().format('MMM YY');
  		  const label2 = moment().subtract(1, 'months').format('MMM YY');
  		  const label3 = moment().subtract(2, 'months').format('MMM YY');
  		  const label4 = moment().subtract(3, 'months').format('MMM YY');
  		  if (`card_${index}` === this.state.activeMetricsId) {
          active = 'active-metrics';
  		  }
  		  let invalid = false;
  		  if (value.value === 'invalid' || value.value_one_month_back === 'invalid' || value.value_two_months_back === 'invalid' || value.value_three_months_back === 'invalid') {
          invalid = true;
  		  }
  		  const chartData = {
          labels:   [label4, label3, label2, label1],
          datasets: [{
  			  type:  'line',
  			  label: value.title,
  			  data:  [
              `${value.value_three_months_back}`,
              `${value.value_two_months_back}`,
              `${value.value_one_month_back}`,
              `${value.value}`,
  			  ],
  			  borderColor:     '#575dde',
  			  backgroundColor: '#575dde',
  			  fill:            '1',
  			  tension:         0,
  			  prefix:          value.prefix,
  			  postfix:         value.postfix
          }]
  		  };
        const data = [
          {label: label4, value: value.value_three_months_back, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
          {label: label3, value: value.value_two_months_back, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
          {label: label2, value: value.value_one_month_back, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
          {label: label1, value: value.value, prefix: value.prefix, postfix: value.postfix, chartName: value.metric_name },
        ];
  		  if (value.title === 'Expenses' || value.title === 'Expenses Breakdown') {
          const expensesData = value.value;
          if (expensesData.total_sale === 'invalid' || expensesData.total_cogs === 'invalid' || expensesData.total_discount === 'invalid' || expensesData.total_shipping === 'invalid' || expensesData.total_tax === 'invalid') {
  			  invalid = true;
  			  value.title = 'Expenses Breakdown';
          }
          renderCards.push(<Col key={index} id={`card_${index}`} style={{width: this.state.width}} className="dashboard-card-container expenses-breakdown">
            {invalid ? this.invalidCard(value) : this.expenseCard(expensesData)}

                           </Col>);
  		  } else {
          renderCards.push(<Col key={index} id={`card_${index}`} style={{width: this.state.width}} className="dashboard-card-container" title={!invalid ? `Click to explore ${value.title} in detail` : null}>
            {invalid ? this.invalidCard(value) : <Card
              className={`price-card-style ${active}`}
              onClick={(e) => this.handleClickMetrics(`card_${index}`, value, chartData)}
              style={styles.metricsCardStyle}
  				>
              <CardHeader className="card-header-style" >
                <PriceBox value={value} analyze />
              </CardHeader>
              <CardText style={{padding: '0px'}}>
                <div>
                  {
                    <LineChart data={data} selectedOption={METRICS_CARD} chartName={value.metric_name} />
                    // <Chart data={chartData} type="line" width="40%" />
                  }
                </div>
              </CardText>
            </Card>}
          </Col>);
  		  }
      });
    }
    // }
    return (
      <div>
        <Navigationbar history={this.props.history} companyName={this.state.userData.company} />
        <Grid className="page-container">
          <Row className="analysis">
            <Col>
              <div className={this.state.explore ? 'left-box-50 padding-r-7' : 'left-box-100 margin-t-5'}>
                <Row id="cardSection" className={this.state.explore ? 'report-cards scroll-section' : 'report-cards'}>
                  {renderCards}
                </Row>
              </div>
              <div className={this.state.explore ? 'right-box-50' : 'right-box-0'}>
                <ExploreMetrics
                  closeFilter={() => {
                    this.setState({
                      explore:         false,
                      activeChartData: false,
                      activeMetricsId: 'none',
                    });
                  }}
                  activeMetrics={this.state.activeMetrics}
                  activeChartData={this.state.activeChartData}
                  channelData={this.state.channelData}
                  open={this.state.explore}
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
    metricsData:   state.dashboard.metricsData,
    chartData:     state.exploration.chartData,
    customersData: state.customers.customers,
    productData:   state.products.products,
  	userData:      state.dashboard.userData,
  	channelData:   state.dashboard.channelData,
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
    getCustomers: () => {
      return dispatch(dashboardActions.getCustomers());
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
    updateMetrics: (lastUpdated) => {
      return dispatch(dashboardActions.updateMetrics(lastUpdated));
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
