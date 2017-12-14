import React, { Component } from 'react';
import { Row, Col, Label, Button, Image } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import { Select, DatePicker } from 'antd';
import SalesChart from '../components/SalesChart';
import { chartDataOne} from '../constants/dommyData';

const {Option} = Select;
const {RangePicker} = DatePicker;
const styles = {
  chartsHeaderTitle: {
    fontSize: '16px',
    color: '#666666',
    fontWeight: 'bold',
    textDecoration: 'none solid rgb(102, 102, 102)',
  },
  chartHeader: {
    width: '100%',
    padding: '0px'
  }
};

class ExploreMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {activeMetrics} = this.props;
    return (
      <Row>
        <Col md={12}>
          <Card className={this.props.open ? 'charts-card-style show' : 'hide'}>
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
                    <RangePicker onChange={(date, dateString) => { console.log('date, dateString', date, dateString); }} />
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
                            <Chip className="chip" labelStyle={styles.chipLabelStyle}>Showing 5 products</Chip>
                          </div>
                          <div className="link"><a onClick={() => this.props.openFilter('product')} >change filter</a></div>
                        </CardText>
                      </Card>
                    </Col>
                    <Col md={5} className="text-center padding-r-0">
                      <Card className="charts-card-style">
                        <CardText className="card-content text-center">
                          <div className="card-title">Filter By customers</div>
                          <div className="chip-wrapper">
                            <Chip className="chip" labelStyle={styles.chipLabelStyle}>Showing all customers</Chip>
                          </div>
                          <div className="link"><a onClick={() => this.props.openFilter('customer')}>change filter</a></div>
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
                      <SalesChart data={chartDataOne} type="line" width="40%" />
                    </CardText>
                  </Card>
                </Col>
                <Col md={12} className="margin-t-60" />
              </Row>
            </CardText>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default ExploreMetrics;
