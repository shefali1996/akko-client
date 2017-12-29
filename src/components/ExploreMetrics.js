import React, { Component } from 'react';
import { Row, Col, Label, Button, Image, DropdownButton } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import { Select, DatePicker, Input } from 'antd';
import Chart from '../components/Chart';
import { chartDataOne} from '../constants/dommyData';
import FilterDialog from '../components/FilterDialog';
import styles from '../constants/styles';
import profileIcon from '../assets/images/profileIconWhite.svg';
import downArrowWhite from '../assets/images/downArrowWhite.svg';
// import { Calendar } from 'react-date-range';
import CustomRangePicker from '../components/CustomRangePicker';

const moment = require('moment');

const {Option} = Select;
const {RangePicker} = DatePicker;

class ExploreMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      filterBy: '',
      products: {},
      customers: {},
      rangepicker: 'none',
      open: false,
      date: new Date(),
      startDate: '',
      endDate: '',
    };
    this.openFilter = this.openFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.returnData = this.returnData.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
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
      filterBy: ''
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
  render() {
    const {activeMetrics} = this.props;
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
                    <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                      <Option value="1">Time</Option>
                      <Option value="2">Products</Option>
                      <Option value="3">Customers</Option>
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
                <Col md={12}>
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
                      title="Historical Trend"
                      titleStyle={styles.chartsHeaderTitle}
                    />
                    <CardText>
                      <Chart data={chartDataOne} type="line" width="40%" />
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
