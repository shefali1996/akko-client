import React, { Component } from "react";
import {
  Row,
  Col,
  ButtonGroup,
  Button
} from "react-bootstrap";
import { Card, CardHeader, CardText } from "material-ui/Card";
import Chip from "material-ui/Chip";
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import 'antd/lib/select/style'
import 'antd/lib/spin/style'
import ReactPlaceholder from "react-placeholder";
import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"
import FilterDialog from "../components/FilterDialog";
import styles from "../constants/styles";
import CustomRangePicker from "../components/CustomRangePicker";
import { plotByOptions, categoryOptions, vendorOptions,routeConstants } from "../constants";
import { customerDetailOnHover, productDetailOnHover } from "./CustomTable";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import productImgPlaceholder from "../assets/images/productImgPlaceholder.svg";
import infoIcon from '../assets/images/MaterialIcon5.svg';
import backButton from '../assets/images/backButton.svg';
import {lastTimeDate} from "../helpers/functions"
import cloneDeep from "lodash/cloneDeep"
import indexOf from "lodash/indexOf"
import last from "lodash/last"
import find from "lodash/find"

const moment = require("moment");
const { Option } = Select;
const ascendingSortOrder = "asc";
const descendingSortOrder = "desc";
const WIDTH_PER_LABEL = "50";
const RESOLUTION_DAY = "day";
const OPTION_TIME = plotByOptions.time;
const OPTION_CATEGORIES = plotByOptions.categories;
const OPTION_VENDOR = plotByOptions.vendors;
const DAYS_35 = 35 * 86400000;
const subOption = {time:"Time",product:"Product",variant:"Variant"}

class ExploreMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      activeMetrics: this.props.activeMetrics,
      filterBy: "",
      products: {},
      customers: {},
      open: false,
      chartData: null,
      graphError: false,
      graphLoadingDone: false,
      chartWidth: "100%",
      customRangeShouldClear: false,
      currentSubOption: "time",
      currentOption: OPTION_TIME,
      defaultDataMap: {},
      customTimeframeDataMap: {},
      customersData: {},
      categoryLabel: "",
      categoryId: "",
      metrics: [],
      productId: "",
      vendorsId: "",
      vendorsLabel: "",
      categoriesData: {},
      categoriesNav: [{ top: categoryOptions.categories, path: {} }],
      vendorsNav: [{ top: vendorOptions.vendors, path: {} }],
      noData: false,
      productData: {}
    };

    this.currentOption = OPTION_TIME;
    this.currentSortOption = "2";
    this.customStartTime = "";
    this.customEndTime = "";
    this.openFilter = this.openFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.returnData = this.returnData.bind(this);
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
    this.checkCustomDate = this.checkCustomDate.bind(this);
    this.sortChartData = this.sortChartData.bind(this); 
    this.setMetric = this.setMetric.bind(this)
    this.setTimeMetric = this.setTimeMetric.bind(this)
    this.setDefaultMetric = this.setDefaultMetric.bind(this);
    this.resizeGraph = this.resizeGraph.bind(this)
  }

  componentWillMount(){

    this.setState({
      activeMetrics: this.props.activeMetrics
    })
  }

  componentDidMount(){

    this.setDefaultMetric();
    window.addEventListener('resize', this.resizeGraph);
    this.resizeGraph();
      
  }

  componentWillUnmount(){
    window.removeEventListener('resize',this.resizeGraph);
  }
  componentWillReceiveProps(nextProps) {          
    const state = cloneDeep(this.state);
    this.setState(
      {
        metrics: nextProps.metricsData.data.metrics
      },
      () => {
        const {
          activeMetrics,
          defaultDataMap,
          customTimeframeDataMap,
          categoriesData,
          customersData,
          productData,
          open
        } = state;
        let { currentOption } = state;

        if (nextProps.customersData != undefined) {
          if (!isEqual(nextProps.customersData.data, customersData)) {
            this.setState({
              customersData: nextProps.customersData.data
            });
          }
        }
        if (!isEqual(nextProps.productData.data, productData)) {
          this.setState({
            productData: nextProps.productData.data
          });
        }
        if (
          nextProps.activeMetrics &&
          nextProps.activeMetrics !== this.state.activeMetrics
        ) {
          if (
            indexOf(
              nextProps.activeMetrics.availableContexts,
              currentOption.toLowerCase()
            ) === -1
          ) {
            currentOption = OPTION_TIME;
          }
          this.setState(
            {
              activeMetrics: nextProps.activeMetrics,
              currentOption
            },
            () => {
              this.onOptionChange(currentOption);
            }
          );
        }
        const d = nextProps.chartData.data;
        if (
          !isEqual(d.defaultDataMap, defaultDataMap) ||
          !isEqual(d.customTimeframeDataMap, customTimeframeDataMap) ||
          !isEqual(d.categoriesData, categoriesData)
        ) {
          this.setState(
            {
              graphLoadingDone: true,
              defaultDataMap: d.defaultDataMap,
              customTimeframeDataMap: d.customTimeframeDataMap,
              categoriesData: d.categoriesData
            },
            () => {
              this.onOptionChange(currentOption);
            }
          );
        }
      }
    );
  }


  resizeGraph()
  {
    const full_width = window.innerWidth * 0.85
      const width = full_width + "px";

    this.setState({
      chartWidth: width,
    });
  }

  checkCustomDate = ()=>{
    if (this.customStartTime === "" || this.customEndTime === "") {
      const ms = moment()
        .utc()
        .startOf("day")
        .valueOf();
      this.customEndTime = lastTimeDate(ms)
        .valueOf();
      this.customStartTime = moment(ms)
        .subtract({ years: 1 })
        .valueOf();
    }
  };
  sortChartData = (data)=>{
    let sortOrder = ascendingSortOrder;
    if (this.currentSortOption === "2") {
      sortOrder = descendingSortOrder;
    }
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
  getMap(metric, context, subOption, currentSubOption, id) {
    let map = this.state.defaultDataMap;
    if (this.customStartTime !== "" && this.customEndTime !== "") {
      map = this.state.customTimeframeDataMap;
    }
    const key = `${metric}:${context}`;
    const key2 = `${metric}:${context}:${subOption}:${id}`;
    const key3 = `${metric}:${context}:${subOption}:${currentSubOption}:${id}`;
    const finalKey =
      subOption && currentSubOption ? key3 : subOption ? key2 : key;
    if (map.hasOwnProperty(finalKey)) {
      return map[finalKey];
    }
    return null;
  }


resizeFunction=()=>{
  this.setTimeMetric()
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
      filterBy: "",
      currentOption: OPTION_TIME,
      defaultDataMap: {},
      customTimeframeDataMap: {},
      customersData: {},
      categoryLabel: "",
      chartData: null,
      categoryId: "",
      productId: "",
      vendorsId: "",
      categoriesData: {},
      categoriesNav: { top: categoryOptions.categories, path: [] },
      vendorsNav: { top: vendorOptions.vendors, path: [] }
    });
  }

  closeExploreMetrics() {
    if (this.customStartTime !== "") {
      this.clearStates();
      this.customStartTime = "";
      this.customEndTime = "";
    }
    this.clearStates();
    this.props.closeFilter();
  }

  clearStates() {
    this.setState({
      customRangeShouldClear: true,
      currentOption: OPTION_TIME,
      defaultDataMap: {},
      customTimeframeDataMap: {},
      customersData: {},
      categoryLabel: "",
      chartData: null,
      categoryId: "",
      productId: "",
      vendorsId: "",
      categoriesData: {},
      categoriesNav: { top: categoryOptions.categories, path: [] },
      vendorsNav: { top: vendorOptions.vendors, path: [] },
      customTimeframeDataMap: {}
    });
  }

  afterCustomRangeClear() {
    this.setState({
      customRangeShouldClear: false
    });
  }

  onRowSelect(filterData) {
    const { filterBy } = this.state;
    if (filterBy === "product") {
      this.setState({ products: filterData });
    } else if (filterBy === "customer") {
      this.setState({ customers: filterData });
    }
  }
  returnData() {
    const { filterBy, products, customers } = this.state;
    if (filterBy === "product") {
      return products;
    } else if (filterBy === "customer") {
      return customers;
    }
  }

  setDefaultMetric(){
    let metric_map = {}
    this.checkCustomDate();
    metric_map.start = this.customStartTime;
    metric_map.end = this.customEndTime;

    const queryParams = {
      timeslice_start: metric_map.start,
      timeslice_end: metric_map.end
    };
if(this.state.activeMetrics){
    this.props.getChartData(
      OPTION_TIME,
      this.state.activeMetrics,
      metric_map,
      queryParams,
      this.props.channelData.data.shopId
    )
}
  }

  setMetric(option) {    
    const metric_name = this.state.activeMetrics.metric_name;
    let metric_map = this.getMap(metric_name, option);
    if (!metric_map) {
      metric_map = {};

      if (this.customStartTime !== "" && this.customEndTime !== "") {
        metric_map.start = this.customStartTime;
        metric_map.end = this.customEndTime;
        metric_map.timeFrame = true;
      } else {
        const ms = moment()
          .utc()
          .startOf("day")
          .valueOf();
        this.customEndTime = metric_map.end = lastTimeDate(ms)
          .add({ days: 1 })
          .valueOf();
        this.customStartTime = metric_map.start = moment(ms)
          .subtract({ years: 1 })
          .valueOf();
      }
      const queryParams = {
        timeslice_start: metric_map.start,
        timeslice_end: metric_map.end
      };
      if (
        option === OPTION_TIME &&
        metric_map.end - metric_map.start <= DAYS_35
      ) {
        queryParams.resolution = RESOLUTION_DAY;
        metric_map.resolution = RESOLUTION_DAY;
      }
      const {
        categoriesNav,
        vendorsNav,
        currentSubOption,
        categoryLabel,
        categoryId,
        vendorsId
      } = this.state;
      
      const categoriesNavTop = last(categoriesNav)
      const vendorsNavTop = last(vendorsNav)
      if (isEmpty(categoriesNavTop.path) == false && option === OPTION_CATEGORIES) {
        if (
          categoriesNavTop.top == "Product"  &&
          this.state.currentSubOption == "time"
        ) {
          this.props
            .getCategories({
              activeMetrics: this.state.activeMetrics,
              label: this.state.categoryLabel,
              id: this.state.categoryId,
              queryParams,
              option,
              metric_map,
              currentSubOption,
              categoryLabel
            })
            .then(() => {
              this.setState(
                {
                  graphLoadingDone: true
                },
                () => {
                  this.onOptionChange(this.state.currentOption, categoryId);
                }
              );
            });
        } else if (
          categoriesNav.length == 2 &&
          this.state.currentSubOption == "product"
        ) {
          this.props
            .getProductBySingleCategory({
              activeMetrics: this.state.activeMetrics,
              label: this.state.categoryLabel,
              id: this.state.categoryId,
              queryParams,
              option,
              metric_map,
              currentSubOption,
              categoryLabel
            })
            .then(() => {
              this.setState(
                {
                  graphLoadingDone: true
                },
                () => {
                  this.onOptionChange(this.state.currentOption, categoryId);
                }
              );
            });
        } else if (
          categoriesNav.length == 3 &&
          this.state.currentSubOption == "variant"
        ) {
          this.props
            .getVariantBySingleProduct({
              activeMetrics: this.state.activeMetrics,
              label: this.state.categoryLabel,
              id: this.state.categoryId,
              queryParams,
              option,
              metric_map,
              currentSubOption,
              categoryLabel
            })
            .then(() => {
              this.setState(
                {
                  graphLoadingDone: true
                },
                () => {
                  this.onOptionChange(this.state.currentOption, categoryId);
                }
              );
            });
        } else if (
          categoriesNav.length == 3 &&
          this.state.currentSubOption == "time" &&
          categoriesNav.top == "Variant"
        ) {
          this.props
            .getCategories({
              activeMetrics: this.state.activeMetrics,
              label: this.state.categoryLabel,
              id: this.state.categoryId,
              queryParams,
              option,
              metric_map,
              currentSubOption,
              categoryLabel
            })
            .then(() => {
              this.setState(
                {
                  graphLoadingDone: true
                },
                () => {
                  this.onOptionChange(this.state.currentOption, categoryId);
                }
              );
            });
        } else {
          this.props
            .getTimeBySingleVariant({
              activeMetrics: this.state.activeMetrics,
              label: this.state.categoryLabel,
              productId: this.state.productId,
              id: this.state.categoryId,
              queryParams,
              option,
              metric_map,
              currentSubOption,
              categoryLabel
            })
            .then(() => {
              this.setState(
                {
                  graphLoadingDone: true
                },
                () => {
                  this.onOptionChange(this.state.currentOption, categoryId);
                }
              );
            });
        }
      } else if (!isEmpty(vendorsNavTop.path) && option === OPTION_VENDOR) {
        this.props
          .getVendors({
            activeMetrics: this.state.activeMetrics,
            label: this.state.vendorsLabel,
            id: this.state.vendorsId,
            queryParams,
            option,
            metric_map
          })
          .then(() => {
            this.setState(
              {
                graphLoadingDone: true
              },
              () => {
                this.onOptionChange(this.state.currentOption, vendorsId);
              }
            );
          });
      } else {        
        this.props.getChartData(
          option,
          this.state.activeMetrics,
          metric_map,
          queryParams,
          this.props.channelData.data.shopId
        );
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
      if (metrics === undefined) {
        this.setState({
          noData: false,
          graphError: true,
          chartData: null,
          graphLoadingDone: true
        });
      }
      if (metrics.length === 0) {
        this.setState({
          noData: true,
          graphError: true,
          chartData: null,
          graphLoadingDone: true
        });
        throw new Error("No metrics to display");
      }

      const value = metrics[0];
      const data = [];
      metrics.forEach((value) => {
        let format = 'MMM YY';
        const label = moment(value.time_start).utcOffset('+00:00').format(format);        
        let prefix = (find(this.state.metrics, function(o) {return o.db_name == metric_name})).prefix;
        let postfix = (find(this.state.metrics, function(o) {return o.db_name == metric_name})).postfix;
        data.push({
          label,
          value: value.value,
          prefix,
          postfix
        });
      });
                 
      this.setState({
        chartData: data,
        graphLoadingDone: true
      },()=>{this.resizeGraph()});
    }
  }

  setCategoryMetrics(id) {
    const metric_name = this.state.activeMetrics.metric_name;
    const { categoryLabel, currentSubOption } = this.state;
    const metric_map = this.getMap(
      metric_name,
      OPTION_CATEGORIES,
      categoryLabel,
      currentSubOption,
      id
    );
    if (!metric_map) {
      this.setMetric(OPTION_CATEGORIES);
    } else {
      let metrics = metric_map.result;
      if (metrics === undefined) {
        this.setState({
          noData: false,
          graphError: true,
          chartData: null,
          graphLoadingDone: true
        });
      }
      if (metrics.length === 0) {
        this.setState({
          noData: true,
          graphError: true,
          chartData: null,
          graphLoadingDone: true
        });
        throw new Error("No metrics to display");
      }
      const data = [];
      let index = 0;
      const categoriesNavTop = last(this.state.categoriesNav)
      if (
        categoriesNavTop.top === categoryOptions.product ||
        categoriesNavTop.top === categoryOptions.variant ||
        (categoriesNavTop.top === categoryOptions.time &&
          (this.state.currentSubOption == "time" ||
            this.state.currentSubOption == "product" ||
            this.state.currentSubOption == "variant"))
      ) {
        metrics.forEach(value => {
          let format = "MMM YY";
          if (this.state.currentSubOption == "time") {
            const label = moment(value.time_start)
              .utcOffset("+00:00")
              .format(format);
            let prefix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).prefix;
            let postfix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).postfix;
            data.push({
              label,
              value: value.value,
              prefix,
              postfix,
              index
            });
          } else if (this.state.currentSubOption == "variant") {
            const label = value.variantTitle;
            let prefix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).prefix;
            let postfix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).postfix;
            data.push({
              label,
              value: value.value,
              prefix,
              postfix,
              index,
              categoryBarId: value.variantId
            });
          } else if (categoriesNavTop.top == categoryOptions.time) {
            const label = moment(value.time_start)
              .utcOffset("+00:00")
              .format(format);
            let prefix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).prefix;
            let postfix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).postfix;
            data.push({
              label,
              value: value.value,
              prefix,
              postfix,
              index
            });
          } else {
            this.setState({ productId: value.productId });
            const label = value.productTitle;
            const variantArr = find(this.state.productData.products, function(
              o
            ) {
              return o.productId == value.productId;
            });
            const image =
              (variantArr && variantArr.variants[0].imageUrl) ||
              productImgPlaceholder;

            let prefix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).prefix;
            let postfix = find(this.state.metrics, function(o) {
              return o.db_name == metric_name;
            }).postfix;
            data.push({
              label,
              image,
              value: value.value,
              prefix,
              postfix,
              index,
              categoryBarId: value.productId
            });
          }
          index++;
        });
      } else if (
        this.state.activeMetrics.metric_name == "avg_margin" ||
        this.state.activeMetrics.metric_name == "number_of_orders"
      ) {
        metrics.forEach(value => {
          let prefix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).prefix;
          let postfix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).postfix;
          data.push({
            label: value.productType,
            value: value.value,
            prefix,
            postfix,
            index,
            categoryBarId: value.productTypeId
          });
          index++;
        });
      } else {
        metrics.forEach(value => {
          const label = value.contextId.split(":")[1];
          let prefix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).prefix;
          let postfix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).postfix;
          data.push({
            label,
            value: value.value,
            prefix,
            postfix,
            index,
            categoryBarId: value.categoryId
          });
          index++;
        });
      }
      this.sortChartData(data);
      this.setState({
        chartData: data,
        graphLoadingDone: true
      },()=>{this.resizeGraph()});
    }
  }

  setVendorsMetric(id) {   
   
    const vendorsNavTop = last(this.state.vendorsNav)
    const label = vendorsNavTop.top === "Time" ? "Time" : "";
    const metric_name = this.state.activeMetrics.metric_name;
    const metric_map = this.getMap(metric_name, OPTION_VENDOR, label, "", id);

    if (!metric_map) {
      this.setMetric(OPTION_VENDOR);
    } else {
      let metrics = metric_map.result;
      if (metrics === undefined) {
        this.setState({
          noData: false,
          graphError: true,
          chartData: null,
          graphLoadingDone: true
        });
      }
      if (metrics.length === 0) {
        this.setState({
          noData: true,
          graphError: true,
          chartData: null,
          graphLoadingDone: true
        });
        throw new Error("No metrics to display");
      }
      const value = metrics[0];

      const data = [];

      let index = 0;

      if (vendorsNavTop.top === vendorOptions.time) {
        this.setState({
          currentOption: OPTION_VENDOR
        });

        metrics.forEach(value => {
          let format = "MMM YY";
          const label = moment(value.time_start)
            .utcOffset("+00:00")
            .format(format);
          let prefix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).prefix;
          let postfix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).postfix;
          data.push({
            label,
            value: value.value,
            prefix,
            postfix,
            index,
            vendorId: value.vendorId
          });
          index++;
        });
      } else if (
        this.state.activeMetrics.metric_name == "avg_margin" ||
        this.state.activeMetrics.metric_name == "number_of_orders" ||
        this.state.activeMetrics.metric_name == "gross_profit"
      ) {
        metrics.forEach(value => {
          let email = value.vendor;
          let prefix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).prefix;
          let postfix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).postfix;
          data.push({
            label: value.vendor,
            value: value.value,
            prefix,
            postfix,
            email,
            index,
            vendorId: value.vendorId
          });
          index++;
        });
      } else {
        metrics.forEach(value => {
          let label = value.contextId.split("_")[1];
          let email = label;
          let prefix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).prefix;
          let postfix = find(this.state.metrics, function(o) {
            return o.db_name == metric_name;
          }).postfix;
          data.push({
            label,
            value: value.value,
            prefix,
            postfix,
            email,
            index,
            vendorId: value.vendorId
          });
          index++;
        });
      }
      this.sortChartData(data);
      this.setState({
        chartData: data,
        graphLoadingDone: true
      },()=>{this.resizeGraph()});
    }
  }

  onVendorClick(label, id, vendorGraphLabel) {
    const { metric_name } = this.state.activeMetrics;
    const currentVendorBar = this.props.chartData.data.customTimeframeDataMap[
      `${metric_name}:Vendors:Time:${id}`
    ];
    if (!currentVendorBar) {
      this.setState({
        vendorsId: id,
        chartData:null,
        vendorsLabel: label,
        vendorGraphLabel: vendorGraphLabel
      });
      const vendorsNav = this.state.vendorsNav;

      let metric_map = this.getMap(
        this.state.activeMetrics.metric_name,
        this.state.currentOption
      );
      if (label === vendorOptions.time) {
        vendorsNav.push({top:label,path:{label,id}})
      }
      this.setState({
        vendorsNav,
        graphLoadingDone: false
      });
      this.checkCustomDate();
      const queryParams = {
        timeslice_start: this.customStartTime,
        timeslice_end: this.customEndTime
      };
      const option = this.state.currentOption;
      this.props
        .getVendors({
          activeMetrics: this.state.activeMetrics,
          label,
          id,
          queryParams,
          option,
          metric_map
        })
        .then(() => {
          this.setState(
            {
              graphLoadingDone: true
            },
            () => {
              this.onOptionChange(this.state.currentOption, id);
            }
          );
        });
    } else {
      this.setState({
        vendorsId: id
      });
      const vendorsNav = this.state.vendorsNav;
      if (label === vendorOptions.time) {
        vendorsNav.push({top:label,path:{label,id}})
      }
      this.onOptionChange(this.state.currentOption, id);
    }
  }

  onCategoryClick(label, id, graphLabel,i) {
   
    const categoriesNav = this.state.categoriesNav;
    const { metric_name } = this.state.activeMetrics;
    if(i){
      while(i--){
        categoriesNav.pop()
      }
    }
    categoriesNav.push({top:label,path: { label, id, graphLabel }})
    
    this.setState(
      {
        categoriesNav,
        chartData: null,
        currentSubOption: "time",
        categoryLabel: label,
        categoryId: id,
        graphLabel
      },
      () => {
        const navPathTop = last(this.state.categoriesNav)
        const categoryBarsId = this.props.chartData.data.customTimeframeDataMap[
          `${metric_name}:Categories:${this.state.categoryLabel}:${
            this.state.currentSubOption
          }:${id}`
        ];

        if (!categoryBarsId) {
          let metric_map =
            this.getMap(
              this.state.activeMetrics.metric_name,
              this.state.currentOption
            ) || {};
          this.setState({
            graphLoadingDone: false
          });

          this.checkCustomDate();

          const queryParams = {
            timeslice_start: this.customStartTime,
            timeslice_end: this.customEndTime
          };

          const option = this.state.currentOption;
          if (
            navPathTop.top == categoryOptions.variant &&
            navPathTop.top == categoryOptions.time
          ) {
            this.setState({
              currentSubOption: "time"
            });
          }
          const { currentSubOption, categoryLabel } = this.state;

          if (navPathTop.top == categoryOptions.time) {
            const productId = this.state.productId;
            this.props
              .getTimeBySingleVariant({
                activeMetrics: this.state.activeMetrics,
                label,
                productId,
                id,
                queryParams,
                option,
                metric_map,
                currentSubOption,
                categoryLabel
              })
              .then(() => {
                this.setState(
                  {
                    graphLoadingDone: true
                  },
                  () => {
                    this.onOptionChange(this.state.currentOption, id);
                  }
                );
              });
          } else {
            this.props
              .getCategories({
                activeMetrics: this.state.activeMetrics,
                label,
                id,
                queryParams,
                option,
                metric_map,
                currentSubOption,
                categoryLabel
              })
              .then(() => {
                this.setState(
                  {
                    graphLoadingDone: true
                  },
                  () => {
                    this.onOptionChange(this.state.currentOption, id);
                  }
                );
              });
          }
        } else {
          this.setState(
            {
              currentSubOption: "time",
              categoriesNav,
              categoryLabel: label,
              graphLabel,
              categoryId: id
            },
            () => {
              this.onOptionChange(this.state.currentOption, id);
            }
          );
        }
      }
    );
  }

  onTimeframeChange(newStartTime, newEndTime) {
    this.customStartTime = newStartTime.valueOf();
    this.customEndTime = lastTimeDate(newEndTime).valueOf();
    if (!isEmpty(this.state.customTimeframeDataMap)) {
      this.props.emptyTimeFrameData();
    } else {
      this.onOptionChange(this.state.currentOption);
    }
  }

  onSortOptionChange(option) {
    if(this.currentSortOption !== option){
      this.currentSortOption = option;
      let data = cloneDeep(this.state.chartData);
      this.sortChartData(data);
      this.setState({
        chartData: data,
      });
    }
  }

  onOptionChange(option, id) {
    this.setState({
      chartData: null,
      currentOption: option,
      graphLoadingDone: false,
      graphError: false,
      noData: false
    });
    if (option === OPTION_TIME) {
      this.setTimeMetric();
    } else if (option === OPTION_CATEGORIES) {
      this.setCategoryMetrics(id);
    } else if (option === OPTION_VENDOR) {
      this.setVendorsMetric(id);
    }
  }

  onSubOptionChange(e) {

    if(e.target.value == this.state.currentSubOption){
      return
    }

    const { metric_name } = this.state.activeMetrics;
    const { categoryLabel, categoryId, graphLabel } = this.state;
    const productBarData = this.props.chartData.data.customTimeframeDataMap[
      `${metric_name}:Categories:Product:product:${categoryId}`
    ];
    const currentSubOption = e.target.value;
    this.setState({
      currentSubOption: e.target.value
    });

    const categoriesNav = this.state.categoriesNav;

    const label = categoryLabel;
    const id = categoryId;
    if (e.target.value == "product") {
      if (categoryLabel != "" && categoryId != "" && !productBarData) {
        let metric_map =
          this.getMap(
            this.state.activeMetrics.metric_name,
            this.state.currentOption
          ) || {};
        this.setState({
          graphLoadingDone: false
        });
        this.checkCustomDate();
        const queryParams = {
          timeslice_start: this.customStartTime,
          timeslice_end: this.customEndTime
        };

        const option = this.state.currentOption;
        this.props
          .getProductBySingleCategory({
            activeMetrics: this.state.activeMetrics,
            label,
            id,
            queryParams,
            option,
            metric_map,
            currentSubOption,
            categoryLabel
          })
          .then(() => {
            this.setState(
              {
                graphLoadingDone: true
              },
              () => {
                this.onOptionChange(this.state.currentOption, id);
              }
            );
          });
      } else {
        this.setState(
          {
            categoriesNav
          },
          () => {
            this.onOptionChange(this.state.currentOption, id);
          }
        );
      }
    } else if (e.target.value == "time") {
      const { categoryLabel, categoryId, graphLabel } = this.state;
      this.onCategoryClick(
        categoryLabel,
        categoryId,
        graphLabel,
        1
      );
    } else {
      const {
        categoryLabel,
        categoryId,
        graphLabel,
        activeMetrics: { metric_name }
      } = this.state;
      const variantBarData = this.props.chartData.data.customTimeframeDataMap[
        `${metric_name}:Categories:Variant:variant:${categoryId}`
      ];
      if (categoryLabel != "" && categoryId != "" && !variantBarData) {
        const categoriesNav = this.state.categoriesNav;
        const id = categoryId;
        const label = categoryLabel;
        let metric_map =
          this.getMap(
            this.state.activeMetrics.metric_name,
            this.state.currentOption
          ) || {};
        this.setState({
          categoriesNav,
          graphLoadingDone: false
        });

        this.checkCustomDate();
        const queryParams = {
          timeslice_start: this.customStartTime,
          timeslice_end: this.customEndTime
        };

        const option = this.state.currentOption;
        this.props
          .getVariantBySingleProduct({
            activeMetrics: this.state.activeMetrics,
            label,
            id,
            queryParams,
            option,
            metric_map,
            currentSubOption,
            categoryLabel
          })
          .then(() => {
            this.setState(
              {
                graphLoadingDone: true
              },
              () => {
                this.onOptionChange(this.state.currentOption, id);
              }
            );
          });
      } else {
        const categoriesNav = this.state.categoriesNav;
        const id = categoryId;
        const label = categoryLabel;
        let metric_map = this.getMap(
          this.state.activeMetrics.metric_name,
          this.state.currentOption,
          id
        );

        this.setState(
          {
            categoriesNav,
            graphLoadingDone: true
          },
          () => {
            this.onOptionChange(this.state.currentOption, id);
          }
        );
      }
    }
  }

  showDetailOnHover(label) {
    const { customersData, productData, currentOption } = cloneDeep(
      this.state
    );
    const loading = (
      <div className="text-center padding-t-10">
        {" "}
        <Spin />
      </div>
    );
    let tooltipDetailView = false;
    const categoriesNavTop = last(this.state.categoriesNav)
    if (currentOption === OPTION_VENDOR) {
      const custInfo = find(customersData, { name: label });
      if (custInfo) {
        tooltipDetailView = customerDetailOnHover(custInfo);
      } else {
        tooltipDetailView = loading;
      }
    } else if (
      currentOption === OPTION_CATEGORIES &&
      categoriesNavTop.top === categoryOptions.product
    ) {
      const productId = parseInt(label);
      let productInfo = find(productData.products, function(o) {
        return o.productId == productId;
      });
      if (isNaN(productId)) {
        productInfo = find(productData.products, function(o) {
          return o.productId == label;
        });
      }
      if (productInfo) {
        tooltipDetailView = productDetailOnHover(productInfo);
      } else {
        tooltipDetailView = loading;
      }
    }
    let productInfo = find(productData.products, function(o) {
      return o.productId == label;
    });
    this.setState({
      tooltipDetail: productInfo
    });
  }

  hideDetail() {
    if (!isEmpty(this.state.tooltipDetail)) {
      this.setState({
        tooltipDetail: ""
      });
    }
  }

  onCategory = () => {
    let metric_map =
      this.getMap(
        this.state.activeMetrics.metric_name,
        this.state.currentOption
      ) || {};
    this.checkCustomDate();
    const queryParams = {
      timeslice_start: this.customStartTime,
      timeslice_end: this.customEndTime
    };

    const option = this.state.currentOption;
    this.setState(
      {
        categoriesNav: [{ top: categoryOptions.categories, path: {} }],
        categoryLabel: "",
        currentSubOption: "time"
      },
      () => {
        this.onOptionChange(this.state.currentOption);
      }
    );
  };

  onVendor = () => {
    const { metric_name } = this.props.activeMetrics;
    const vendors =
      this.props.chartData.data.customTimeframeDataMap[
        `${metric_name}:Vendors`
      ] || {};
    let metric_map = this.getMap(
      this.state.activeMetrics.metric_name,
      this.state.currentOption
    );
    const queryParams = {
      timeslice_start: this.customStartTime,
      timeslice_end: this.customEndTime
    };
    if (isEmpty(this.customStartTime) || isEmpty(this.customEndTime)) {
      const ms = moment()
        .utc()
        .startOf("day")
        .valueOf();
      this.customEndTime = queryParams.timeslice_end = lastTimeDate(newEndTime)
        .add({ days: 1 })
        .valueOf();
      this.customStartTime = queryParams.timeslice_start = moment(ms)
        .subtract({ years: 1 })
        .valueOf();
    }
    const option = this.state.currentOption;
    if (!vendors) {
      this.setState({
        graphLoadingDone: false
      });      
      this.props
        .getChartData(
          option,
          this.state.activeMetrics,
          metric_map,
          queryParams,
          this.props.channelData.data.shopId
        )
        .then(results => {
          this.setState({
            vendorsNav: { top: vendorOptions.vendors, path: [] }
          });
          this.onOptionChange(this.state.currentOption);
        });
    } else {
      this.setState(
        {
          vendorsNav: [{ top: vendorOptions.vendors, path: {} }]
        },
        () => {
          this.onOptionChange(this.state.currentOption);
        }
      );
    }
  };

  showLineChart(){
    let  stats = false;
    const categoriesNavTop = last(this.state.categoriesNav)
    const vendorsNavTop = last(this.state.vendorsNav)
    if(this.state.currentOption == OPTION_TIME){
      stats = true;
    }
    else if(this.state.currentOption == OPTION_CATEGORIES){
      stats = isEmpty(categoriesNavTop.path) ? false : this.state.currentSubOption == "time";
    }
    else if(this.state.currentOption == OPTION_VENDOR){
        stats = isEmpty(vendorsNavTop.path) ? false : true; 
    }
    return stats;
  }

  render() {      
    const showLineChart = this.showLineChart();
    const {categoriesNav, vendorsNav, currentOption,categoryId,vendorsId} = this.state;
    const categoriesNavTop = last(categoriesNav)
    const vendorsNavTop = last(vendorsNav)
    const vendorsNavLink = []
    const categoriesNavLink  = []
    const CustomSpin = (
      <div
        style={{
          width: "100%",
          height: 300,
          textAlign: "center",
          maxHeight: "calc(100vh - 325px)"
        }}
      >
        <Spin />
      </div>
    );
    const fullHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const chartHeight = `${fullHeight * 0.35}px`;
    let chartTitle = "";
    if (this.state.currentOption === OPTION_TIME) {
      chartTitle = "Historical Trend";
    } else if (this.state.currentOption === OPTION_CATEGORIES) {
      if (isEmpty(categoriesNavTop.path)) {
        chartTitle = `${this.state.activeMetrics.title} by ${
          categoriesNavTop.top
        }`;
      } else if (
        !isEmpty(categoriesNavTop.path) &&
        this.state.currentSubOption == "time"
      ) {
        chartTitle = `Historical Trend of ${
          this.state.activeMetrics.title
        } for ${this.state.graphLabel}`;
      } else {
        chartTitle = `${this.state.activeMetrics.title} by ${
          categoriesNavTop.top
        } for ${this.state.graphLabel}`;
      }
    } else if (this.state.currentOption === OPTION_VENDOR) {
      if (isEmpty(vendorsNavTop.path)) {
        chartTitle = `${this.state.activeMetrics.title} by ${vendorsNavTop.top}`;
      } else if (vendorsNavTop.path.length != 0) {
        chartTitle = `Historical Trend of ${
          this.state.activeMetrics.title
        } for ${this.state.vendorGraphLabel}`;
      }
    }

    let n = categoriesNav.length
    categoriesNavLink.push(<span key = "0" className="link cursor-pointer" onClick = {this.onCategory}><u>{categoriesNav[0].top}</u>&nbsp;&nbsp;&gt;&nbsp;</span>)
    for(let i = 1;i<n-1;i++){
      const spanTag = <span key = {i} className="link cursor-pointer" onClick={()=>{ 
        this.onCategoryClick(categoriesNav[i].path.label,categoriesNav[i].path.id,categoriesNav[i].path.graphLabel,n-i)}}>
        <u>{categoriesNav[i].top}</u>&nbsp;&nbsp;&gt;&nbsp;
        </span>
      categoriesNavLink.push(spanTag)
     }
     categoriesNavLink.push(<span key = {n} className="link">By {this.state.currentSubOption}</span>)


    vendorsNavLink.push(<span key = "0" className="link cursor-pointer" onClick={this.onVendor}><u>Vendor</u> &nbsp;&nbsp;&gt;&nbsp;</span>)
    vendorsNavLink.push(<span key = "n" className = "link">By time</span>)

    return (
      <Col>
        <div className = "explore-header">
          <span >
            <span className = "icon-title">
              <span className="back-icon">
              <img src={backButton} onClick = {()=>{this.props.clearChartData();this.props.history.push(routeConstants.dashboard)}}></img>
              </span>
              <span className="title">
                {this.props.activeMetrics && this.props.activeMetrics.title} <img src={infoIcon} className="alt-price-title" alt="info icon" title={this.props.activeMetrics && this.props.activeMetrics.description} />
              </span>
            </span>
            </span>
            <span className="pull-right dd-lable"  style={{  }}>
                <CustomRangePicker
                  onTimeframeChange={this.onTimeframeChange}
                  customRangeShouldClear={
                    this.state.customRangeShouldClear
                  }
                  afterCustomRangeClear={this.afterCustomRangeClear}
                  defaultRange={{
                    start: this.customStartTime,
                    end: this.customEndTime
                  }}
                />
              </span>
          </div>    
        <Col className="explore-option" >
          <span>
            <ButtonGroup>
              {this.state.activeMetrics
                ? this.state.activeMetrics.availableContexts.map(
                    (ctx, i) => {
                      const Ctx = ctx.label;
                      return (
                        <Button
                          key={i}
                          value={Ctx}
                          className = "button-group"
                          className={
                            this.state.currentOption === Ctx
                              ? "button-group-active"
                              : ""
                          }
                          onClick={
                            this.state.currentOption === Ctx
                              ? e =>{}
                              : e => {
                                  this.onOptionChange(
                                    Ctx,
                                    e.target.value === "Categories"
                                      ? categoryId
                                      : vendorsId
                                  );
                                }
                          }
                        >
                          {Ctx}
                        </Button>
                      );
                    }
                  )
                : ""}
            </ButtonGroup>
          </span>
      </Col>
      <Col>
              <Row>
                  <Col md={12} className="hide">
                    <Row>
                      <Col md={4} className="text-center padding-r-0">
                        <Card>
                          <CardText className="card-content text-center">
                            <div className="card-title">Filter By Product</div>
                            <div className="chip-wrapper">
                              <Chip
                                className="chip"
                                labelStyle={styles.chipLabelStyle}
                              >
                                Showing{" "}
                                {this.state.products.rowsSelected
                                  ? this.state.products.rowsSelected
                                  : "0"}{" "}
                                products
                              </Chip>
                            </div>
                            <div className="link">
                              <a onClick={() => this.openFilter("product")}>
                                change filter
                              </a>
                            </div>
                          </CardText>
                        </Card>
                      </Col>
                      <Col md={4} className="text-center padding-r-0">
                        <Card className="charts-card-style">
                          <CardText className="card-content text-center">
                            <div className="card-title">
                              Filter By customers
                            </div>
                            <div className="chip-wrapper">
                              <Chip
                                className="chip"
                                labelStyle={styles.chipLabelStyle}
                              >
                                Showing{" "}
                                {this.state.customers.rowsSelected
                                  ? this.state.customers.rowsSelected
                                  : "0"}{" "}
                                customers
                              </Chip>
                            </div>
                            <div className="link">
                              <a onClick={() => this.openFilter("customer")}>
                                change filter
                              </a>
                            </div>
                          </CardText>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={12} className="text-center" style={{paddingBottom: "4%"}}>
                    <Card className="charts-card-style no-border">
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
                            { showLineChart == false ? 
                            <span className="pull-right close-btn">
                              <Select defaultValue={this.currentSortOption} onChange={(value, label) => { this.onSortOptionChange(value); }}>
                                <Option value="1">Low to High</Option>
                                <Option value="2">High to Low</Option>
                              </Select>
                            </span>   
                              : null}
                          </Col>
                          </Row>                          
                            {
                            this.state.currentOption == OPTION_CATEGORIES && !isEmpty(categoriesNavTop.path) ?
                            <Row className="suboption-btn">
                            <ButtonGroup style={{marginTop:'10px',paddingLeft:'15px'}}>
                             <Button value="time" className = "button-group" className={this.state.currentSubOption === 'time' ? 'button-group-active' : ''} onClick={(e) => this.onSubOptionChange(e)}>Time</Button>
                             { categoriesNavTop.top != categoryOptions.time ? categoriesNavTop.top == categoryOptions.product ?  
                                <Button value='product' className = "button-group" className={this.state.currentSubOption === 'product' ? 'button-group-active' : ''}  onClick={(e) => this.onSubOptionChange(e)}>Products</Button> 
                                : 
                                <Button value='variant' className = "button-group" className={this.state.currentSubOption === 'variant' ? 'button-group-active' : ''} onClick={(e) => this.onSubOptionChange(e)}>Variants</Button> 
                               : null}             
                          </ButtonGroup>
                          </Row>
                            :
                            null
                          }
                          <br />
                          <Col md={12} style={{marginTop:'10px'}} className="category-link-container">
                          {
                            currentOption === OPTION_CATEGORIES && categoriesNav.length > 1 ?
                              categoriesNavLink
                            : null   
                          }
                          {
                            currentOption === OPTION_VENDOR && vendorsNav.length > 1 ?
                              vendorsNavLink
                            : null  
                          }
                          </Col>
                        
                        </Row>}
                        titleStyle={styles.chartsHeaderTitle}
                      />
                      <CardText>
                       
                       <div
                          id="chart-full-width-holder"
                          style={{ width: "100%", height: "0px" }}
                        />

                        <ReactPlaceholder
                          ready={this.state.graphLoadingDone}
                          customPlaceholder={CustomSpin}
                          className="loading-placeholder-rect-media"
                        >
                          <div>
                            {
                            
                              this.state.graphError && !this.state.chartData && this.state.graphLoadingDone && this.state.noData ? 
                              <div className="chart-error">Nothing to show for this time range</div>
                              : 
                              (this.state.graphError && !this.state.chartData && this.state.noData === false) ?
                              <div className="chart-error">Oops! Something went wrong. We have made note of this issue and will fix this as soon as possible</div>
                              :
                              <div className="chart-wrapper" style={{width:this.state.chartWidth}}>
                                <div>
                                  {
                                      showLineChart == false ?
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
                                          categoriesNav={categoriesNavTop}
                                          vendorsNav={vendorsNavTop}
                                          />
                                          :
                                          <LineChart data={this.state.chartData} open={this.props.open} fullHeight={fullHeight} selectedOption={this.state.currentOption} chartName="timeChart" graphLoadingDone={this.state.graphLoadingDone}/>
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
      </Col>
      </Col>
    );
  }
}

export default ExploreMetrics;
