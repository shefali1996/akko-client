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

class CustomerInsights extends Component {
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
        <Card className="price-card-style">
          <CardHeader className="card-header-style" >
            <PriceBox value={value} analyze customer />
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
                textStyle={styles.chartHeader}
                title="Historical Trends"
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
          <Col md={4} className="">
            <Card className="charts-card-style">
              <CardHeader
                textStyle={styles.chartHeader}
                title="Distribution"
                titleStyle={styles.chartsHeaderTitle}
              />
              <CardText className="no-padding" style={{padding: '0px'}}>
                <SalesChart data={chartDataBar} type="bar" width="40%" />
              </CardText>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CustomerInsights;
