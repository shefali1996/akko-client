import React, { Component } from 'react';
import { Row, Col, Label, ButtonGroup, Button, Image, DropdownButton } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import { Select, DatePicker, Input, Spin } from 'antd';
import ReactPlaceholder from 'react-placeholder';
import {isEmpty, isEqual, isUndefined, chunk} from 'lodash';
import FilterDialog from '../components/FilterDialog';
import styles from '../constants/styles';
import profileIcon from '../assets/images/profileIconWhite.svg';
import downArrowWhite from '../assets/images/downArrowWhite.svg';
import CustomRangePicker from '../components/CustomRangePicker';
import { invokeApig } from '../libs/awsLib';
import {plotByOptions, categoryOptions, vendorOptions} from '../constants';
import {customerDetailOnHover, productDetailOnHover} from './CustomTable';
import BarChart from './BarChart';
import LineChart from './LineChart';
import productImgPlaceholder from '../assets/images/productImgPlaceholder.svg';

const moment = require('moment');
const {Option} = Select;
const ascendingSortOrder = 'asc';
const descendingSortOrder = 'desc';
const WIDTH_PER_LABEL = '50';
const RESOLUTION_DAY = 'day';
const OPTION_TIME = plotByOptions.time;
const OPTION_CATEGORIES = plotByOptions.categories;
const OPTION_VENDOR = plotByOptions.vendors;
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
      currentSubOption:       'time',
      currentOption:          OPTION_TIME,
      defaultDataMap:         {},
      customTimeframeDataMap: {},
      customersData:          {},
      categoryLabel:          '',
      categoryId:             '',
      metrics:                [],
      productId:               '',
      vendorsId:              '',
      vendorsLabel:           '',
      categoriesData:         {},
      categoriesNav:          {top: categoryOptions.categories, path: []},
      vendorsNav:             {top: vendorOptions.vendors, path: []},
      noData:                 false,
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
    this.onSubOptionChange = this.onSubOptionChange.bind(this);
    this.onSortOptionChange = this.onSortOptionChange.bind(this);
    this.onTimeframeChange = this.onTimeframeChange.bind(this);
    this.getMap = this.getMap.bind(this);
    this.closeExploreMetrics = this.closeExploreMetrics.bind(this);
    this.afterCustomRangeClear = this.afterCustomRangeClear.bind(this);
    this.showDetailOnHover = this.showDetailOnHover.bind(this);
    this.hideDetail = this.hideDetail.bind(this);
    this.setCategoryMetrics = this.setCategoryMetrics.bind(this);
    this.onCategoryClick = this.onCategoryClick.bind(this);
    this.onVendorClick = this.onVendorClick.bind(this);
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
    this.setState({
      metrics: nextProps.metricsData.data.metrics
    })
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
        graphLoadingDone:       true,
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
      openFilter:             false,
      filterBy:               '',
      currentOption:          OPTION_TIME,
      defaultDataMap:         {},
      customTimeframeDataMap: {},
      customersData:          {},
      categoryLabel:          '',
      chartData:              null,
      categoryId:             '',
      productId:               '',
      categoriesData:         {},
      categoriesNav:          {top: categoryOptions.categories, path: []},
      vendorsNav:             {top: vendorOptions.vendors, path: []},
    });
  }

  closeExploreMetrics() {
    if (this.customStartTime !== '') {
      this.clearStates();
      this.customStartTime = '';
      this.customEndTime = '';
    }
    this.clearStates();
    this.props.clearChartData();
    this.props.closeFilter();
  }
  
  clearStates(){
    this.setState({
      customRangeShouldClear: true,
      currentOption:          OPTION_TIME,
      defaultDataMap:         {},
      customTimeframeDataMap: {},
      customersData:          {},
      categoryLabel:          '',
      chartData:              null,
      categoryId:             '',
      productId:               '',
      categoriesData:         {},
      categoriesNav:          {top: categoryOptions.categories, path: []},
      vendorsNav:             {top: vendorOptions.vendors, path: []},
      customTimeframeDataMap: {}
    })
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
      const { categoriesNav, vendorsNav, currentSubOption } = this.state
      if(categoriesNav.path.length != 0  && option === OPTION_CATEGORIES){
        if(categoriesNav.path.length == 1 && this.state.currentSubOption == 'time'){
          this.props.getCategories({activeMetrics: this.state.activeMetrics, label: this.state.categoryLabel, id: this.state.categoryId, queryParams, option, metric_map}).then(() => {
            this.setState({
              graphLoadingDone: true
            }, () => {
              this.onOptionChange(this.state.currentOption);
            });
          });
        } else if(categoriesNav.path.length == 1 && this.state.currentSubOption == 'product'){
          this.props.getProductBySingleCategory({activeMetrics: this.state.activeMetrics, label: this.state.categoryLabel, id: this.state.categoryId, queryParams, option, metric_map}).then(() => {
            this.setState({
              graphLoadingDone: true
            }, () => {
              this.onOptionChange(this.state.currentOption);
            });
          });
        } else if(categoriesNav.path.length == 2 && this.state.currentSubOption == 'variant'){
          this.props.getVariantBySingleProduct({activeMetrics: this.state.activeMetrics, label: this.state.categoryLabel, id: this.state.categoryId, queryParams, option, metric_map}).then(() => {
            this.setState({
              graphLoadingDone: true
            }, () => {
              this.onOptionChange(this.state.currentOption);
            });
          });
        } else if(categoriesNav.path.length == 2 && this.state.currentSubOption == 'time' && categoriesNav.top == 'Variant'){
          this.props.getCategories({activeMetrics: this.state.activeMetrics, label: this.state.categoryLabel, id: this.state.categoryId, queryParams, option, metric_map}).then(() => {
            this.setState({
              graphLoadingDone: true
            }, () => {
              this.onOptionChange(this.state.currentOption);
            });
          });
        } else{   
          this.props.getTimeBySingleVariant({activeMetrics: this.state.activeMetrics, label: this.state.categoryLabel, productId: this.state.productId, id: this.state.categoryId, queryParams, option, metric_map}).then(() => {
            this.setState({
              graphLoadingDone: true
            }, () => {
              this.onOptionChange(this.state.currentOption);
            });
          });
        }
      } else if(vendorsNav.path.length != 0 && option === OPTION_VENDOR){
        this.props.getVendors({activeMetrics: this.state.activeMetrics, label: this.state.vendorsLabel, id: this.state.vendorsId, queryParams, option, metric_map}).then(() => {
          this.setState({
            graphLoadingDone: true,
          }, () => {
            this.onOptionChange(this.state.currentOption);
          });
        });  
      } else{
        this.props.getChartData(option, this.state.activeMetrics, metric_map, queryParams,
          this.props.channelData.data.shopId);
      }
	  }
  }

  setTimeMetric() {
	  const {metric_name} = this.state.activeMetrics;
    const metric_map = this.getMap(metric_name, OPTION_TIME);
    if (!metric_map) {
      this.setMetric(OPTION_TIME);
    } else {
      const metrics = metric_map.result;
      if(metrics === undefined){
        this.setState({
          noData:           false,
          graphError:       true,
          chartData:        null,
          graphLoadingDone: true
        })
      }
      if (metrics.length === 0) {
        this.setState({
          noData:           true,
          graphError:       true,
          chartData:        null,
          graphLoadingDone: true
        });
        throw new Error('No metrics to display');
      }

      const value = metrics[0];
      const data = [];
      metrics.forEach((value) => {
        let format = 'MMM YY';
        const label = moment(value.time_start).utcOffset('+00:00').format(format);
        let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
        let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
        data.push({
          label,
          value:   value.value,
          prefix,
          postfix
        });
      });

      let width = data.length * WIDTH_PER_LABEL;
      const full_width = document.getElementById('chart-full-width-holder') != null ? document.getElementById('chart-full-width-holder').offsetWidth : 904;
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
      let metrics = metric_map.result;
      if(metrics === undefined){
        this.setState({
          noData:           false,
          graphError:       true,
          chartData:        null,
          graphLoadingDone: true
        })
      }
      if (metrics.length === 0) {
        this.setState({
          noData:           true,
          graphError:       true,
          chartData:        null,
          graphLoadingDone: true
        });
        throw new Error('No metrics to display');
      }
      const data = [];
      let index = 0;      
      const categoriesNavTop = this.state.categoriesNav.top;
      if (categoriesNavTop === categoryOptions.product || categoriesNavTop === categoryOptions.variant || categoriesNavTop === categoryOptions.time && (this.state.currentSubOption == 'time' || this.state.currentSubOption == 'product' || this.state.currentSubOption == 'variant')) { 
        metrics.forEach((value) => {          
          let format = 'MMM YY';
          if(this.state.currentSubOption == 'time'){
            const label = moment(value.time_start).utcOffset('+00:00').format(format);
            let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
            let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
            data.push({
              label,
              value:   value.value,
              prefix,
              postfix,
              index,
            });
          } else if(this.state.currentSubOption == 'variant'){
            const label = value.variantTitle
            let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
            let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
            data.push({
              label,
              value:         value.value,
              prefix,
              postfix,
              index,
              categoryBarId: value.variantId
              
            });
          } else if(this.state.categoriesNav.top == categoryOptions.time){            
            const label =  moment(value.time_start).utcOffset('+00:00').format(format);
            let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
            let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
            data.push({
              label,
              value:   value.value,
              prefix,
              postfix,
              index,
            });
          } else {
            this.setState({productId: value.productId})
            const label = value.productTitle
            const variantArr = _.find(this.state.productData.products, function(o) { return o.productId == value.productId; });
            const image = variantArr && variantArr.variants[0].imageUrl || productImgPlaceholder    
            
            let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
            let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
            data.push({ 
                label,
                image,
                value:   value.value,
                prefix,
                postfix,
                index,
                categoryBarId:value.productId   

              });
            }
              index++;
            });
          } else if(this.state.activeMetrics.metric_name == 'avg_margin' || this.state.activeMetrics.metric_name == 'number_of_orders'){
            metrics.forEach((value) => {
              let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
              let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
              data.push({
                label:   value.productType,
                value:   value.value,
                prefix,
                postfix,
                index,
              });
              index++;
            });
          } else{
            metrics.forEach((value) => {
              const label = value.contextId.split(':')[1];
              let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
              let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
              data.push({
                label,
                value:   value.value,
                prefix,
                postfix,
                index,
                categoryBarId:value.categoryId
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
      const full_width = document.getElementById('chart-full-width-holder') != null ? document.getElementById('chart-full-width-holder').offsetWidth : 904;
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
    const metric_map = this.getMap(metric_name, OPTION_VENDOR);
    if (!metric_map) {
      this.setMetric(OPTION_VENDOR);
    } else {
      let metrics = metric_map.result;
      if(metrics === undefined){
        this.setState({
          noData:           false,
          graphError:       true,
          chartData:        null,
          graphLoadingDone: true
        })
      }
      if (metrics.length === 0) {
        this.setState({
          noData:           true,
          graphError:       true,
          chartData:        null,
          graphLoadingDone: true
        });
        throw new Error('No metrics to display');
      }
      const value = metrics[0];
      const data = [];
      
      let index = 0;
      const vendorsNavTop = this.state.vendorsNav.top;
      if (vendorsNavTop === vendorOptions.time) {
        this.setState({
          currentOption: OPTION_VENDOR
        });
        metrics.forEach((value) => {
          let format = 'MMM YY';
          const label = moment(value.time_start).utcOffset('+00:00').format(format);
          let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
          let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
          data.push({
            label,
            value:   value.value,
            prefix,
            postfix,
            index,
          });
            index++;
          });
        } else if(this.state.activeMetrics.metric_name == 'avg_margin' || this.state.activeMetrics.metric_name == 'number_of_orders' || this.state.activeMetrics.metric_name == 'gross_profit' ) {
          metrics.forEach((value) => {
            let email = value.vendor;
            let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
            let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
            data.push({
              label:   value.vendor,
              value:   value.value,
              prefix,
              postfix,
              email,
              index
            });
            index++;
          });
        } else {
          
          metrics.forEach((value) => {
          let label = value.contextId.split('_')[1];
          let email = label;
          let prefix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).prefix;
          let postfix = (_.find(this.state.metrics, function(o) {return o.metric_name == metric_name})).postfix;
          data.push({
            label,
            value:   value.value,
            prefix,
            postfix,
            email,
            index,
            vendorId:value.vendorId
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
      const full_width = document.getElementById('chart-full-width-holder') != null ? document.getElementById('chart-full-width-holder').offsetWidth : 904;
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
  onVendorClick(label, id,vendorGraphLabel){    
    this.setState({
      vendorsId:    id,
      vendorsLabel: label,
      vendorGraphLabel:vendorGraphLabel
    })
    const vendorsNav = this.state.vendorsNav;
    let metric_map = this.getMap(this.state.activeMetrics.metric_name, this.state.currentOption);
    if (label === vendorOptions.time) {
      vendorsNav.top = vendorOptions.time;
      vendorsNav.path = [{label, id}];
    }
    this.setState({
      vendorsNav,
      graphLoadingDone: false,
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
    const option = this.state.currentOption;
    this.props.getVendors({activeMetrics: this.state.activeMetrics, label, id, queryParams, option, metric_map}).then(() => {
      this.setState({
        graphLoadingDone: true,
      }, () => {
        this.onOptionChange(this.state.currentOption);
      });
    });
  }
  onCategoryClick(label, id,graphLabel) {    
    this.setState({
      currentSubOption: 'time',
      categoryLabel: label,
      categoryId:    id,
      graphLabel:graphLabel
    })
    const categoriesNav = this.state.categoriesNav;
    let metric_map = this.getMap(this.state.activeMetrics.metric_name, this.state.currentOption);
    if (label === categoryOptions.product) {
      categoriesNav.top = categoryOptions.product;
      categoriesNav.path = [{label, id,graphLabel}];
    } else if (label === categoryOptions.variant) {
      categoriesNav.top = categoryOptions.variant;
      categoriesNav.path[1] = {label, id,graphLabel};
    } else if (label === categoryOptions.time) {
      categoriesNav.top = categoryOptions.time;
      categoriesNav.path[1] = {label, id,graphLabel};
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
    const option = this.state.currentOption;
    if(categoriesNav.top == categoryOptions.variant && categoriesNav.top == categoryOptions.time){
      this.setState({
        currentSubOption: 'time'
      })
    }
    if(this.state.categoriesNav.top == categoryOptions.time){
      const productId = this.state.productId
      this.props.getTimeBySingleVariant({activeMetrics: this.state.activeMetrics, label, productId, id, queryParams, option, metric_map}).then(() => {
        this.setState({
          graphLoadingDone: true
        }, () => {
          this.onOptionChange(this.state.currentOption);
        });
      });
    } else {
      this.props.getCategories({activeMetrics: this.state.activeMetrics, label, id, queryParams, option, metric_map}).then(() => {
        this.setState({
          graphLoadingDone: true
        }, () => {
          this.onOptionChange(this.state.currentOption);
        });
      });
    }
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
      chartData:        null,
      currentOption:    option,
      graphLoadingDone: false,
      graphError:       false,
      noData:           false
    });
    if (option === OPTION_TIME) {
      this.setTimeMetric();
    } else if (option === OPTION_CATEGORIES) {
      this.setCategoryMetrics();
    } else if (option === OPTION_VENDOR) {
      this.setCustomersMetric();
    }
  }
  onSubOptionChange(e) {    
    this.setState({
      currentSubOption: e.target.value
    });
    if(e.target.value == 'product'){
      const { categoryLabel, categoryId ,graphLabel} = this.state;
      if(categoryLabel != '' && categoryId != ''){
        const categoriesNav = this.state.categoriesNav;
        const id = categoryId
        const label = categoryLabel
        let metric_map = this.getMap(this.state.activeMetrics.metric_name, this.state.currentOption);
        if (categoryLabel === categoryOptions.product) {
          categoriesNav.top = categoryOptions.product;
          categoriesNav.path = [{ label, id,graphLabel}];
        } else if (categoryLabel === categoryOptions.variant) {
          categoriesNav.top = categoryOptions.variant;
          categoriesNav.path[1] = { label, id,graphLabel};
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
        const option = this.state.currentOption;
        this.props.getProductBySingleCategory({activeMetrics: this.state.activeMetrics, label, id, queryParams, option, metric_map}).then(() => {
          this.setState({
            graphLoadingDone: true
          }, () => {
            this.onOptionChange(this.state.currentOption);
          });
        });
      }
    } else if(e.target.value == 'time'){
      const {categoryLabel, categoryId,graphLabel} = this.state      
      this.onCategoryClick(categoryLabel, categoryId,graphLabel);
    } else {
      const { categoryLabel, categoryId ,graphLabel
      } = this.state;
      if(categoryLabel != '' && categoryId != ''){
        const categoriesNav = this.state.categoriesNav;
        const id = categoryId
        const label = categoryLabel
        let metric_map = this.getMap(this.state.activeMetrics.metric_name, this.state.currentOption);
        if (categoryLabel === categoryOptions.product) {
          categoriesNav.top = categoryOptions.product;
          categoriesNav.path = [{ label, id,graphLabel}];
        } else if (categoryLabel === categoryOptions.variant) {
          categoriesNav.top = categoryOptions.variant;
          categoriesNav.path[1] = { label, id,graphLabel};
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
        const option = this.state.currentOption;
        this.props.getVariantBySingleProduct({activeMetrics: this.state.activeMetrics, label, id, queryParams, option, metric_map}).then(() => {
          this.setState({
            graphLoadingDone: true
          }, () => {
            this.onOptionChange(this.state.currentOption);
          });
        });
      }
    }
  }
  showDetailOnHover(label) {    
    const {customersData, productData, currentOption} = _.cloneDeep(this.state);
    const loading = <div className="text-center padding-t-10"> <Spin /></div>;
    let tooltipDetailView = false;
    if (currentOption === OPTION_VENDOR) {
      const custInfo = _.find(customersData, {name: label});
      if (custInfo) {
        tooltipDetailView = customerDetailOnHover(custInfo);
      } else {
        tooltipDetailView = loading;
      }
    } else if (currentOption === OPTION_CATEGORIES && this.state.categoriesNav.top === categoryOptions.product) {
      const productId = parseInt(label);
      let productInfo = _.find(productData.products, function(o) {return o.productId == productId})
      if (isNaN(productId)) {
        productInfo = _.find(productData.products, function(o) {return o.productId == label});
      }
      if (productInfo) {
        tooltipDetailView = productDetailOnHover(productInfo);
      } else {
        tooltipDetailView = loading;
      }
    }
    let productInfo = _.find(productData.products, function(o) {return o.productId == label});    
    this.setState({
      tooltipDetail: productInfo
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
    let metric_map = this.getMap(this.state.activeMetrics.metric_name, this.state.currentOption);
    const queryParams = {
      timeslice_start: this.customStartTime,
      timeslice_end:   this.customEndTime
    };
    if (isEmpty(this.customStartTime) || isEmpty(this.customEndTime)) {
      const ms = moment().utc().startOf('day').valueOf();
      this.customEndTime = queryParams.timeslice_end = moment(ms).add({days: 1}).valueOf();
      this.customStartTime = queryParams.timeslice_start = moment(ms).subtract({years: 1}).valueOf();
    }
    const option = this.state.currentOption;
    this.setState({
      graphLoadingDone: false,
    })
    this.props.getChartData(option, this.state.activeMetrics, metric_map, queryParams, this.props.channelData.data.shopId).then((results) => {
      this.setState({
          categoriesNav: {top: categoryOptions.categories, path: []},
      })  
        this.onOptionChange(this.state.currentOption);
    });
  }
  onVendor=() => { 
    let metric_map = this.getMap(this.state.activeMetrics.metric_name, this.state.currentOption);
    const queryParams = {
      timeslice_start: this.customStartTime,
      timeslice_end:   this.customEndTime
    };
    if (isEmpty(this.customStartTime) || isEmpty(this.customEndTime)) {
      const ms = moment().utc().startOf('day').valueOf();
      this.customEndTime = queryParams.timeslice_end = moment(ms).add({days: 1}).valueOf();
      this.customStartTime = queryParams.timeslice_start = moment(ms).subtract({years: 1}).valueOf();
    }
    const option = this.state.currentOption;
    this.setState({
      graphLoadingDone: false,
    })
    this.props.getChartData(option, this.state.activeMetrics, metric_map, queryParams, this.props.channelData.data.shopId).then((results) => {
      this.setState({
          vendorsNav: {top: vendorOptions.vendors, path: []},
      })  
        this.onOptionChange(this.state.currentOption);
    });
  }
  render() {    
    const {activeMetrics} = this.props;
    const {categoriesNav, vendorsNav, currentOption} = this.state;
    const CustomSpin = (
      <div style={{width: '100%', height: 300, textAlign: 'center', maxHeight: 'calc(100vh - 325px)'}}>
        <Spin />
      </div>
    );
    const fullHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const chartHeight = `${fullHeight * 0.35}px`;
    let chartTitle = '';
    if (this.state.currentOption === OPTION_TIME) {
      chartTitle = 'Historical Trend';
    } else if (this.state.currentOption === OPTION_CATEGORIES) {
      if(categoriesNav.path.length == 0){
        chartTitle = `${this.state.activeMetrics.title} by ${categoriesNav.top}`;
      } else if(categoriesNav.path.length != 0 && this.state.currentSubOption == 'time'){
        chartTitle = `Historical Trend of ${this.state.activeMetrics.title} for ${this.state.graphLabel}`;
      } else{
        chartTitle = `${this.state.activeMetrics.title} by ${categoriesNav.top} for ${this.state.graphLabel}`;
      }
    } else if (this.state.currentOption === OPTION_VENDOR) {
      if(vendorsNav.path.length == 0){
        chartTitle = `${this.state.activeMetrics.title} by ${vendorsNav.top}`;
      } else if(vendorsNav.path.length != 0){
        chartTitle = `Historical Trend of ${this.state.activeMetrics.title} for ${this.state.vendorGraphLabel}`;
      }
    }
    return (
      <Dialog
        contentClassName="explore-dialog-container"
        bodyClassName="explore-dialog-body"
        title={<div>
          <span>{`Exploring ${activeMetrics && activeMetrics.title} metric`}</span>
          <span className="pull-right close-btn">
            <Button className="close-button pull-right" onClick={this.closeExploreMetrics} />
          </span>
        </div>}
        titleStyle={styles.chartsHeaderTitle}
        modal
        open={this.props.open}
      >
        <Row>
          <Col>
            <Card className="charts-card-style" style={styles.noBorder}>
              <CardHeader
                textStyle={styles.chartHeader}
                titleStyle={styles.chartsHeaderTitle}
                subtitle={<div className="">
                  <span className="pull-left">
                    <span className="dd-lable">Plot By:</span><br />
                    <span>
                      <ButtonGroup>
                        {
                         this.state.activeMetrics
                                     ? this.state.activeMetrics.availableContexts.map((ctx, i) => {
                                     const Ctx = ctx.label;
                                     return <Button key={i} className={this.state.currentOption === Ctx ? 'active' : ''} onClick={() => this.onOptionChange(Ctx)} >{Ctx}</Button>;
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
                          <Row className="label-header">
                          <Col md={9}>
                            <span className="pull-left">
                              {chartTitle}
                            </span>
                          </Col>
                          <Col md={3}>
                            { this.state.categoriesNav.path.length == 0 && this.state.vendorsNav.path.length == 0 ? 
                            <span className={this.state.currentOption === OPTION_TIME ? 'display-none' : 'pull-right close-btn'}>
                              <Select defaultValue={this.currentSortOption} onChange={(value, label) => { this.onSortOptionChange(value); }}>
                                <Option value="1">Low to High</Option>
                                <Option value="2">High to Low</Option>
                              </Select>
                            </span> : this.state.categoriesNav.path.length !=0 && this.state.currentSubOption != 'time' ? 
                            <span className={this.state.currentOption === OPTION_TIME ? 'display-none' : 'pull-right close-btn'}>
                              <Select defaultValue={this.currentSortOption} onChange={(value, label) => { this.onSortOptionChange(value); }}>
                                <Option value="1">Low to High</Option>
                                <Option value="2">High to Low</Option>
                              </Select>
                            </span>  
                              : null}
                          </Col>
                          </Row>
                          {
                            this.state.currentOption == OPTION_CATEGORIES && this.state.categoriesNav.path.length != 0 ?
                            <Row className="suboption-btn">
                            <ButtonGroup style={{marginLeft:'15px', marginTop:'10px'}}>
                             <Button value="time" className={this.state.currentSubOption === 'time' ? 'active' : ''} onClick={(e) => this.onSubOptionChange(e)}>Time</Button>
                             { this.state.categoriesNav.top != categoryOptions.time ? this.state.categoriesNav.top == categoryOptions.product ?  
                                <Button value='product' className={this.state.currentSubOption === 'product' ? 'active' : ''} onClick={(e) => this.onSubOptionChange(e)}>Products</Button> 
                                : 
                                <Button value='variant' className={this.state.currentSubOption === 'variant' ? 'active' : ''} onClick={(e) => this.onSubOptionChange(e)}>Variants</Button> 
                               : null}             
                          </ButtonGroup>
                          </Row>
                            :
                            null
                          }
                          <br />
                          {this.state.categoriesNav.path.length == 1 && this.state.currentSubOption == 'time' ?
                            null : currentOption === OPTION_CATEGORIES && categoriesNav.path.length ? <Col md={12} style={{marginTop:'10px'}} className="category-link-container">
                            <span className="link cursor-pointer" onClick={this.onCategory}> Category </span>
                            {categoriesNav.path[0] ? <span className={`link ${categoriesNav.path.length > 1 ? 'cursor-pointer' : ''}`} onClick={() => { categoriesNav.path.length > 1 ? this.onCategoryClick(categoriesNav.path[0].label, categoriesNav.path[0].id,categoriesNav.path[0].graphLabel) : ''; }}> &nbsp;&nbsp;&gt;&nbsp; Products </span> : ''}
                            {categoriesNav.path[1] ? <span className="link"> &nbsp;&nbsp;&gt;&nbsp; Variants </span> : ''}
                                                                                              </Col> : null}
                          {currentOption === OPTION_VENDOR && vendorsNav.path.length ? <Col md={12} style={{marginTop:'10px'}} className="category-link-container">
                            <span className="link cursor-pointer" onClick={this.onVendor}> Vendor </span>
                            {vendorsNav.path[0] ? <span className={`link ${vendorsNav.path.length > 1 ? 'cursor-pointer' : ''}`} onClick={() => { vendorsNav.path.length > 1 ? this.onVendorClick(vendorsNav.path[0].label, vendorsNav.path[0].id) : ''; }}> &nbsp;&nbsp;&gt;&nbsp; Time </span> : ''}                                                                                              </Col> : null}                                                                                              
                        </Row>}
                        titleStyle={styles.chartsHeaderTitle}
                      />
                      <CardText>
                        <div id="chart-full-width-holder" style={{width: '100%', height: '0px'}} />

                        <ReactPlaceholder ready={this.state.graphLoadingDone} customPlaceholder={CustomSpin} className="loading-placeholder-rect-media">
                          <div>
                            {
                              this.state.graphError && !this.state.chartData && this.state.graphLoadingDone && this.state.noData ? 
                              <div className="chart-error">Nothing to show for this time range</div>
                              : 
                              (this.state.graphError && !this.state.chartData && this.state.noData === false) ?
                              <div className="chart-error">Oops! Something went wrong. We have made note of this issue and will fix this as soon as possible</div>
                              :
                              <div className="chart-wrapper">
                                <div style={{width: this.state.chartWidth, height: chartHeight}}>
                                  {
                                    this.state.currentOption === OPTION_VENDOR ?
                                      this.state.vendorsNav.path.length === 0 ?
                                      <BarChart
                                        data={this.state.chartData}
                                        fullHeight={fullHeight}
                                        selectedOption={this.state.currentOption}
                                        showDetailOnHover={this.showDetailOnHover}
                                        hideDetail={this.hideDetail}
                                        tooltipDetail={this.state.tooltipDetail}
                                        chartName={this.state.currentOption}
                                        productsByCategory={this.onCategoryClick}
                                        timeByVendor={this.onVendorClick}
                                        categoriesNav={this.state.categoriesNav}
                                        vendorsNav={this.state.vendorsNav}
                                        /> :
                                        <LineChart data={this.state.chartData} fullHeight={fullHeight} selectedOption={this.state.currentOption} chartName="timeChart" />
                                        :  this.state.currentOption === OPTION_CATEGORIES ?
                                        this.state.categoriesNav.path.length === 0 ?
                                        <BarChart
                                          data={this.state.chartData}
                                          fullHeight={fullHeight}
                                          selectedOption={this.state.currentOption}
                                          tooltipDetail={this.state.tooltipDetail}
                                          showDetailOnHover={this.showDetailOnHover}
                                          hideDetail={this.hideDetail}
                                          chartName={this.state.currentOption}
                                          productsByCategory={this.onCategoryClick}
                                          timeByVendor={this.onVendorClick}
                                          categoriesNav={this.state.categoriesNav}
                                          vendorsNav={this.state.vendorsNav}
                                          /> :
                                          this.state.currentSubOption != 'time' && this.state.categoriesNav.top != categoryOptions.time ?
                                          <BarChart
                                          data={this.state.chartData}
                                          fullHeight={fullHeight}
                                          tooltipDetail={this.state.tooltipDetail}
                                          selectedOption={this.state.currentOption}
                                          showDetailOnHover={this.showDetailOnHover}
                                          hideDetail={this.hideDetail}
                                          chartName={this.state.currentOption}
                                          productsByCategory={this.onCategoryClick}
                                          timeByVendor={this.onVendorClick}
                                          categoriesNav={this.state.categoriesNav}
                                          vendorsNav={this.state.vendorsNav}
                                          />
                                          :
                                          <LineChart data={this.state.chartData} fullHeight={fullHeight} selectedOption={this.state.currentOption} chartName="timeChart" />
                                    :      
                                        <LineChart data={this.state.chartData} fullHeight={fullHeight} selectedOption={this.state.currentOption} chartName="timeChart" />
                                  }
                                </div>
                              </div>
                            }
                          </div>
                        </ReactPlaceholder>

                      </CardText>
                    </Card>
                  </Col>
                  <Col md={12} className="">
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
      </Dialog>
    );
  }
}

export default ExploreMetrics;
