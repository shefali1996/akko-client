import React, { Component } from 'react';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Select } from 'antd';
import Navigationbar from '../components/Navigationbar';
import SalesChart from '../components/SalesChart';
import PriceBox from '../components/PriceBox';
import AnalysisRightPanel from '../components/AnalysisRightPanel';
import FilterDialog from '../components/FilterDialog';
import {dashboardJSON, chartDataLine, chartDataBar} from '../constants/dommyData';
import Footer from '../components/Footer';

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
      openFilter: false,
      filterBy: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.openFilter = this.openFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
  }
  handleSelect(key) {
    if (key === 1) {
      this.props.history.push('/financial_insights');
    } else if (key === 2) {
      this.props.history.push('/customer_insights');
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
      filterBy: ''
    });
  }
  render() {
    // const {cardsData, chartDataLine, chartDataBar} = this.props;
    const cardsData = dashboardJSON.customerData;
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
      <div>
        <Navigationbar history={this.props.history} />
        <Grid className="page-container">
          <Row>
            <Tabs defaultActiveKey={2} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
              <Tab eventKey={1} title="Financial" />
              <Tab eventKey={2} title="Customer">
                <Row className="analysis">
                  <Col md={9} className="padding-r-0">
                    <div className="content-box">
                      <Row className="report-cards">
                        {renderCards}
                      </Row>
                      {!this.state.openFilter ? <Row className="report-cards">
                        <Col md={8} className="">
                          <Card className="charts-card-style">
                            <CardHeader
                              textStyle={styles.chartHeader}
                              title="Historical Trends"
                              titleStyle={styles.chartsHeaderTitle}
                              subtitle={<div style={{marginTop: '10px'}}>
                                <span className="pull-left" style={{ width: 200 }}>
                                  <span className="dd-lable">Sort By:  </span>
                                  <span>
                                    <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                                      <Option value="1">Total sales</Option>
                                      <Option value="2">Gross Profit</Option>
                                      <Option value="3">Margin</Option>
                                    </Select>
                                  </span>
                                </span>
                                <span className="pull-right" style={{ width: 200 }}>
                                  <span className="dd-lable">Order: </span>
                                  <span>
                                    <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                                      <Option value="1">High To Low</Option>
                                      <Option value="2">Low To High</Option>
                                    </Select>
                                  </span>
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
                                                </Row> : null}
                      {this.state.openFilter ?
                        <FilterDialog closeFilter={this.closeFilter} filterModal={this.state.filterBy} />
    : null}
                    </div>
                  </Col>
                  <Col md={3}>
                    <AnalysisRightPanel openFilter={this.openFilter} />
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default CustomerInsights;
