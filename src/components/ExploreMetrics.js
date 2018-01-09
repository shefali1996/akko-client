import React, { Component } from 'react';
import { Row, Col, Label, Button, Image, DropdownButton } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import { Select, DatePicker, Input, Spin } from 'antd';
import ReactPlaceholder from 'react-placeholder';
import Chart from '../components/Chart';
import FilterDialog from '../components/FilterDialog';
import styles from '../constants/styles';
import profileIcon from '../assets/images/profileIconWhite.svg';
import downArrowWhite from '../assets/images/downArrowWhite.svg';
import CustomRangePicker from '../components/CustomRangePicker';
import { invokeApig } from '../libs/awsLib';

const moment = require('moment');
const {Option} = Select;

const ascendingSortOrder = "asc", descendingSortOrder = "desc";
const WIDTH_PER_LABEL = "50"; // In pixels

const OPTION_TIME = "Time", OPTION_PRODUCT = "Product", OPTION_CUSTOMER = "Customer";

class ExploreMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
	  activeMetrics: null,
      filterBy: '',
      products: {},
      customers: {},
      open: false,
	  chartData: null,
	  graphError: false,
	  graphLoadingDone: true,
	  chartWidth: "100%",
    };
	this.currentOption = OPTION_TIME;
	this.currentSortOption = "1";
    this.openFilter = this.openFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.returnData = this.returnData.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
	this.onOptionChange = this.onOptionChange.bind(this);
	this.onSortOptionChange = this.onSortOptionChange.bind(this);

	this.timeMetricMap = {};
	this.productsMetricMap = {};
	this.customersMetricMap = {};
  }

  componentWillReceiveProps(nextProps) {
	  console.log("nextProps:", nextProps);
	  if (nextProps.activeMetrics && this.props.activeMetrics !== nextProps.activeMetrics) {
		this.setState({
			activeMetrics: nextProps.activeMetrics
		}, () => {
			console.log("Current state metrics:", this.state.activeMetrics);
			this.onOptionChange(this.currentOption);
		});
	  }
  }

  openFilter(filterBy) {
    this.setState({
      openFilter: true,
      filterBy
    });
  }
  closeFilter() {
    this.setState({
      openFilter: false,
      filterBy:   ''
    });
  }
  onRowSelect(filterData) {
    const {filterBy} = this.state;
    if (filterBy === 'product') {
      this.setState({products: filterData});
    } else if (filterBy === 'customer') {
      this.setState({customers: filterData});
    }
  }
  returnData() {
    const {filterBy, products, customers} = this.state;
    if (filterBy === 'product') {
      return products;
    } else if (filterBy === 'customer') {
      return customers;
    }

  }

  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }

  setMetric(map, path) {
	  var metric_name = this.state.activeMetrics.metric_name;
	  var metric_map = map[metric_name];
	  if (!metric_map) {
		    metric_map = {};
			var ms = moment().utc().startOf('day').valueOf();
			metric_map.end = moment(ms).add({days: 1}).valueOf();
			metric_map.start = moment(ms).subtract({years: 1}).valueOf();

			console.log("Timeslice:", moment(metric_map.start).utcOffset("+00:00").format(),
					moment(metric_map.end).utcOffset("+00:00").format());

			var queryParams = {
				timeslice_start: metric_map.start,
				timeslice_end: metric_map.end 
			}

			return invokeApig({ path: path, queryParams: queryParams}).then((results) => {
				console.log("API result:", results);
				if (!results.metrics) {
					throw new Error('results.metrics is undefined');
				}
				metric_map.result = results;
				map[metric_name] = metric_map;
			});
	  }
	  return Promise.resolve();
  }

  setTimeMetric() {
	  console.log("Inside setTimeMetric");
	  var metric_name = this.state.activeMetrics.metric_name;
	  // TODO: dynamic contextId
	  var path = '/metrics/' + metric_name + '/shop/akkotest';
	  console.log("Path:", path);
	  return this.setMetric(this.timeMetricMap, path);
  }
  
  setProductsMetric() {
	  console.log("Inside setProductsMetric");
	  var metric_name = this.state.activeMetrics.metric_name;
	  var path = '/metrics/' + metric_name + '/product';
	  return this.setMetric(this.productsMetricMap, path);
  }

  setCustomersMetric() {
	  console.log("Inside setCustomersMetric");
	  var metric_name = this.state.activeMetrics.metric_name;
	  var path = '/metrics/' + metric_name + '/customer';
	  return this.setMetric(this.customersMetricMap, path);
  }

  onSortOptionChange(option) {
	  console.log("Inside onSortOptionChange:", option);
	  this.currentSortOption = option;
	  this.onOptionChange(this.currentOption);
  }

  onOptionChange(option) {
	  this.setState({
		  graphLoadingDone: false,
		  graphError: false
	  });
	  console.log("Option change", option);
	  var sortOrder = ascendingSortOrder;
	  if (this.currentSortOption === "2") {
		  sortOrder = descendingSortOrder;
	  }
	  var metric_name = this.state.activeMetrics.metric_name;
	  if (option === OPTION_TIME) {
		  this.setTimeMetric().then(() => {
			  console.log("Success, finished api call");
			  var metric_map = this.timeMetricMap[metric_name];
			  var metrics = metric_map.result.metrics;
			  if (metrics.length === 0) {
				  throw new Error('No metrics to display')
			  }

			  var value = metrics[0];
			  var labels = [], values = [];

			  metrics.forEach((value) => {
				  const label = moment(value.timeslice_start).utcOffset("+00:00").format('MMM YY');
				  labels.push(label);
				  values.push(value.value);
			  });

			  console.log("labels:", labels);

			  const chartData = {
					labels: labels,
					datasets: [{
					  type: 'line',
					  label: value.title,
					  data: values,
					  backgroundColor: '#575dde',
					  fill: '1',
					  tension: 0,
					  prefix: value.prefix,
					  postfix: value.postfix
					}]
			  };

			  var width = labels.length * WIDTH_PER_LABEL;
			  var full_width = document.getElementById('chart-full-width-holder').offsetWidth;
			  if (width < full_width) {
				  width = '100%';
			  } else {
				  width = width + 'px';
			  }
			  console.log("Width: ", width, full_width);
			  this.setState({
				  chartWidth: width,
				  chartData: chartData,
				  graphLoadingDone: true
			  });

			  console.log("state chartData:", this.state.chartData);
		  }).catch((error) => {
			  this.setState({
				  graphError: true,
				  graphLoadingDone: true
			  });
		  });
	  } else if (option === OPTION_PRODUCT || option === OPTION_CUSTOMER) {
		  var setFunc = option === OPTION_PRODUCT ? this.setProductsMetric : this.setCustomersMetric;
		  var metricMap = option === OPTION_PRODUCT ? this.productsMetricMap : this.customersMetricMap;
		  setFunc = setFunc.bind(this);
		  setFunc().then(() => {
			  console.log("Success, finished api call");
			  var metric_map = metricMap[metric_name];
			  var metrics = metric_map.result.metrics;
			  if (metrics.length === 0) {
				  throw new Error('No metrics to display')
			  }
			  var value = metrics[0];
			  var data = [];

			  var index = 0;
			  metrics.forEach((value) => {
				  data.push({
					  label: '' + index,
					  value: value.value,
					  index: index
				  });
				  index++;
			  });

			  if (sortOrder) {
				  data.sort(function(a, b) {
					  if (sortOrder === ascendingSortOrder) {
						  if (a.value !== b.value) {
							  return a.value - b.value;
						  }
					  } else if (sortOrder === descendingSortOrder) {
						  if (a.value !== b.value) {
							  return b.value - a.value;
						  }
					  }
					  return a.index - b.index;
				  });
			  }

			  var labels = [], values = [];

			  data.forEach((dataItem) => {
				  labels.push(dataItem.label);
				  values.push(dataItem.value);
			  });

			  const chartData = {
					labels: labels,
					datasets: [{
					  type: 'bar',
					  label: value.title,
					  data: values,
					  backgroundColor: '#575dde',
					  fill: '1',
					  tension: 0,
					  prefix: value.prefix,
					  postfix: value.postfix
					}]
			  };

			  var width = labels.length * WIDTH_PER_LABEL;
			  var full_width = document.getElementById('chart-full-width-holder').offsetWidth;
			  if (width < full_width) {
				  width = '100%';
			  } else {
				  width = width + 'px';
			  }
			  console.log("Width: ", width, full_width);
			  this.setState({
				  chartWidth: width + 'px',
				  chartData: chartData,
				  graphLoadingDone: true
			  });

			  console.log("state chartData:", this.state.chartData);
		  }).catch((error) => {
			  this.setState({
				  graphError: true,
				  graphLoadingDone: true
			  });
		  });
	  }
	  this.currentOption = option;
  }

  render() {
    const {activeMetrics, activeChartData} = this.props;
	const CustomSpin = (
			<div style={{width:"100%", height: 300, textAlign: "center"}}>
				<Spin/>
			</div>
	);
	var fullHeight = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
	const chartHeight = fullHeight * 0.35 + 'px';
    return (
      <Row>
        <Col md={12}>
          <Card className={this.props.open ? 'charts-card-style margin-l-r-10' : ''}>
            <CardHeader
              textStyle={styles.chartHeader}
              title={<div>
                <span>{`Exploring ${activeMetrics && activeMetrics.title} metric`}</span>
                <span className="pull-right close-btn">
                  <Button className="close-button pull-right" onClick={this.props.closeFilter} />
                </span>
              </div>}
              titleStyle={styles.chartsHeaderTitle}
              subtitle={<div className="margin-t-60">
                <span className="pull-left" style={{ width: 200 }}>
                  <span className="dd-lable">Plot By:</span>
                  <span>
                    <Select defaultValue={OPTION_TIME} onChange={(value, label) => { this.onOptionChange(value); }}>
                      <Option value={OPTION_TIME}>{OPTION_TIME}</Option>
					  {
						  this.state.activeMetrics
						  ? this.state.activeMetrics.availableContexts.map((ctx) => {
							  const Ctx = ctx[0].toUpperCase() + ctx.substring(1).toLowerCase();
							  return <Option value={Ctx}>{Ctx}</Option>;
						  })
						  : ''
					  }
                    </Select>
                  </span>
                </span>
                <span className="pull-right" style={{ width: 200 }}>
                  <span className="dd-lable" />
                  <span className="explore-datepicker">
                    <CustomRangePicker />
                  </span>
                </span>
              </div>}
          />
            <CardText>
              <Row>
                <Col md={12} className="hide">
                  <Row>
                    <Col md={5} className="text-center padding-r-0">
                      <Card className="charts-card-style">
                        <CardText className="card-content text-center">
                          <div className="card-title">Filter By Product</div>
                          <div className="chip-wrapper">
                            <Chip className="chip" labelStyle={styles.chipLabelStyle}>Showing {this.state.products.rowsSelected ? this.state.products.rowsSelected : '0'} products</Chip>
                          </div>
                          <div className="link"><a onClick={() => this.openFilter('product')} >change filter</a></div>
                        </CardText>
                      </Card>
                    </Col>
                    <Col md={5} className="text-center padding-r-0">
                      <Card className="charts-card-style">
                        <CardText className="card-content text-center">
                          <div className="card-title">Filter By customers</div>
                          <div className="chip-wrapper">
                            <Chip className="chip" labelStyle={styles.chipLabelStyle}>Showing {this.state.customers.rowsSelected ? this.state.customers.rowsSelected : '0'} customers</Chip>
                          </div>
                          <div className="link"><a onClick={() => this.openFilter('customer')}>change filter</a></div>
                        </CardText>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col md={12} className="text-center">
                  <Card className="charts-card-style">
            <CardHeader
              textStyle={styles.chartHeader}
              title={<div>
                <span>{(() => {
					if (this.currentOption === OPTION_TIME) {
						return "Historical Trend";
					} else if (this.currentOption === OPTION_PRODUCT) {
						return this.state.activeMetrics.title + " by Products";
					} else if (this.currentOption === OPTION_CUSTOMER) {
						return this.state.activeMetrics.title + " by Customers";
					}
				})()}</span>
                <span className={this.currentOption === OPTION_TIME ? "display-none" : "pull-right close-btn"}>
                    <Select defaultValue="1" onChange={(value, label) => { this.onSortOptionChange(value); }}>
                      <Option value="1">Low to High</Option>
                      <Option value="2">High to Low</Option>
                    </Select>
                </span>
              </div>}
              titleStyle={styles.chartsHeaderTitle}
          />
                    <CardText>
					<div id="chart-full-width-holder" style={{width: "100%", height: "0px"}}></div>
					<ReactPlaceholder ready={this.state.graphLoadingDone} customPlaceholder={CustomSpin} className="loading-placeholder-rect-media">
					<div>
					{
						(this.state.graphError || !this.state.chartData)
						? <div className="chart-error">Oops! Something went wrong. We have made note of this issue and will fix this as soon as possible</div>
						: <div className="chart-wrapper">
							<div style={{width: this.state.chartWidth, height: chartHeight}}>
							<Chart data={this.state.chartData} type='bar' disableAspectRatio/>
							</div>
						  </div>
					}
					</div>
					</ReactPlaceholder>
                    </CardText>
                  </Card>
                </Col>
                <Col md={12} className="margin-t-60">
                  <FilterDialog
                    openFilter={this.state.openFilter}
                    closeFilter={this.closeFilter}
                    filterModal={this.state.filterBy}
                    onRowSelect={this.onRowSelect}
                    savedData={() => this.returnData()}
                  />
                </Col>
              </Row>
            </CardText>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default ExploreMetrics;
