import React, { Component } from 'react';
import { Row, Col, Label, Button, Image, DropdownButton } from 'react-bootstrap';
import { Select, Input } from 'antd';
import { defaultRanges, Calendar, DateRange } from 'react-date-range';
import { isEmpty } from 'lodash';
import swal from 'sweetalert';
import styles from '../constants/styles';

const moment = require('moment');

const {Option} = Select;

class CustomRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      defaultValue: '',
      startDate: '',
      endDate: '',
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectRange = this.selectRange.bind(this);
  }
  handleToggle() {
    this.setState({
      open: !this.state.open
    }, () => {
      if (!this.state.open) {
        this.setState({
          defaultValue: '',
          startDate: '',
          endDate: ''
        });
      }
    });
  }
  handleSubmit() {
    let valid = true;
    const {startDate, endDate} = this.state;
    if (isEmpty(startDate)) {
      alert('Please select start date');
      valid = false;
    }
    if (isEmpty(endDate)) {
      alert('Please select end date');
      valid = false;
    }
    if (valid) {
      this.handleToggle();
    }
  }
  selectRange(value) {
    let startDate = '';
    let endDate = '';
    if (value === 'This Month') {
      startDate = moment().date(1);
      endDate = moment();
    } else if (value === 'Last Month') {
      startDate = moment().month(moment().get('month') - 1).date(1);
      endDate = moment().date(0);
    } else if (value === 'This Year') {
      startDate = moment().month(0).date(1);
      endDate = moment();
    } else if (value === 'Last Year') {
      startDate = moment().year(moment().get('year') - 1).month(0).date(1);
      endDate = moment().month(0).date(0);
    } else {
      startDate = '';
      endDate = '';
    }
    this.setState({
      startDate,
      endDate
    });
  }
  render() {
    const {startDate, endDate} = this.state;
    return (
      <DropdownButton
        title={
          <div className="calender-btn" onClick={this.handleToggle}>
            <i className="fa fa-calendar" aria-hidden="true" />
          </div>
        }
        id="bg-nested-dropdown"
        className="calender-dd-btn"
        style={{float: 'right'}}
        open={this.state.open}
      >
        <div>
          <div className="custom-dropdown-view">
            <span className="dd-lable">Date Range:</span>
            <span>
              <Select defaultValue={this.state.defaultValue} onChange={this.selectRange}>
                <Option value="">Select</Option>
                <Option value="This Month">This Month</Option>
                <Option value="Last Month">Last Month</Option>
                <Option value="This Year">This Year</Option>
                <Option value="Last Year">Last Year</Option>
              </Select>
            </span>
          </div>
          <div className="custom-dropdown-view">
            <div style={{width: '50%'}} className="pull-left padding-r-7">
              <span className="dd-lable">Starting:</span>
              <span>
                <Input placeholder="YYYY-MM-DD" value={startDate ? moment(startDate).format('YYYY-MM-DD') : ''} />
              </span>
              <span className="calender-container">
                <Calendar
                  date={this.state.startDate}
                  onChange={(date) => this.setState({startDate: date})}
                  maxDate={endDate ? moment(endDate) : ''}
                />
              </span>
            </div>
            <div style={{width: '50%'}} className="pull-left padding-l-7">
              <span className="dd-lable">Ending:</span>
              <span>
                <Input placeholder="YYYY-MM-DD" value={endDate ? moment(endDate).format('YYYY-MM-DD') : ''} />
              </span>
              <span className="calender-container">
                <Calendar
                  date={this.state.endDate}
                  onChange={(date) => this.setState({endDate: date})}
                  minDate={startDate ? moment(startDate) : ''}
                />
              </span>
            </div>
          </div>
          <div className="custom-dropdown-view rangepicker-footer">
            <hr />
            <Button className="login-button pull-left" onClick={this.handleToggle}>CANCEL</Button>
            <Button className="login-button pull-right" onClick={this.handleSubmit}>SAVE</Button>
          </div>
        </div>
      </DropdownButton>
    );
  }
}

export default CustomRangePicker;
