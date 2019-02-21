import React, { Component } from 'react';
import { Row, Col, Label, Button, Image, DropdownButton } from 'react-bootstrap';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import 'antd/lib/select/style'
import 'antd/lib/input/style'
import { Calendar } from 'react-date-range';
import style from '../styles/global/variables.scss'
import isEqual from "lodash/isEqual"
import dropdownIcon from '../assets/images/dropDownIcon.svg';

const moment = require('moment');
// const mainThemeColor = style.mainBlueColor
const {Option} = Select;

class CustomRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:           false,
      rangeType:      'Custom',
      startDate:      '',
      endDate:        '',
      startDateInput: '',
      endDateInput:   '',
      selectedRange:  ''
    };
    // Preserve initial state
    this.initialState = this.state;

    this.handleToggle = this.handleToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectRange = this.selectRange.bind(this);
    this.validateEndDate = this.validateEndDate.bind(this);
    this.validateStartDate = this.validateStartDate.bind(this);
  }
  componentWillReceiveProps(nextProps) {
	  // TODO: This is not the best want to handle this sort of cases. Ideally,
	  // the state should move up and passed down as props.
    const range = nextProps.defaultRange;    
    if(!isEqual(this.props.defaultRange,nextProps.defaultRange)){
    if (range.start && range.end && (moment(range.start) !== this.state.startDate || moment(range.end) !== this.state.endDate)) {
      this.setState({
        startDate:      moment(range.start).utc(),
        endDate:        moment(range.end).utc(),
        startDateInput: range.start ? moment(range.start).format('YYYY-MM-DD') : '',
        endDateInput:   range.end ? moment(range.end).format('YYYY-MM-DD') : '',
        selectedRange:  `${moment(range.start).format('DD-MMM-YYYY')} to ${moment(range.end).format('DD-MMM-YYYY')}`,
      });
    }
  }
	  if (nextProps.customRangeShouldClear === true) {
		  this.setState(this.initialState);
		  if (this.props.afterCustomRangeClear) {
        this.props.afterCustomRangeClear();
		  }
	  }
  }
  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }
  handleSubmit() {
    let valid = true;
    const {startDate, endDate} = this.state;
  
    if (!startDate) {
      alert('Please select start date');
      valid = false;
    }
    if (!endDate) {
      alert('Please select end date');
      valid = false;
    }
    if (valid) {
      this.handleToggle();
      this.setState({
        selectedRange: `${moment(startDate).format('DD-MMM-YYYY')} to ${moment(endDate).format('DD-MMM-YYYY')}`
      });      
	  if (this.props.onTimeframeChange) {
		  this.props.onTimeframeChange(startDate, endDate);
	  }
    }
  }
  selectRange(value) {
    let startDate = '';
    let endDate = '';
    if (value === 'This Month') {
      startDate = moment.utc().date(1);
      endDate = moment.utc();
    } else if (value === 'Last Month') {
      startDate = moment.utc().month(moment().get('month') - 1).date(1);
      endDate = moment.utc().date(0);
    } else if (value === 'This Year') {
      startDate = moment.utc().month(0).date(1);
      endDate = moment.utc();
    } else if (value === 'Last Year') {
      startDate = moment.utc().year(moment().get('year') - 1).month(0).date(1);
      endDate = moment.utc().month(0).date(0);
    } else if (value === 'Custom') {
      startDate = this.state.startDate;
      endDate = this.state.endDate;
    } else {
    }
    this.setState({
      startDate,
      endDate,
      startDateInput: startDate ? moment(startDate).utc().format('YYYY-MM-DD') : '',
      endDateInput:   endDate ? moment(endDate).utc().format('YYYY-MM-DD') : '',
      rangeType:      value
    });
  }
  validateEndDate(e) {
    const val = e.target.value;
    if (moment(val, 'YYYY-MM-DD', true).isValid()) {
      this.setState({
        endDate: moment(val)
      });
    } else {
      this.setState({
        endDateInput: '',
        endDate:      ''
      });
    }
  }
  validateStartDate(e) {
    const val = e.target.value;
    if (moment(val, 'YYYY-MM-DD', true).isValid()) {
      this.setState({
        startDate: moment(val)
      });
    } else {
      this.setState({
        startDateInput: '',
        startDate:      ''
      });
    }
  }
  render() {
    const {startDate, endDate, startDateInput, endDateInput, rangeType, selectedRange} = this.state;    
    return (
      <div>
        <div className="calender-btn" onClick={this.handleToggle}>
          <i className="fa fa-calendar" aria-hidden="true" />
          <span style={{fontSize:'16px', fontWeight:'500'}}>{selectedRange || ''}</span>
          <span style={{paddingLeft:'8px'}}><img style={{marginBottom:'8px',height:'16px',width:'16px'}} src={dropdownIcon}></img></span>
        </div>
        <div className="explore-datepicker" style={this.state.open ? {display: 'block'} : {display: 'none'}}>
          <div className="custom-dropdown-view">
            <span className="dd-lable">Date Range:</span>
            <span>
              <Select value={this.state.rangeType} onClick={this.handleToggle} onChange={this.selectRange}>
                <Option value="">Select</Option>
                <Option value="This Month">This Month</Option>
                <Option value="Last Month">Last Month</Option>
                <Option value="This Year">This Year</Option>
                <Option value="Last Year">Last Year</Option>
                <Option value="Custom">Custom</Option>
              </Select>
            </span>
          </div>
          <div className="custom-dropdown-view">
            <div style={{width: '50%'}} className="pull-left padding-r-7">
              <span className="dd-lable">Starting:</span>
              <span>
                <Input placeholder="YYYY-MM-DD" value={moment(startDateInput).format('DD-MMM-YYYY')}   />
              </span>
              {rangeType === 'Custom' ? <span className="calender-container">              
                <Calendar
                  date={this.state.startDate}
                  onChange={(date) => this.setState({
                    startDate:      moment(date),
                    startDateInput: moment(date).format('YYYY-MM-DD')
                  })}
                  maxDate={new Date()}

                />
              </span> : null}
            </div>
            <div style={{width: '50%'}} className="pull-left padding-l-7">
              <span className="dd-lable">Ending:</span>
              <span>
                <Input placeholder="YYYY-MM-DD" value={moment(endDateInput).format('DD-MMM-YYYY')}  />
              </span>
              {rangeType === 'Custom' ? <span className="calender-container">
                <Calendar
                  date={this.state.endDate}
                  onChange={(date) => this.setState({
                    endDate:      moment(date),
                    endDateInput: moment(date).format('YYYY-MM-DD')
                  })}
                  maxDate={new Date()}
                  
                />
              </span> : null}
            </div>
          </div>
          <div className="custom-dropdown-view rangepicker-footer">
            <hr />
            <br />
            <Button className="login-button pull-left" onClick={this.handleToggle}>CANCEL</Button>
            <Button className="login-button pull-right" onClick={this.handleSubmit}>SAVE</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomRangePicker;
