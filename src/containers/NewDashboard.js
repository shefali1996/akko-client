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
import ExploreMetrics from '../components/ExploreMetrics';
import {dashboardJSON, chartDataLine, chartDataBar, chartDataOne} from '../constants/dommyData';
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

class NewDashboard extends Component {
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
    const cardsData = dashboardJSON.allData;
    const renderCards = [];
    cardsData.map((value, index) => {
      renderCards.push(<Col key={index} md={3} sm={4} xs={6} className="dashboard-card-cantainer">
        <Card
          className={value.trend === '+' ? 'price-card-style' : 'price-card-style-border'}
          onClick={() => {
          this.setState({
            explore: true,
            activeMetrics: value
          });
        }}>
          <CardHeader className="card-header-style" >
            <PriceBox value={value} analyze />
          </CardHeader>
          <CardText>
            <div>
              <SalesChart data={chartDataOne} type="line" width="40%" />
            </div>
          </CardText>
        </Card>
      </Col>
      );
    });
    return (
      <div>
        <Navigationbar history={this.props.history} companyName="Test Company" />
        <Grid className="page-container">
          <Row className="analysis">
            <Col>
              <div className={this.state.explore ? 'left-box-50' : 'left-box-100'}>
                <Row>
                  <Col md={12}>
                    <span className={this.state.explore ? 'pull-right margin-r-23' : 'pull-right'}>
                      <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                        <Option value="1">This month to date</Option>
                        <Option value="2">This year to date</Option>
                      </Select>
                    </span>
                  </Col>
                </Row>
                <Row className="report-cards">
                  {renderCards}
                </Row>
              </div>
              <div className={this.state.explore ? 'right-box-50' : 'right-box-0'}>
                <ExploreMetrics closeFilter={() => this.setState({explore: false})} activeMetrics={this.state.activeMetrics} filterModal="product" open={this.state.explore} />
              </div>
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default NewDashboard;
