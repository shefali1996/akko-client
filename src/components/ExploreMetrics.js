import React, { Component } from 'react';
import { Row, Col, Label, ButtonGroup, Button, Image, DropdownButton } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import { Select, DatePicker, Input, Spin } from 'antd';
import ReactPlaceholder from 'react-placeholder';
import {isEmpty, isEqual, isUndefined} from 'lodash';
import FilterDialog from '../components/FilterDialog';
import styles from '../constants/styles';
import profileIcon from '../assets/images/profileIconWhite.svg';
import downArrowWhite from '../assets/images/downArrowWhite.svg';
import CustomRangePicker from '../components/CustomRangePicker';
import { invokeApig } from '../libs/awsLib';
import {plotByOptions, categoryOptions} from '../constants';
import {customerDetailOnHover, productDetailOnHover} from './CustomTable';
import BarChart from './BarChart';
import LineChart from './LineChart';
import productImgPlaceholder from '../assets/images/productImgPlaceholder.svg';

const moment = require('moment');

const {Option} = Select;

const ascendingSortOrder = 'asc';
const descendingSortOrder = 'desc';
const WIDTH_PER_LABEL = '50'; // In pixels
const RESOLUTION_DAY = 'day';

const OPTION_TIME = plotByOptions.time;
const OPTION_PRODUCT = plotByOptions.product;
const OPTION_CUSTOMER = plotByOptions.customer;
const OPTION_CATEGORIES = plotByOptions.categories;

const DAYS_35 = 35 * 86400000;

class ExploreMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter:             false,
      activeMetrics:          null,
      filterBy:               '',
      products:               {},
      customers:              {},
      open:                   false,
      chartData:              null,
      graphError:             false,
      graphLoadingDone:       true,
      chartWidth:             '100%',
      customRangeShouldClear: false,
      currentOption:          OPTION_TIME,
      defaultDataMap:         {},
      customTimeframeDataMap: {},
      customersData:          {},
      categoriesData:         {},
      categoriesNav:          {top: categoryOptions.categories, path: []},
      productData:            {}
    };

    this.currentOption = OPTION_TIME;
    this.currentSortOption = '2';
    this.customStartTime = '';
    this.customEndTime = '';

    this.openFilter = this.openFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.returnData = this.returnData.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
    this.onSortOptionChange = this.onSortOptionChange.bind(this);
    this.onTimeframeChange = this.onTimeframeChange.bind(this);
    this.getMap = this.getMap.bind(this);
    this.closeExploreMetrics = this.closeExploreMetrics.bind(this);
    this.afterCustomRangeClear = this.afterCustomRangeClear.bind(this);
    this.showDetailOnHover = this.showDetailOnHover.bind(this);
    this.hideDetail = this.hideDetail.bind(this);
    this.setCategoryMetrics = this.setCategoryMetrics.bind(this);
    this.onCategoryClick = this.onCategoryClick.bind(this);
  }

  getMap(metric, context) {
    let map = this.state.defaultDataMap;
    if (this.customStartTime !== ''
        && this.customEndTime !== '') {
      map = this.state.customTimeframeDataMap;
    }
    const key = `${metric}:${context}`;
    if (map.hasOwnProperty(key)) {
      return map[key];
    }
    return null;
  }
  componentWillReceiveProps(nextProps) {
    const state = _.cloneDeep(this.state);
    const {activeMetrics, defaultDataMap, customTimeframeDataMap, categoriesData, customersData, productData, open} = state;
    let {currentOption} = state;
    if (nextProps.open !== open) {
      this.setState({
        open: nextProps.open
      });
      if (nextProps.open) {
        const ms = moment().utc().startOf('day').valueOf();
        this.customEndTime = moment(ms).add({days: 1}).valueOf();
        this.customStartTime = moment(ms).subtract({years: 1}).valueOf();
      }
    }
    if(nextProps.customersData != undefined){
      if (!_.isEqual(nextProps.customersData.data, customersData)) {
        this.setState({
          customersData: nextProps.customersData.data
        });
      }
    }
    if (!_.isEqual(nextProps.productData.data, productData)) {
      this.setState({
        productData: nextProps.productData.data
      });
    }
    if (nextProps.activeMetrics && (nextProps.activeMetrics !== this.state.activeMetrics)) {
      if (_.indexOf(nextProps.activeMetrics.availableContexts, currentOption.toLowerCase()) === -1) {
        currentOption = OPTION_TIME;
      }
      this.setState({
        activeMetrics: nextProps.activeMetrics,
        currentOption
      }, () => {
        this.onOptionChange(currentOption);
      });
    }
    const d = nextProps.chartData.data;
    if (!isEqual(d.defaultDataMap, defaultDataMap) || !isEqual(d.customTimeframeDataMap, customTimeframeDataMap)
    || !isEqual(d.categoriesData, categoriesData)
    ) {
      this.setState({
        defaultDataMap:         d.defaultDataMap,
        customTimeframeDataMap: d.customTimeframeDataMap,
        categoriesData:         d.categoriesData
      }, () => {
        this.onOptionChange(currentOption);
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
      filterBy:   '',
    });
  }

  closeExploreMetrics() {
    if (this.customStartTime !== '') {
      this.setState({
        customRangeShouldClear: true,
        customTimeframeDataMap: {}
      });
      this.customStartTime = '';
      this.customEndTime = '';
    }
    this.props.closeFilter();
  }

  afterCustomRangeClear() {
    this.setState({
      customRangeShouldClear: false,
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

  setMetric(option) {
	  const metric_name = this.state.activeMetrics.metric_name;
	  let metric_map = this.getMap(metric_name, option);
	  if (!metric_map) {
		    metric_map = {};

      if (this.customStartTime !== '' && this.customEndTime !== '') {
        metric_map.start = this.customStartTime;
        metric_map.end = this.customEndTime;
        metric_map.timeFrame = true;
      } else {
        const ms = moment().utc().startOf('day').valueOf();
        this.customEndTime = metric_map.end = moment(ms).add({days: 1}).valueOf();
        this.customStartTime = metric_map.start = moment(ms).subtract({years: 1}).valueOf();
      }

      const queryParams = {
        timeslice_start: metric_map.start,
        timeslice_end:   metric_map.end
      };
      if (option === OPTION_TIME && metric_map.end - metric_map.start <= DAYS_35) {
        queryParams.resolution = RESOLUTION_DAY;
        metric_map.resolution = RESOLUTION_DAY;
      }
      this.props.getChartData(option, this.state.activeMetrics, metric_map, queryParams,
			  this.props.channelData.data.shopId);
	  }
  }

  setTimeMetric() {
	  const {metric_name} = this.state.activeMetrics;
    const metric_map = this.getMap(metric_name, OPTION_TIME);
    if (!metric_map) {
      this.setMetric(OPTION_TIME);
    } else {
      const metrics = metric_map.result.metrics;
      if (metrics.length === 0) {
        throw new Error('No metrics to display');
      }

      const value = metrics[0];
      const data = [];
      metrics.forEach((value) => {
        let format = 'MMM YY';
        if (metric_map.resolution === RESOLUTION_DAY) {
          format = 'MMM D';
        }
        const label = moment(value.timeslice_start).utcOffset('+00:00').format(format);
        data.push({
          label,
          value:   value.value,
          prefix:  value.prefix,
          postfix: value.postfix
        });
      });

      let width = data.length * WIDTH_PER_LABEL;
      const full_width = document.getElementById('chart-full-width-holder').offsetWidth;
      if (metric_map.resolution === RESOLUTION_DAY) {
        width = full_width / 31 * data.length;
      }
      if (width < full_width) {
        width = '100%';
      } else {
        width += 'px';
      }
      this.setState({
        chartWidth:       width,
        chartData:        data,
        graphLoadingDone: true
      });
    }
  }

  setCategoryMetrics() {
    const metric_name = this.state.activeMetrics.metric_name;
    const metric_map = this.getMap(metric_name, OPTION_CATEGORIES);
    if (!metric_map) {
      this.setMetric(OPTION_CATEGORIES);
    } else {
      let sortOrder = ascendingSortOrder;
      if (this.currentSortOption === '2') {
        sortOrder = descendingSortOrder;
      }
      let metrics = metric_map.result.metrics;
      if (this.state.categoriesNav.top === categoryOptions.product || this.state.categoriesNav.top === categoryOptions.variant) {
        metrics = this.state.categoriesData.metrics || [];
      }

      if (metrics.length === 0) {
        throw new Error('No metrics to display');
      }
      const data = [];

      let index = 0;
      const categoriesNavTop = this.state.categoriesNav.top;
      if (categoriesNavTop === categoryOptions.product) {
        const {productData} = this.state;
        metrics.forEach((value) => {
          const label = value.contextId.split('product_')[1];
          const productId = parseInt(label);
          let productInfo = _.find(productData.products, {productId});
          if (isNaN(productId)) {
            productInfo = _.find(productData.products, {productId: label});
          }
          let productImage = productInfo && productInfo.variants.length && productInfo.variants[0].variantImage;
          if (productImage === null || productImage === 'null' || isUndefined(productImage)) {
            productImage = productImgPlaceholder;
          }
          if (!productInfo.deleted || (productInfo.deleted && value.value !== 0)) {
            data.push({
              label,
              value:   value.value,
              image:   productImage,
              prefix:  value.prefix,
              postfix: value.postfix,
              index,
            });
            index++;
          }
        });
      } else {
        metrics.forEach((value) => {
          const label = value.contextId.split(':')[1];
          data.push({
            label,
            value:   value.value,
            prefix:  value.prefix,
            postfix: value.postfix,
            index,
          });
          index++;
        });
      }

      if (sortOrder) {
        data.sort((a, b) => {
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

      let width = data.length * WIDTH_PER_LABEL;
      const full_width = document.getElementById('chart-full-width-holder').offsetWidth;
      if (width < full_width) {
        width = '100%';
      } else {
        width += 'px';
      }
      this.setState({
        chartWidth:       `${width}px`,
        chartData:        data,
        graphLoadingDone: true
      });
    }
  }

  setCustomersMetric() {
    let sortOrder = ascendingSortOrder;
	  if (this.currentSortOption === '2') {
		  sortOrder = descendingSortOrder;
	  }
    const metric_name = this.state.activeMetrics.metric_name;
    const metric_map = this.getMap(metric_name, OPTION_CUSTOMER);
    if (!metric_map) {
      this.setMetric(OPTION_CUSTOMER);
    } else {
      const metrics = metric_map.result.metrics;
      if (metrics.length === 0) {
        throw new Error('No metrics to display');
      }
      const value = metrics[0];
      const data = [];

      let index = 0;
      const cust = _.cloneDeep(this.state.customersData);
      metrics.forEach((value) => {
        let label = value.contextId.split(':')[1];
        let email = label;
        const custInfo = _.find(cust, {email: label});
        if (!_.isEmpty(custInfo)) {
          label = custInfo.name;
          email = custInfo.email;
        }
        data.push({
          label,
          value:   value.value,
          prefix:  value.prefix,
          postfix: value.postfix,
          email,
          index
        });
        index++;
      });
      if (sortOrder) {
        data.sort((a, b) => {
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

      let width = data.length * WIDTH_PER_LABEL;
      const full_width = document.getElementById('chart-full-width-holder').offsetWidth;
      if (width < full_width) {
        width = '100%';
      } else {
        width += 'px';
      }
      this.setState({
        chartWidth:       `${width}px`,
        chartData:        data,
        graphLoadingDone: true
      });
    }
  }
  onCategoryClick(label, id) {
    const categoriesNav = this.state.categoriesNav;
    if (label === categoryOptions.product) {
      categoriesNav.top = categoryOptions.product;
      categoriesNav.path = [{label, id}];
    } else if (label === categoryOptions.variant) {
      categoriesNav.top = categoryOptions.variant;
      categoriesNav.path[1] = {label, id};
    }
    this.setState({
      categoriesNav,
      graphLoadingDone: false
    });
    const queryParams = {
      timeslice_start: this.customStartTime,
      timeslice_end:   this.customEndTime
    };
    if (isEmpty(this.customStartTime) || isEmpty(this.customEndTime)) {
      const ms = moment().utc().startOf('day').valueOf();
      this.customEndTime = queryParams.timeslice_end = moment(ms).add({days: 1}).valueOf();
      this.customStartTime = queryParams.timeslice_start = moment(ms).subtract({years: 1}).valueOf();
    }

    this.props.getCategories({activeMetrics: this.state.activeMetrics, label, id, queryParams}).then(() => {
      this.setState({
        graphLoadingDone: true
      }, () => {
        this.onOptionChange(this.state.currentOption);
      });
    });
  }
  onTimeframeChange(newStartTime, newEndTime) {
    this.customStartTime = newStartTime.valueOf();
    this.customEndTime = newEndTime.valueOf();
    if (!isEmpty(this.state.customTimeframeDataMap)) {
      this.props.emptyTimeFrameData();
    } else {
      this.onOptionChange(this.state.currentOption);
    }
  }

  onSortOptionChange(option) {
    this.currentSortOption = option;
    this.onOptionChange(this.state.currentOption);
  }

  onOptionChange(option) {
    this.setState({
      currentOption:    option,
      graphLoadingDone: false,
      graphError:       false
    });
    if (option === OPTION_TIME) {
      this.setTimeMetric();
    } else if (option === OPTION_CATEGORIES) {
      this.setCategoryMetrics();
    } else if (option === OPTION_CUSTOMER) {
      this.setCustomersMetric();
    }
  }
  showDetailOnHover(label) {
    const {customersData, productData, currentOption} = _.cloneDeep(this.state);
    const loading = <div className="text-center padding-t-10"> <Spin /></div>;
    let tooltipDetailView = false;
    if (currentOption === OPTION_CUSTOMER) {
      const custInfo = _.find(customersData, {name: label});
      if (custInfo) {
        tooltipDetailView = customerDetailOnHover(custInfo);
      } else {
        tooltipDetailView = loading;
      }
    } else if (currentOption === OPTION_CATEGORIES && this.state.categoriesNav.top === categoryOptions.product) {
      const productId = parseInt(label);
      let productInfo = _.find(productData.products, {productId});
      if (isNaN(productId)) {
        productInfo = _.find(productData.products, {productId: label});
      }
      if (productInfo) {
        tooltipDetailView = productDetailOnHover(productInfo);
      } else {
        tooltipDetailView = loading;
      }
    }
    this.setState({
      tooltipDetail: tooltipDetailView
    });
  }
  hideDetail() {
    if (!_.isEmpty(this.state.tooltipDetail)) {
      this.setState({
        tooltipDetail: ''
      });
    }
  }
  onCategory=() => {
    this.setState({
      categoriesNav: {top: categoryOptions.categories, path: []}
    }, () => { this.onOptionChange(OPTION_CATEGORIES); });
  }
  render() {
    const {activeMetrics, activeChartData} = this.props;
    const {categoriesNav, currentOption} = this.state;
    const CustomSpin = (
      <div style={{width: '100%', height: 300, textAlign: 'center'}}>
        <Spin />
      </div>
    );
    const fullHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const chartHeight = `${fullHeight * 0.35}px`;
    let chartTitle = '';
    if (this.state.currentOption === OPTION_TIME) {
      chartTitle = 'Historical Trend';
    } else if (this.state.currentOption === OPTION_CATEGORIES) {
      chartTitle = `${this.state.activeMetrics.title} by ${categoriesNav.top}`;
    } else {
      chartTitle = `${this.state.activeMetrics.title} by ${currentOption}`;
    }
    return (
      <Row>
        <Col md={12}>
          <Card className={this.props.open ? 'charts-card-style margin-l-r-10' : ''}>
            <CardHeader
              textStyle={styles.chartHeader}
              title={<div>
                <span>{`Exploring ${activeMetrics && activeMetrics.title} metric`}</span>
                <span className="pull-right close-btn">
                  <Button className="close-button pull-right" onClick={this.closeExploreMetrics} />
                </span>
              </div>}
              titleStyle={styles.chartsHeaderTitle}
              subtitle={<div className="margin-t-60">
                <span className="pull-left" style={{ width: 350 }}>
                  <span className="dd-lable">Plot By:</span>
                  <span>
                    <ButtonGroup>
                      <Button className={this.state.currentOption === OPTION_TIME ? 'active' : ''} onClick={() => this.onOptionChange(OPTION_TIME)}>{OPTION_TIME}</Button>
                      <Button
                        className={this.state.currentOption === OPTION_CATEGORIES ? 'active' : ''}
                        onClick={this.onCategory}>{OPTION_CATEGORIES}
                      </Button>
                      {
                         this.state.activeMetrics
                                     ? this.state.activeMetrics.availableContexts.map((ctx, i) => {
                                     const Ctx = ctx[0].toUpperCase() + ctx.substring(1).toLowerCase();
                                     return <Button key={i} className={this.state.currentOption === Ctx ? 'active' : ''} onClick={() => this.onOptionChange(Ctx)} disabled={Ctx === OPTION_PRODUCT}>{Ctx}</Button>;
                                     })
                                     : ''
                                     }
                    </ButtonGroup>
                  </span>
                </span>
                <span className="pull-right" style={{ width: 200 }}>
                  <span className="dd-lable" />
                  <span>
                    <CustomRangePicker
                      onTimeframeChange={this.onTimeframeChange}
                      customRangeShouldClear={this.state.customRangeShouldClear}
                      afterCustomRangeClear={this.afterCustomRangeClear}
                      defaultRange={{start: this.customStartTime, end: this.customEndTime}}
                      />
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
                      title={<Row>
                        <Col md={4}>
                          <span className="pull-left">
                            {chartTitle}
                          </span>
                        </Col>
                        <Col md={5}>
                          <div className="tooltip-details-show">
                            {this.state.tooltipDetail}
                          </div>
                        </Col>
                        <Col md={3}>
                          <span className={this.state.currentOption === OPTION_TIME ? 'display-none' : 'pull-right close-btn'}>
                            <Select defaultValue={this.currentSortOption} onChange={(value, label) => { this.onSortOptionChange(value); }}>
                              <Option value="1">Low to High</Option>
                              <Option value="2">High to Low</Option>
                            </Select>
                          </span>
                        </Col>
                        {currentOption === OPTION_CATEGORIES && categoriesNav.path.length ? <Col md={12} className="category-link-container">
                          <span className="link cursor-pointer" onClick={this.onCategory}> Category </span>
                          {categoriesNav.path[0] ? <span className={`link ${categoriesNav.path.length > 1 ? 'cursor-pointer' : ''}`} onClick={() => { categoriesNav.path.length > 1 ? this.onCategoryClick(categoriesNav.path[0].label, categoriesNav.path[0].id) : ''; }}> &nbsp;&nbsp;&gt;&nbsp; Products </span> : ''}
                          {categoriesNav.path[1] ? <span className="link"> &nbsp;&nbsp;&gt;&nbsp; Variants </span> : ''}
                        </Col> : null}
                      </Row>}
                      titleStyle={styles.chartsHeaderTitle}
                      />
                    <CardText>
                      <div id="chart-full-width-holder" style={{width: '100%', height: '0px'}} />
                      {
                        <ReactPlaceholder ready={this.state.graphLoadingDone} customPlaceholder={CustomSpin} className="loading-placeholder-rect-media">
                          <div>
                            {
                            (this.state.graphError || !this.state.chartData)
                            ? <div className="chart-error">Oops! Something went wrong. We have made note of this issue and will fix this as soon as possible</div>
                            : <div className="chart-wrapper">
                              <div style={{width: this.state.chartWidth, height: chartHeight}}>
                                {
                                  this.state.currentOption === OPTION_CUSTOMER || this.state.currentOption === OPTION_CATEGORIES ?
                                    <BarChart
                                      data={this.state.chartData}
                                      fullHeight={fullHeight}
                                      selectedOption={this.state.currentOption}
                                      showDetailOnHover={this.showDetailOnHover}
                                      hideDetail={this.hideDetail}
                                      chartName={this.state.currentOption}
                                      productsByCategory={this.onCategoryClick}
                                      categoriesNav={this.state.categoriesNav}
                                      /> :
                                    <LineChart data={this.state.chartData} fullHeight={fullHeight} selectedOption={this.state.currentOption} chartName="timeChart" />
                                }
                              </div>
                            </div>
                            }
                          </div>
                        </ReactPlaceholder>
                    }
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
