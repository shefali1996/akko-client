import React, { Component } from "react";
import { Form, Input, Steps, message, Card, DatePicker, Select,Radio, Switch, Icon, Spin } from "antd";
import moment from 'moment';

import "antd/lib/form/style";
import "antd/lib/input/style";
import "antd/lib/steps/style";
import "antd/lib/message/style";
import "antd/lib/card/style";
import "antd/lib/date-picker/style";
import "antd/lib/radio/style";


import isEmpty from "lodash/isEmpty"
import isEqual from "lodash/isEqual"
import cloneDeep from "lodash/cloneDeep"
import find from "lodash/find";

import swal from 'sweetalert2';
import LinesEllipsis from "react-lines-ellipsis";
import { Grid, Row, Col, Button } from "react-bootstrap";
//Images
import calendar from "../../assets/images/calendar.svg";
import backArrow from "../../assets/images/arrowIcon.svg";
import downArrow from '../../assets/images/down_arrow_emphasis.svg'
import lockIcon from "../../assets/images/padlock.svg";
import checkIcon from "../../assets/images/check.svg";
import CrossIconImg  from "../../assets/images/CrossIcon.svg";
import MaterialIcon from "../../assets/images/MaterialIcon.svg";

import FilterProduct from './filterProduct.js';
import FilterVendors from './filterVendor.js';
import CategoriesFilter from './categoriesFilter.js';

import {routeConstants} from '../../constants';
import { METRICS_TYPE, GOAL_FIELDS, CONTEXTS, TIME_PERIOD, MONTHS, QUARTER_MONTHS,FILTERTABS } from "./constant";
const Option = Select.Option;

const calendarIcon = (
  <img alt="c" style={{ width: 24, height: 24 }} src={calendar} />
);

const downArrowIcon = (
  <img alt="" style={{ width: 24, height: 24 }} src={downArrow}></img>
)

const CrossIcon = (
  <img alt ="" style={{width:16,height:16}} src={CrossIconImg} />
)

const lockWidgetIcon = (
  <img alt="" style={{ width: 35, height: 35 }} src={lockIcon}></img>
)

const backArrowIcon = (
  <img
    alt="!"
    src={backArrow}
    style={{ width: 28, height: 28, marginTop: 17 }}
  />
);

const PRODUCT = 'product';
const VARIANT = 'variant';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Step = Steps.Step;

const {GOAL_NAME,TARGET} = GOAL_FIELDS;

const { PER_MONTH, PER_QUARTER_CUSTOM } = TIME_PERIOD;

const TARGET_CONDITIONS = [">="];

const swalert = () => {
  return swal({
    title: "Are you sure?",
    text: "Your goal is not created yet. Are you sure you want to discard changes and go back?",
    type: "warning",
    showCancelButton: true,
    allowOutsideClick: false,
    focusConfirm: false,
  });
};

const errorSwAlert = (text) => {
  return swal({
    title: "Error",
    text: text,
    type: "error",
    showCancelButton: false,
    allowOutsideClick: false,
    focusConfirm: true,
  });
};


const successSwAlert = (text) => {
  return swal({
    title: "Success",
    text: text,
    type: "success",
    showCancelButton: false,
    allowOutsideClick: false,
    focusConfirm: true,
  });
};

var selectedVarientData = '';




class AddGoalPage extends Component {
  constructor(props) {
    super(props);
    const { data = {} } = this.props;
    const year = (new Date()).getFullYear();
    this.years = Array.from(new Array(5), (val, index) => index + year);

    const isMetricsAlreadyPresent = !!props.metrics;
    
    this.state = {
      current: 0,
      data:                {},
      tableData:           [],
      selectedRows:        [],
      numSelectedVariants: 0,
      searchTerm:          '',
      hideCompleted:       false,
      successMsg:          '',
      errorText:           '',
      setMark:            0,
      disableNextButton: true,
      metric: data.metric,
      context: data.context,
      contextValue: data.contextValue || [null],
      goalName: data.goalName,
      confirmDirty: false,
      selectedMetric: "",
      selectedTimeFormat: "month",
      goalTarget: null,
      vendors:[],
      selectedTab:FILTERTABS[0],
      selectedVendors:[],
      selectedCategories:[],
      selectedProducts:[],
      selectedTablegHead:[],
      categories:[],
      selectedQuarter: undefined,
      selectedYear: undefined,
      selectedYearForQuarter: undefined,
      selectedMonth: undefined,
      steps: [
        {
          title: "Choose a metric to track",
          content: "firstMetric",
          description: ""
        },
        {
          title: "Select time period",
          content: "timePeriod",
          description: ""
        },
        {
          title: "Set goal target",
          content: "setGoalTarget",
          description: ""
        },
        {
          title: "Apply filters",
          content: "ApplyFilter",
          description: ""
        }
      ],
      apiFetchStarted: !isMetricsAlreadyPresent,
      postFetchStarted: false,
    };

    this.getFieldDecorator = this.props.form.getFieldDecorator;
    this.updateTableData = this.updateTableData.bind(this);
  }

  componentDidMount() {
    const { getAllGoals } = this.props;
    this.props.getUser();
    this.props.getChannel().then(res => {
      getAllGoals();
    });
    this.props.getMetrics().then(res => {
      const { metrics = [] } = res;
      metrics.map(k => {
        this.props.getMetricsDataByName(k.db_name).then(res => {});
      });
      this.props.getProducts().then(products => {
        this.setState({ apiFetchStarted: false });
        this.props.getVariants(products);
      });
    });
  }

  componentWillReceiveProps(props) {    
    const {data} = props.productData;
    const {updateTableData} = this;
    const {vendors,categories} = props;
    const prevProps = cloneDeep(this.props);

    if (props.userData && Object.keys(props.userData).length > 0) {
      if (typeof this.state.isLightUser === 'undefined') {
        if (props.userData.userPlan !== 'PLUS') {
          const steps = this.state.steps.slice();
          steps[3].description = 'Upgrade to Unlock';
          this.setState({
            steps,
            isLightUser: true
          });
        }
      }
    }

    if (!isEqual(props, prevProps)) {
      this.setState({
        data,
        vendors,
        categories
      }, updateTableData);
    }
  }

  _setTarget = (e) => {
    const re = Number(e.target.value) ? Number(e.target.value) : this.state.goalTarget;
    this.setState({goalTarget: e.target.value}, this.updateCurrentDescription);
  }

  _setTargetKeyPress = (e) => {
    const n =  (this.state.goalTarget == null ? 0 : this.state.goalTarget) + String.fromCharCode(e.which);
    const re = Number(n);

    if (!isEmpty(n) && !isNaN(n) && re >= 0) {

    } else {
      e.preventDefault();
    }
  }

  updateTableData() {
    const {data} = this.state;
    const {tableData} = cloneDeep(this.state);
    let initialData = [];
    const tData = [];
    let index = 0;
    if (!isEmpty(data.products)) {
      initialData = isEmpty(tableData) ? data.products : tableData;
      initialData.map((prod, i) => {
        if (prod.rowType !== VARIANT) {
          prod.id = prod.productId;
          prod.rowType = PRODUCT;
          prod.numVariants = prod.variants.length;
          prod.expanded = prod.variants.length;
          prod.hidden = false;
          prod.index = index;
          tData.push(prod);
          index += 1;
          prod.variants.map((v, i) => {
            const variant = {
              id:           v.variantId,
              rowType:      VARIANT,
              productId:    v.productId,
              productTitle: prod.productTitle,
              variant:      v,
              index
            };
            variant.hidden = !prod.expanded;
            tData.push(variant);
            index += 1;
          });
        }
      });
      this.setState({tableData: tData});
    }
  }

  setMarkup = (newData) => {
    const setmark = this.state.setMark + 1;
    this.setState({
      tableData:         newData,
      setMark:           setmark,
    });
  }

  submitGoal = () => {
    const { onSave } = this;
    const {
      selectedYear,
      selectedMonth,
      selectedMetric,
      goalTarget,
      selectedTab,
      selectedVendors,
      selectedProducts,
      selectedCategories,
      selectedQuarter,
      selectedYearForQuarter,
      start_date,
      end_date,
      selectedTimeFormat,
      data:{products=[],variants=[]}
    } = this.state;
    const {channelData: { data: { shopId } = {} } = {}} =this.props;

    this.props.form.validateFields((err, values) => {
      var goalData =  {};
      var period ={};
      if (selectedTimeFormat === TIME_PERIOD.PER_MONTH) {
        period["year"] = selectedYear;
        period["month"] = selectedMonth;
        goalData["periodFormat"] = TIME_PERIOD.PER_MONTH;
      } else if (selectedTimeFormat === TIME_PERIOD.PER_QUARTER) {
        period["year"] = selectedYearForQuarter;
        period["quarter"] = parseInt(selectedQuarter) + 1;
        goalData["periodFormat"] = TIME_PERIOD.PER_QUARTER;
      } else {
        period['startDate'] = start_date;
        period['endDate'] = end_date;
        goalData["periodFormat"] = TIME_PERIOD.CUSTOM;
      }
      
      if (!err) {
        goalData["name"]= values.name;
        
        goalData["period"] = period;
        goalData["metric"] = selectedMetric.db_name;
        if (selectedTab === CONTEXTS.VENDOR && selectedVendors.length > 0) {
          goalData["contextValue"] = selectedVendors;
          goalData["context"] = selectedTab;
        } else if (selectedTab === CONTEXTS.PRODUCT && selectedProducts.length > 0) {
          const variantIds = variants.map((v) => v.variantId);
          const selectedVariants = selectedProducts.filter((id) => {
            if ( variantIds.indexOf(id) >= 0 ){
              return true;
            }

            return false;
          })
          if (selectedVariants.length > 0) {
            goalData["contextValue"] = selectedVariants;
            goalData["context"] = CONTEXTS.VARIANT;
          }
        } else if (selectedTab === CONTEXTS.CATEGORY && selectedCategories.length > 0) {
          goalData["contextValue"] = selectedCategories;
          goalData["context"] = selectedTab;
        }
        
        goalData["shopId"] = shopId;
        goalData["comparisonOperator"] = ">=";
        goalData["target"]=parseInt(goalTarget);

        if (this.state.isLightUser) {
          goalData["context"] = '';
        }

        onSave(goalData);
      }
    });
  }

  onSave = data => {
    const {
      addGoal,
      afterAdd
    } = this.props;

    this.setState({
      postFetchStarted: true
    });

    addGoal(data).then(res => {
      if (res && res.goalId) {
        successSwAlert('Successfully created the goal').then(() => {
          this.props.history.replace('/dashboard');
          this.setState({
            postFetchStarted: false
          });
        });
      }
    }).catch((res) => {
      this.setState({
        postFetchStarted: false
      });
      errorSwAlert(res.message);
    });
  };


  deSelectAllRows = () => {
    this.setState({
      selectedRows:        [],
      numSelectedVariants: 0
    });
  }

  componentWillUnmount() {
    this.setState({
      current: 0
    });
  }

  
  validateGoalName = (rule, value, callback) => {
    if (value && value.length > 60) {
      callback("Goal name should be max 60 character long");
    } else{ 
      callback();
    }
  };

  _setDescription = (goalSection, selectedDesc, current) => {

    let disableNextButton = true;
    const { selectedMetric, selectedMonth, selectedYear, goalTarget, selectedQuarter, selectedYearForQuarter, start_date, end_date } = this.state;
    const goalSectionT = this.state.steps[current].content;

    switch (goalSectionT) {
      case "firstMetric":
        if (selectedMetric) {
          disableNextButton = false;
        }
        break;

      case "timePeriod":
        if (selectedMonth && selectedYear) {
          disableNextButton = false;
        }

        if (selectedQuarter && selectedYearForQuarter) {
          disableNextButton = false;
        }

        if (start_date && end_date) {
          disableNextButton = false;
        }
        break;

      case "setGoalTarget":
        if (goalTarget) {
          disableNextButton = false;
        }
      break;

      case "ApplyFilter":
        if (true) {

        }
        break;

      default:
        sectionContent = null;
        break;
    }


    this.setState(prevState => ({
      steps: prevState.steps.map(
        sectionSubHead => (sectionSubHead.content === goalSection ?
          Object.assign(sectionSubHead, { description: selectedDesc }) : sectionSubHead)),
      disableNextButton: disableNextButton
    }));
  }

  
  disableNextButton(status) {
    //this.setState({ disableNextButton: status });
  }

  updateCurrentDescription = () => {
    const current = this.state.current;
    const {
      selectedMetric,
      selectedMonth,
      selectedYear,
      goalTarget,
      selectedQuarter,
      selectedYearForQuarter,
      start_date,
      end_date,
      selectedTab,
      selectedVendors,
      selectedProducts,
      selectedCategories,
      data:{products=[],variants=[]}
    } = this.state;
    const goalSection = this.state.steps[current].content;

    switch (goalSection) {
      case "firstMetric":
        if (selectedMetric) {
          this._setDescription(goalSection, selectedMetric.title, current);
        } else {
          this._setDescription(goalSection, '', current);
        }
        break;

      case "timePeriod":
        if (selectedMonth && selectedYear) {
          let timePeriodDesc = MONTHS[selectedMonth - 1] + ' ' + selectedYear.toString();
          this._setDescription(goalSection, timePeriodDesc, current);
        } else if (selectedQuarter && selectedYearForQuarter) {
          let timePeriodDesc = QUARTER_MONTHS[selectedQuarter] + ' ' + selectedYearForQuarter;
          this._setDescription(goalSection, timePeriodDesc, current);
        } else if (start_date && end_date) {
          let timePeriodDesc = start_date.format('MM/DD/YYYY') + ' - ' + end_date.format('MM/DD/YYYY');
          this._setDescription(goalSection, timePeriodDesc, current);  
        } else {
          this._setDescription(goalSection, '', current);
        }
        break;

      case "setGoalTarget":
        if (goalTarget) {
          let goaltargetVal = TARGET_CONDITIONS + ' ' + selectedMetric.prefix + goalTarget +  selectedMetric.postfix;
          this._setDescription(goalSection,goaltargetVal, current);
        } else {
          this._setDescription(goalSection, '', current);
        }
      break;

      case "ApplyFilter":
          let filterTargetVal = '';
          if (selectedTab === CONTEXTS.VENDOR && selectedVendors.length > 0) {
            filterTargetVal = selectedVendors.length + ' vendors selected';
            this._setDescription(goalSection,filterTargetVal, current);
          } else if (selectedTab === CONTEXTS.PRODUCT && selectedProducts.length > 0) {
            const variantIds = variants.map((v) => v.variantId);
            const selectedVariants = selectedProducts.filter((id) => {
              if ( variantIds.indexOf(id) >= 0 ){
                return true;
              }
  
              return false;
            })
            filterTargetVal = selectedVariants.length + ' variants selected';
            this._setDescription(goalSection,filterTargetVal, current);
          } else if (selectedTab === CONTEXTS.CATEGORY && selectedCategories.length > 0) {
            filterTargetVal = selectedCategories.length + ' categories selected';
            this._setDescription(goalSection,filterTargetVal, current);
          } else {
            this._setDescription(goalSection, '', current);
          }
        break;

      default:
        break;
    }
  }

  next = ()=> {
    const current = this.state.current + 1;
    this.setState({ current }, this.updateCurrentDescription);
  }

  prev =()=> {
    const current = this.state.current - 1;
    this.setState({ current }, this.updateCurrentDescription);
  }

  LockedItem = ({}) => {
    return (
      <div style={{ paddingTop: 35 }}>
        <div className="flex col align-center justify-center">
          {lockWidgetIcon}
          <p style={{ fontSize: 9, marginTop: "3%", color: "#c8c8e8", }}>UPGRADE TO UNLOCK</p>
        </div>
      </div>
    )
  }

  getGoalSection = (goalSection) => {
    let sectionContent = null;
    const { SelectMetric, SetTimePeriod, SetGoalTarget,FilterProductScreen } = this;
    switch (goalSection) {
      case "firstMetric":
        sectionContent = <SelectMetric />;
        break;

      case "timePeriod":
        sectionContent = <SetTimePeriod />;
        break;

      case "setGoalTarget":
        sectionContent = <SetGoalTarget />;
        break;

      case "ApplyFilter":
        sectionContent = <FilterProductScreen/>;
        break;

      default:
        sectionContent = null;
        break;
    }
    return sectionContent;
  };

  setTableHead = (selectedTablegHead) => {
  if(selectedTablegHead.length >= 0){
    this.setState({ selectedTablegHead }, this.updateCurrentDescription)
    }
  }
  setSelectedVendors = (selectedVendors) => {
    if(selectedVendors.length >= 0){
      this.setState({selectedVendors:selectedVendors}, this.updateCurrentDescription)
    }
  }

  setSelectedCategories = (selectedCategories) =>{
    if(selectedCategories.length >= 0){
      this.setState({selectedCategories:selectedCategories}, this.updateCurrentDescription)
    }
  }

  changeFilter = (name) => {
    this.setState({selectedTab:name,selectedCategories:[],selectedProducts:[],selectedVendors:[]});
  }

  showFilter = (filterName) => {
    const {tableData, loading, selectedRows, numSelectedVariants,
      hideCompleted, searchTerm,vendors,categories,selectedCategories,selectedVendors,selectedProducts} = this.state;
      const {setSelectedVendors,setSelectedCategories,setSelectedProducts} = this;
      
    var filterContent = null
    switch (filterName) {
      case CONTEXTS.VENDOR:
      filterContent = <FilterVendors 
        tableData={tableData} 
        vendors={vendors} 
        selectedVendors={selectedVendors}
        setSelectedVendors = {setSelectedVendors}
        setTableHead={this.setTableHead}/>;
        break;

      case CONTEXTS.PRODUCT:
        filterContent = <FilterProduct
          tableData={tableData}
          loading={loading}
          hideCompleted={hideCompleted}
          selectedRows={selectedProducts}
          numSelectedVariants={numSelectedVariants}
          searchTerm={searchTerm}
          updateParentState={setSelectedProducts}/>;
      break;

      case CONTEXTS.CATEGORY:
        filterContent = <CategoriesFilter 
          tableData={tableData} 
          categories={categories} 
          setSelectedCategories={setSelectedCategories}
          selectedCategories={selectedCategories}
        />
        break;

      case CONTEXTS.CUSTOMER:
      filterContent = "Customer Filter";
        break;

      default:
      filterContent = null;
        break;
    }
    return filterContent;
  }

  setMetric = (metric) => {
    if (metric) {
      this.setState({ selectedMetric: metric }, () => {this.updateCurrentDescription()});
    }
  };

  removeTags = (tagId) => {
    var {selectedTablegHead} = this.state;
    var updatedTag = selectedTablegHead.filter(( obj ) => {return obj.id !== tagId});
    this.setState({selectedTablegHead:updatedTag}, this.updateCurrentDescription)
  }
  getMetricOption = () => {
    const { metrics = [] } = this.props;
    const { allowedMetrics = [] } = this.props.goalsConfig ? this.props.goalsConfig:{};
    var { selectedMetric } = this.state;
    let validMetrics = metrics.map((value, index) => {
      const { db_name = "" } = value;
      const metricType = db_name;
      value.isAllowed = allowedMetrics.indexOf(metricType) >=0;
      return value;
    });

    validMetrics = validMetrics.filter(value => {
      if (value.db_name !== 'expenses') {
        return true;
      } else {
        return false;
      }
    })

    return validMetrics.map(value => {
      const { db_name, title, isAllowed } = value;
      
      return (
        <Col
          sm={4} style={{ paddingTop: 20, cursor: "pointer" }}
          key={db_name}
        >
          {isAllowed ?
            <Card style={{ height: 100, width: '100%' }}
              className={[selectedMetric.db_name === db_name && "selectedBlock", 'full-width-card']}
              onClick={() => this.setMetric(value)}>
              <div className="flex w100 h100 align-center" style={{textAlign:'left'}}>
                <span className="metricsTitle">{title}</span>
              </div>
            </Card>
            :
            <Card className={"lockedCards full-width-card"} style={{height: 100, width: '100%'}}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className={"lockedTitle metricsTitle pb5"}>{title}</span>
                <div className="flex col align-center">
                  <img alt="" style={{ width: 35, height: 35 }} src={lockIcon}></img>
                  <p className="lockedIconText">UPGRADE TO UNLOCK</p>
                </div>
              </div>
            </Card>
          }
        </Col>
      );
    });
  };

  selectTimePeriod = (selectedTime) => {
    this.setState({
      selectedTimeFormat: selectedTime
    })
  }

  removeVendors = (vendorId) => {
    const {selectedVendors} = this.state;
    const newVendors = selectedVendors.filter((vendor)=>{
      return vendor !== vendorId
    })
    this.setState({selectedVendors:newVendors}, this.updateCurrentDescription);
  }

  removeCategories = (categoryId) => {
    const {selectedCategories} = this.state;
    const newCategories = selectedCategories.filter((category)=>{
      return category !== categoryId
    })
    this.setState({selectedCategories:newCategories}, this.updateCurrentDescription);
  }

  removeProduct = (productId) => {
    const {data:{products=[],variants=[]},selectedProducts} = this.state;
    const product = find(products,{
      productId
    });

    if(product){
      const allVariants = product.variants.map(val=>{
        return val.variantId;
      })
      
      
      const  newSelectedProducts = selectedProducts.filter(val=>{
          if (productId === val){
            return false;
          }
          if(allVariants.indexOf(val)>=0){
              return false;
          }
          return true;
      })
      this.setState({selectedProducts:newSelectedProducts}, this.updateCurrentDescription);
    }
  }

  removeVariant = variantId=>{
    const {selectedProducts} = this.state;
    const newSelectedProducts = selectedProducts.filter(val=>{
      if(val === variantId){
        return false;
        //remove product id too if this variant is single entry
      }
      return true;
    });
    this.setState({selectedProducts:newSelectedProducts}, this.updateCurrentDescription);

  }

  getSelectedEntities = ()=>{
    const {selectedTab,selectedVendors=[],categories,vendors,selectedCategories=[],selectedProducts=[],data:{products=[],variants=[]}} = this.state;
    const {removeVendors,removeCategories,removeProduct,removeVariant} = this;
    switch(selectedTab){
      case CONTEXTS.VENDOR:
      { 
        return selectedVendors.length >=0 ? selectedVendors.map((val) => {
          const current = vendors.filter(vendor=>{
            return val === vendor.id;
          })
          const tag = current[0];

          return (
            <Col sm={2} key={val}  style={{display:"flex",justifyContent:"space-between",cursor:"pointer",paddingRight:7}}
              className="filter_tag" onClick={()=>removeVendors(val)}>
              <h5 style={{paddingTop:5,borderRight:"1px solid #d4cfcf", paddingRight:7}}>{tag.title}</h5>
              <span style={{margin:"auto 0px",paddingLeft:6}}>{CrossIcon}</span>
            </Col>
          );
        }):null
      }
      case CONTEXTS.CATEGORY:{
        
        return selectedCategories.length >=0 ? selectedCategories.map((val)=>{
          const current = categories.filter(category=>{
            return val === category.id;
          })
          const tag = current[0];
          return (
            <Col sm={2} key={val}  style={{display:"flex",justifyContent:"space-between",cursor:"pointer",paddingRight:7}}
              className="filter_tag" onClick={()=>removeCategories(val)}>
              
              <h5 style={{paddingTop:3,borderRight:"1px solid #d4cfcf", paddingRight:7}}>{tag.title}</h5>
              <span style={{margin:"auto 0px",paddingLeft:6}}>{CrossIcon}</span>
            
            </Col>
          )
      }):null
      }
    case CONTEXTS.PRODUCT:
    {
      let filtertags = [];
      const selectedProductsOnly = selectedProducts.filter(val=>{
        const isAvailable = find(products,{
          productId:val
        })
        if(isAvailable){
          return true;
        }
        return false;
      });

      selectedProductsOnly.forEach(productId=>{
        const product = find(products,{
          productId:productId
        })
        if(product){
          const {productId,variants = [],productTitle=""} = product;
          const variantList = variants;
          const selectedVariants = variantList.filter(val=>{
            return selectedProducts.indexOf(val.variantId) >= 0;
          }) 
          // console mark
          selectedVarientData = selectedVariants.length;
          if(variantList.length === selectedVariants.length){
            filtertags.push(<Col sm={2} key={productId} 
            style={{display:"flex",justifyContent:"space-between",cursor:"pointer",paddingRight:10}}
            className="filter_tag" onClick={()=>removeProduct(productId)}>
            <div style={{paddingTop:3,borderRight:"1px solid #d4cfcf", paddingRight:7}}>
            <LinesEllipsis text={productTitle}
              maxLine="1"
              ellipsis=" ..."
              trimRight
              basedOn="letters"></LinesEllipsis><div>(All variants)</div></div>
            <span style={{margin:"auto 0px",paddingLeft:6}}>{CrossIcon}</span>
            </Col>)
          } else {
            selectedVariants.forEach(variant=>{
              const {variantId,variantTitle} = variant;
              filtertags.push(<Col sm={2} key={variantId}  style={{display:"flex",justifyContent:"space-between",cursor:"pointer"}}
              className="filter_tag" onClick={()=>removeVariant(variantId)}>
                <div style={{paddingTop:3,borderRight:"1px solid #d4cfcf", paddingRight:7}}>
                <LinesEllipsis text={productTitle}
                maxLine="1"
                ellipsis=" ..."
                trimRight
                basedOn="letters"></LinesEllipsis><div>{`(${variantTitle})`}</div></div>
                <span style={{margin:"auto 0px",paddingLeft:6}}>{CrossIcon}</span>
              </Col>)
            });
          }
        }
      })
  
        return filtertags;
    }
    
      default: return null;
    }
  }

  getApplyFiltersDescription = () => {
    const {selectedTab} = this.state;
    
    if (selectedTab === CONTEXTS.VENDOR) {
      return 'Select all the vendors you would like to consider for this goal';
    } else if (selectedTab === CONTEXTS.PRODUCT) {
      return 'Select all the products or variants you would like to consider for this goal';
    } else if (selectedTab === CONTEXTS.CATEGORY) {
      return 'Select all the categories you would like to consider for this goal';
    } else {
      return '';
    }
  }

  FilterProductScreen = ({}) => {
    const {selectedTab, selectedMetric } = this.state;
    const {getSelectedEntities} = this;
    const {goalsConfig} = this.props;
    // const FilterTab = this.props.goalsConfig.allowedContext[selectedMetric.db_name];

    const allowedContext = goalsConfig.allowedContexts[selectedMetric.db_name];

    const ALLOWED_FILTERS = FILTERTABS.filter((v) => {
      return allowedContext.indexOf(v) >= 0;
    });

    return(
      <div className={'pr45'}>
        <div style={{ paddingBottom: 69, paddingTop: 50 }}>
          <h4 className="font24 tac">Apply filters</h4>
        </div>
        <div style={{ display: "flex" }}>
          <Radio.Group defaultValue={selectedTab} buttonStyle="solid">
            {
              ALLOWED_FILTERS.map((name, index) => {
                return (
                  <Radio.Button key={`tab-${index}`} value={name} 
                  onClick={()=>this.changeFilter(name)}>{name}</Radio.Button>
                )
              })
            }
          </Radio.Group>
        </div>
        {ALLOWED_FILTERS.indexOf(selectedTab) >=0 &&
        <div className="filter-product">
          <div className="filter-product-header" style={{height:"auto"}}>
            <h5 style={{textAlign:"left",marginBottom:20}}>{this.getApplyFiltersDescription()}</h5>
            <div>
              <Row>
              { getSelectedEntities() }
              </Row>
            </div>
          </div>
          {this.showFilter(selectedTab)}
        </div>
        }
      </div>
    )
  }

  SelectMetric = ({ }) => {
    return <Row className={'mr15'}>
      <Row style={{ paddingBottom: 70, paddingTop: 50, textAlign: 'center' }}><h4 className="font24 tac">Select a metric to track</h4></Row>
      {this.getMetricOption()}
    </Row>;
  };

  resetTimeFormat = () => {
    this.setState({
      selectedMonth: undefined,
      selectedYear: undefined,
      selectedQuarter: undefined,
      selectedYearForQuarter: undefined,
      start_date: undefined,
      end_date: undefined,
    });
  }

  handleMonthChange = (month) => {
    if (this.state.selectedTimeFormat !== TIME_PERIOD.PER_MONTH){
      this.resetTimeFormat();
      this.selectTimePeriod(TIME_PERIOD.PER_MONTH);
    }
    this.setState({selectedMonth: month}, this.updateCurrentDescription);
  }

  handleQuarterChange = (quarter) => {
    if (this.state.selectedTimeFormat !== TIME_PERIOD.PER_QUARTER) {
      this.resetTimeFormat();
      this.selectTimePeriod(TIME_PERIOD.PER_QUARTER);
    }

    this.setState({selectedQuarter: quarter}, this.updateCurrentDescription);
  }

  handleYearChange = (year) => {
    if (this.state.selectedTimeFormat !== TIME_PERIOD.PER_MONTH){
      this.resetTimeFormat();
      this.selectTimePeriod(TIME_PERIOD.PER_MONTH);
    }
    this.setState({selectedYear: year}, this.updateCurrentDescription);
  }

  handleQuarterYearChange = (year) => {
    if (this.state.selectedTimeFormat !== TIME_PERIOD.PER_QUARTER){
      this.resetTimeFormat();
      this.selectTimePeriod(TIME_PERIOD.PER_QUARTER);
    }
    this.setState({selectedYearForQuarter: year}, this.updateCurrentDescription);
  }

  handleStartDateChange = (date) => {
    if (this.state.selectedTimeFormat !== TIME_PERIOD.CUSTOM){
      this.resetTimeFormat();
      this.selectTimePeriod(TIME_PERIOD.CUSTOM);
    }
    this.setState({ start_date: date  }, this.updateCurrentDescription);
  }

  handleEndDateChange = (date) => {
    if (this.state.selectedTimeFormat !== TIME_PERIOD.CUSTOM){
      this.resetTimeFormat();
      this.selectTimePeriod(TIME_PERIOD.CUSTOM);
    }
    this.setState({ end_date: date }, this.updateCurrentDescription);
  }
  
  disabledStartDate = (current) => {
    // Can not select days before today and today
    return current < moment().subtract(1, 'day').endOf('day');
  }

  disabledEndDate = (current) => {
    // Can not select days before start_date
    const is_greater_than_start_date = current < moment().subtract(1, 'day').endOf('day');

    return is_greater_than_start_date;
  }

  renderPerMonthCard = () => {
    var { allowedPeriod = [] } = this.props.goalsConfig;
    var {LockedItem} = this;
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const selectedYear = this.state.selectedYear;

    if (!allowedPeriod.includes("PER_MONTH")) {
      return (
        <Card className="card_disabled timeCard" disabled>
          <h4 className="timeline_card_title"> MONTH</h4>
          <LockedItem />
        </Card>
      );
    }

    return (
      <Card className={ ["timeCard", this.state.selectedTimeFormat === TIME_PERIOD.PER_MONTH && 'selectedBlock' ] }>
        <h4 className="timeline_card_title">MONTH</h4>
        <Row>
          <div>
            <Select
              style={{ marginBottom: 33 }}
              placeholder="Year"
              onChange={this.handleYearChange}
              value={selectedYear}
            >
              {
                this.years.map((year, index) => {
                  return (
                    <Option key={`year${index}`} value={ year + '' }>{year}</Option>
                  )
                })
              }
            </Select>
          </div>
        </Row>
        <Row>
          <div>
            <Select disabled ={!allowedPeriod.includes(TIME_PERIOD.PER_MONTH)}
              placeholder="Month"
              disabled={!selectedYear}
              onChange={this.handleMonthChange}
              value={this.state.selectedMonth}
              >
              {
                MONTHS.map((name, index) => {
                  if (Number(selectedYear) === currentYear) {
                    if (index >= currentMonth) {
                      return (
                        <Option key={`year-${selectedYear}-month${index}`} value={(index + 1) + ''}>{name}</Option>
                      );
                    } else {
                      return null;
                    }
                  } else {
                    return (
                      <Option key={`year-${selectedYear}-month${index}`} value={(index + 1) + ''}>{name}</Option>
                    );
                  }
                })
              }
            </Select>
          </div>
        </Row>
      </Card>
    );
  }

  renderPerQuarterCard = () => {
    var { allowedPeriod = [] } = this.props.goalsConfig;
    var {LockedItem} = this;
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentQuater = Math.ceil((currentMonth+1)/3) - 1;
    const currentYear = date.getFullYear();
    const selectedYear = this.state.selectedYearForQuarter;

    if (!allowedPeriod.includes(TIME_PERIOD.PER_QUARTER)) {
      return (
        <Card className="card_disabled timeCard">
          <h4 className="timeline_card_title">QUARTER</h4>
          <LockedItem />
        </Card>
      );
    }

    return (
      <Card className={ ["timeCard", this.state.selectedTimeFormat === TIME_PERIOD.PER_QUARTER && 'selectedBlock' ] }>
        <h4 className="timeline_card_title">QUARTER</h4>
            <Row>
              <div>
                <Select
                  style={{ marginBottom: 33 }}
                  placeholder="Year"
                  onChange={this.handleQuarterYearChange}
                  value={selectedYear}
                >
                  {
                    this.years.map((year, index) => {
                      return (
                        <Option key={`year${index}`} value={year + ''}>{year}</Option>
                      )
                    })
                  }
                </Select>
              </div>
            </Row>
            <Row>
              <div>
                <Select
                  name={"Per Quarter"}
                  placeholder="Quarter"
                  onChange={this.handleQuarterChange}
                  disabled={!selectedYear}
                  value={this.state.selectedQuarter}
                >
                  {
                    QUARTER_MONTHS.map((name, index) => {
                      if ( Number(selectedYear) === currentYear ) {
                        if (index >= currentQuater) {
                          return (
                            <Option key={`year-${selectedYear}-quarter${name}`} value={index + ''}>{QUARTER_MONTHS[index]}</Option>
                          )
                        } else {
                          return null;
                        }
                      } else {
                        return (
                          <Option key={`year-${selectedYear}-quarter${name}`} value={index + ''}>{QUARTER_MONTHS[index]}</Option>
                        )
                      }
                    })
                  }
                </Select>
              </div>
            </Row>
      </Card>
    );
  }

  renderCustomTimeCard = () => {
    var { allowedPeriod = [] } = this.props.goalsConfig;
    var {LockedItem} = this;
    const date = new Date();
    const currentMonth = date.getMonth();
    if (!allowedPeriod.includes(TIME_PERIOD.CUSTOM)) {
      return (
        <Card className="card_disabled timeCard">
          <h4 className="timeline_card_title">CUSTOM</h4>
          <LockedItem />
        </Card>
      );
    }

    return (
      <Card className={ ["timeCard", this.state.selectedTimeFormat === TIME_PERIOD.CUSTOM && 'selectedBlock' ] }>
        <h4 className="timeline_card_title">CUSTOM</h4>
            <Row style={{marginBottom: 33}}>
              <div>
                  <DatePicker
                    suffixIcon={calendar}
                    onChange={this.handleStartDateChange}
                    disabled={false}
                    placeholder="START DATE"
                    value={this.state.start_date}
                    format={'MM/DD/YYYY'}
                  />
              </div>
            </Row>

            <Row>
              <div>
                  <DatePicker
                    suffixIcon={calendar}
                    disabled={false}
                    disabledDate={this.disabledEndDate}
                    onChange={this.handleEndDateChange}
                    placeholder="END DATE"
                    value={this.state.end_date}
                    format={'MM/DD/YYYY'}
                  />
              </div>
            </Row>
      </Card>
    );
  }

  TimeCards = ({}) => {
    var { allowedPeriod = [] } = this.props.goalsConfig;
    var {LockedItem} = this;
    return(
      <Row className={'mr15'}>
      <Col sm={4}>
        {this.renderPerMonthCard()}
      </Col>

      <Col sm={4}>
          {this.renderPerQuarterCard()}
      </Col>
      <Col sm={4}>
        {this.renderCustomTimeCard()}
      </Col>
    </Row>
    )
  }


  SetTimePeriod = ({ }) => {
    var { LockedItem, TimeCards} = this;
    return (
      <div>
        <div style={{ paddingBottom: 69, paddingTop: 50 }}>
          <h4 className="font24 tac">Select time period</h4>
        </div>
        {<TimeCards/>}
      </div>
    );
  };

  SetGoalTarget = ({ }) => {
    var { selectedMetric } = this.state;
    var {Target} = this;
    return (
      <div >
        <Row style={{ paddingBottom: 69, paddingTop: 50 }}>
          <h4 className="font24 tac">Set goal target</h4>
        </Row>
        <Row>
          <Col sm={4}></Col>
          <Col sm={4}>
            <Card className="timeCard selectedBlock">
              <h4 className="timeline_card_title" style={{ paddingBottom: 55 }}>{this.state.selectedMetric.title || ""}</h4>
              <h3 className="tac" style={{ color: "#4688ff", marginBottom: 48, fontSize: 36 }}>{TARGET_CONDITIONS}</h3>
              <Row>
                <div className="addtarget align-center flex justify-content-center row">
                  <span className="dollerIcon">{selectedMetric.prefix}</span>
                  <Input size="large" className="target_input" placeholder="goal target" type={'number'} min="0" value={this.state.goalTarget} onKeyPress={this._setTargetKeyPress} onChange={this._setTarget}/> 
                  <span className="percent">{selectedMetric.postfix}</span></div>
              </Row>
            </Card>
          </Col>
          <Col sm={4}></Col>
        </Row>
      </div>
    );
  }

  validateTarget =(rule, value, callback)=>{
    let targetValue = value;
    if (targetValue && !Number.isNaN(targetValue)) {
      if(targetValue > 0){
      this.setState({targetValue},()=>this.disableNextButton(false));
      this.props.form.setFieldsValue({
        "target": targetValue,
      });
      callback();
    }else {
      callback ("not valid value")
      }
    }
  }

  Target = ({}) => (
    <FormItem className="target" label="">
      {this.props.form.getFieldDecorator("target", {
        rules: [{
            required: true,
            message: "Enter target value"
          },
          {
            validator: this.validateTarget,
          }
        ],
      })(<Input placeholder="TARGET" style={{height:59}}/>)}
    </FormItem>
  );

  GoalName = ({goalNameError}) =>  (
    <FormItem label="">
      {this.props.form.getFieldDecorator(GOAL_NAME, {
        rules: [
          {
            required: true,
            message: "Enter your goal name"
          },
          {
            validator: this.validateGoalName,
          }
        ],
      })(
        <Input className="goal-name tac dark br0"
          placeholder="give a short name for your goal"/>
      )}
    </FormItem>
  );

  onBack = (e) => {
    swalert().then((isConfirm) => {
      if (isConfirm.value) {
        this.onConfirm();
      }
    });
  };

  onConfirm = () => {
    this.props.history.push(routeConstants.dashboard);
  }

  setSelectedProducts = (selection)=>{
    const { selectedRows = [] } = selection;
    this.setState({selectedProducts: selectedRows}, this.updateCurrentDescription);
  }


  renderCustomDot = (dot, { status, index }) => {
    if (index === 3) {
      if (this.state.isLightUser) {
        return (
          <div className="ant-style-dot-locked">
            <img alt="" style={{ width: 20, height: 20 }} src={lockIcon}></img>
          </div>
        );
      } 
    }

    if (status === 'finish') {
      return (
        <div className="ant-style-dot-finish">
          <img alt="" style={{ width: 20, height: 20 }} src={checkIcon}></img>
        </div>
      );
    }

    if (status === 'process') {
      return (
        <div className="ant-style-dot-process">
          <div></div>
        </div>
      );
    }

    if (status === 'wait') {
      return (
          <div className="ant-style-dot-wait"></div>
      );
    }

    return (
      <div>
        {dot}
      </div>
    );
  }

  render() {
    const { current, steps } = this.state;
    const { data = {} } = this.props;
    const { GoalName } = this;
    const {getFieldError,isFieldTouched} = this.props.form;
    var goalNameError = isFieldTouched(GOAL_NAME) && getFieldError(GOAL_NAME);


    if (this.state.apiFetchStarted) {
      return (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Spin size="large" />
        </div>
      );
    }

    return (
      <Grid className="page-container">
        <div className="add-goal-box">
          <div className="addgoal-header">
            <Row className={'w100'}>
              <Col className="goal-name-field field-col" xs={12} sm={12} md={12} lg={12}>
                <Col sm={3} className="p0">
                  <span onClick={this.onBack} className={'pl15'} style={{ cursor: "pointer" }}>{backArrowIcon}</span>
                </Col>
                <Col sm={6} className={'pl0 mln15'}>
                  <GoalName goalNameError={goalNameError}/>
                </Col>
              </Col>
            </Row>
          </div>
          <div className="addgoal-body">
            <Row className={'h100'}>
              <Col sm={3} className={'h100'}>
              <div className="goal-heading">
                <span className="head-text bold">DEFINE YOUR GOAL</span>
              </div>
                <div className="goal-step h100">
                  <div>
                    <Steps current={current} progressDot={this.renderCustomDot} direction="vertical">
                      {steps.map((item, index) => {
                        return (
                          <Step
                            key={item.title}
                            title={item.title}
                            className={'bold'}
                            description={item.description} />
                        );
                      })}
                    </Steps>
                  </div>
                </div>
              </Col>
              <Col sm={9}>
                <div className="steps-content">
                  {current >= 0 && this.getGoalSection(steps[current].content)}
                </div>
              </Col>
            </Row>
          </div>
          <div className="addgoal-footer bg-pale">
            <Row className={'h100 w100 ml0'}>
              <Col md={3} className={'p0 h100 '}> 
                <div className={'h100 bg-white'} style={{marginRight: 22, borderRight: '1px solid #c8c8e8'}}></div>
              </Col>
              <Col md={7} className={'bg-pale h100 flex row alig-center justify-flex-start'}>
                {current > 0 && (
                  <span className={'flex col align-center justify-content-center'}>
                    <img
                      alt="!"
                      src={backArrow}
                      style={{
                        width: 28,
                        height: 28,
                        marginTop: 17,
                        cursor: "pointer"
                      }}
                      onClick={() => this.prev(steps[current].content)}
                    />
                    <p className="dark">Prev</p>
                  </span>
                )}
              </Col>

              <Col md={2} className={'bg-pale h100 flex row align-center justify-flex-end'}>
                {
                  ( (!this.state.isLightUser && current < steps.length - 1) || (this.state.isLightUser && current < steps.length - 2)) && (
                  <span className={'float-right'}>
                    {
                      !this.state.disableNextButton ?
                        <img
                          alt="!"
                          src={backArrow}
                          style={{
                            width: 28,
                            height: 28,
                            marginTop: 17,
                            transform: "scale(-1, -1)",
                            cursor: "pointer"
                          }}
                          onClick={() => this.next(steps[current].content)}
                        />
                        : <img
                          alt="!"
                          src={backArrow}
                          style={{
                            width: 28,
                            height: 28,
                            marginTop: 17,
                            opacity: 0.6,
                            transform: "scale(-1, -1)",
                            cursor: "not-allowed"
                          }}
                        />
                    }

                    <p className="dark">Next</p>
                  </span>
                )}
                {( ((!this.state.isLightUser && current === steps.length - 1) || (this.state.isLightUser && current === steps.length - 2)) )  && (
                  <Button
                    className="finish_button float-right"
                    disabled={this.state.postFetchStarted}
                    onClick={() => this.submitGoal()}>Finish
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </div>
      </Grid>
    );
  }
}
const WrappedGoalForm = Form.create({ name: "goal_form" })(AddGoalPage);
export default WrappedGoalForm;