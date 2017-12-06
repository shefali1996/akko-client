import React, { Component } from 'react';
import { Row, Col, Label, Button, Image } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Select } from 'antd';
import SalesChart from '../components/SalesChart';
import PriceBox from '../components/PriceBox';

const {Option} = Select;
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

class FinancialInsights extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {cardsData, chartDataLine, chartDataBar} = this.props;
    const renderCards = [];
    cardsData.map((value, index) => {
      renderCards.push(<Col key={index} md={4} className="">
        <Card className={value.trend === '+' ? 'price-card-style' : 'price-card-style-border'} >
          <CardHeader className="card-header-style" >
            <PriceBox value={value} analyze />
          </CardHeader>
        </Card>
      </Col>
      );
    });
    return (
      <div className="content-box">
        <Row className="report-cards">
          {renderCards}
        </Row>
        <Row className="report-cards">
          <Col md={8} className="">
            <Card className="charts-card-style">
              <CardHeader
                title="Historical Trend"
                titleStyle={styles.chartsHeaderTitle}
              />
              <CardText>
                <SalesChart data={chartDataLine} type="line" width="40%" />
              </CardText>
            </Card>
          </Col>
          <Col md={4} className="expenses-breakdown">
            <Card className="charts-card-style">
              <CardHeader
                title="Expenses Breakdown"
                titleStyle={styles.chartsHeaderTitle}
                subtitle="for selected period"
                subtitleStyle={{color: '#bbbbbb', fontWeight: '600', fontSize: '11px'}}
                style={{height: '158px'}}
              />
              <CardText>
                <Row>
                  <Col md={12} className="expense-text">
                    <Row className="padding-t-5">
                      <Col md={7}>Total Sales</Col>
                      <Col md={5}><span className="dash" />$5463</Col>
                    </Row>
                    <Row className="padding-t-5">
                      <Col md={7}>COGS</Col>
                      <Col md={5}><span className="dash">-</span>$4000</Col>
                    </Row>
                    <Row className="padding-t-5">
                      <Col md={7}>Discounts</Col>
                      <Col md={5}><span className="dash">-</span>$500</Col>
                    </Row>
                    <Row className="padding-t-5">
                      <Col md={7}>Shiping</Col>
                      <Col md={5}><span className="dash">-</span>$500</Col>
                    </Row>
                    <Row className="padding-t-5">
                      <Col md={7}>Tax</Col>
                      <Col md={5}><span className="dash">-</span>$400</Col>
                    </Row>
                    <hr />
                    <Row className="final-row">
                      <Col md={7}>Grass Profit</Col>
                      <Col md={5}><span className="dash" />$63</Col>
                    </Row>
                  </Col>
                </Row>
              </CardText>
            </Card>
          </Col>
        </Row>
        <Row className="report-cards">
          <Col md={6} className="">
            <Card className="charts-card-style">
              <CardHeader
                textStyle={styles.chartHeader}
                title="By Product"
                titleStyle={styles.chartsHeaderTitle}
                subtitle={<div style={{marginTop: '10px'}}>
                  <span className="pull-left" style={{ width: 200 }}>
                    <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                      <Option value="1">Sort By: Total sales</Option>
                      <Option value="2">Grass Profit</Option>
                      <Option value="3">Margin</Option>
                    </Select>
                  </span>
                  <span className="pull-right" style={{ width: 200 }}>
                    <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                      <Option value="1">Order: High To Low</Option>
                      <Option value="2">Low To High</Option>
                    </Select>
                  </span>
                </div>}
              />
              <CardText>
                <SalesChart data={chartDataBar} type="bar" width="40%" />
              </CardText>
            </Card>
          </Col>
          <Col md={6} className="">
            <Card className="charts-card-style">
              <CardHeader
                textStyle={styles.chartHeader}
                title="By customer"
                titleStyle={styles.chartsHeaderTitle}
                subtitle={<div style={{marginTop: '10px'}}>
                  <span className="pull-left" style={{ width: 200 }}>
                    <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                      <Option value="1">Sort By: Total sales</Option>
                      <Option value="2">Grass Profit</Option>
                      <Option value="3">Margin</Option>
                    </Select>
                  </span>
                  <span className="pull-right" style={{ width: 200 }}>
                    <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                      <Option value="1">Order: High To Low</Option>
                      <Option value="2">Low To High</Option>
                    </Select>
                  </span>
                </div>}
              />
              <CardText>
                <SalesChart data={chartDataBar} type="bar" width="40%" />
              </CardText>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FinancialInsights;
