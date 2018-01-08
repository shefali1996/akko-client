import React, { Component } from 'react';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Select, Spin } from 'antd';
import $ from 'jquery';
import Navigationbar from '../components/Navigationbar';
import Chart from '../components/Chart';
import PriceBox from '../components/PriceBox';
import ExploreMetrics from '../components/ExploreMetrics';
import Footer from '../components/Footer';
import { invokeApig } from '../libs/awsLib';
import styles from '../constants/styles';
import invalidImg from '../assets/images/FontAwesome472.svg';
import ReactPlaceholder from 'react-placeholder';

const moment = require('moment');

const elementResizeEvent = require('element-resize-event');

const {Option} = Select;

class NewDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metricsData: [],
	  metricDataLoaded: false,
      width: '25%',
      activeMetricsId: 'none',
      activeChartData: false
    };
    this.setWidth = this.setWidth.bind(this);
    this.handleClickMetrics = this.handleClickMetrics.bind(this);
    this.getMetrics = this.getMetrics.bind(this);
    this.column = 4;
    this.top = 0;
  }

  componentWillMount() {
    this.getMetrics();
  }
  componentDidMount() {
    const element = document.getElementById('cardSection');
    elementResizeEvent(element, () => {
      this.setWidth(element.clientWidth);
    });
  }
  getMetrics() {
    invokeApig({ path: '/metrics' }).then((results) => {
      this.setState({
        metricsData: results.metrics,
        metricDataLoaded: true,
      });
    })
      .catch(error => {
        console.log('get metrics error', error);
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
      explore: true,
      activeMetrics: value,
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
          <div className="invalid-text">Please set COGS for your products to calculate these values.</div>
          <div className="flex-center padding-t-20">
            <Button className="login-button" onClick={() => this.props.history.push('/set-cogs')}>
                SET COGS
            </Button>
          </div>
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
        subtitle={value.trend_period}
        subtitleStyle={styles.expenseCardSubtitle}
        />
      <CardText style={styles.expenseCardText}>
        <Row>
          <Col md={12} className="expense-text">
            <Row className="padding-t-5">
              <Col md={7}>Total Sales</Col>
              <Col md={5}><span className="dash" />${expensesData.total_sales}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>COGS</Col>
              <Col md={5}><span className="dash">-</span>${expensesData.total_cogs}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>Discounts</Col>
              <Col md={5}><span className="dash">-</span>${expensesData.total_discount}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>Shipping</Col>
              <Col md={5}><span className="dash">-</span>${expensesData.total_shipping}</Col>
            </Row>
            <Row className="padding-t-5">
              <Col md={7}>Tax</Col>
              <Col md={5}><span className="dash">-</span>${expensesData.total_tax}</Col>
            </Row>
            <hr />
            <Row className="final-row">
              <Col md={7}>Gross Profit</Col>
              <Col md={5}><span className="dash" />${expensesData.total_sales - expensesData.total_cogs - expensesData.total_discount - expensesData.total_shipping - expensesData.total_tax}</Col>
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
    if (!this.state.metricDataLoaded) {
      // Add dummy loading cards
      const number_of_dummy_cards = 3;
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
                <ReactPlaceholder ready={this.state.metricDataLoaded} customPlaceholder={CustomSpin} />
              </div>
            </CardText>
          </Card>
        </Col>);
      }
    }
    metricsData.map((value, index) => {
      let active = '';
      let borderRed = '';
      const label1 = moment().format('MMM YY');
      const label2 = moment().subtract(1, 'months').format('MMM YY');
      const label3 = moment().subtract(2, 'months').format('MMM YY');
      const label4 = moment().subtract(3, 'months').format('MMM YY');
      if (`card_${index}` === this.state.activeMetricsId) {
        active = 'active-metrics';
      }
      if (value.trend === '-') {
        borderRed = 'border-red';
      }
      let invalid = false;
      if (value.value === 'invalid' || value.value_one_month_back === 'invalid' || value.value_two_months_back === 'invalid' || value.value_three_months_back === 'invalid') {
        invalid = true;
      }
      const chartData = {
        labels: [label4, label3, label2, label1],
        datasets: [{
          type: 'line',
          label: value.title,
          data: [
            `${value.value_three_months_back}`,
            `${value.value_two_months_back}`,
            `${value.value_one_month_back}`,
            `${value.value}`,
          ],
          borderColor: '#575dde',
          backgroundColor: '#575dde',
          fill: '1',
          tension: 0,
          prefix: value.prefix,
          postfix: value.postfix
        }]
      };
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
            className={`price-card-style ${active} ${borderRed}`}
            onClick={(e) => this.handleClickMetrics(`card_${index}`, value, chartData)}
            style={styles.metricsCardStyle}
            >
            <CardHeader className="card-header-style" >
              <PriceBox value={value} analyze />
            </CardHeader>
            <CardText>
              <div>
                <Chart data={chartData} type="line" width="40%" />
              </div>
            </CardText>
          </Card>}
        </Col>);
      }
    });
    return (
      <div>
        <Navigationbar history={this.props.history} companyName="Test Company" />
        <Grid className="page-container">
          <Row className="analysis">
            <Col>
              <div className={this.state.explore ? 'left-box-50 padding-r-7' : 'left-box-100 margin-t-5'}>
                {!this.state.explore ? <Row>
                  <Col md={12} className="padding-left-right-7">
                    <span className={this.state.explore ? 'pull-right margin-r-23' : 'pull-right'}>
                      <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                        <Option value="1">This month to date</Option>
                        <Option value="2">This year to date</Option>
                      </Select>
                    </span>
                  </Col>
                </Row> : null}
                <Row id="cardSection" className={this.state.explore ? 'report-cards scroll-section' : 'report-cards'}>
                  {renderCards}
                </Row>
              </div>
              <div className={this.state.explore ? 'right-box-50' : 'right-box-0'}>
                <ExploreMetrics
                  closeFilter={() => {
                    this.setState({
                      explore: false,
                      activeChartData: false,
                      activeMetricsId: 'none',
                    });
                  }}
                  activeMetrics={this.state.activeMetrics}
                  activeChartData={this.state.activeChartData}
                  filterModal="product"
                  open={this.state.explore} />
              </div>
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default NewDashboard;