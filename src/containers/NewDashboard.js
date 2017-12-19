import React, { Component } from 'react';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Select } from 'antd';
import $ from 'jquery';
import {clone} from 'lodash';
import Navigationbar from '../components/Navigationbar';
import SalesChart from '../components/SalesChart';
import PriceBox from '../components/PriceBox';
import AnalysisRightPanel from '../components/AnalysisRightPanel';
import ExploreMetrics from '../components/ExploreMetrics';
import {dashboardJSON, chartDataLine, chartDataBar, chartDataOne} from '../constants/dommyData';
import Footer from '../components/Footer';

const elementResizeEvent = require('element-resize-event');

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
      width: '25%'
    };
    this.setWidth = this.setWidth.bind(this);
    this.handleClickMetrics = this.handleClickMetrics.bind(this);
    this.column = 4;
    this.top = 0;
    this.activeMetricsId = 'card_0';
  }
  componentDidMount() {
    const element = document.getElementById('cardSection');
    elementResizeEvent(element, () => {
      this.setWidth(element.clientWidth);
    });
  }
  setWidth(w) {
    const x = 100;
    let n = Math.floor(w / 320);
    const r = w % 320;
    let a = 0;
    n = n > 4 ? 4 : n;
    if (n !== this.column) {
      this.column = n;
      a = x / n;
      this.setState({
        width: `${a}%`,
      });
      if (this.state.explore) {
        this.handleClickMetrics(this.activeMetricsId, this.state.activeMetrics);
      }
    }
  }
  handleClickMetrics(id, value) {
    const element = $(`#${id}`);
    $('html, body').animate({
      scrollTop: element.offset().top - 80
    }, 100);
    this.activeMetricsId = id;
    this.setState({
      explore: true,
      activeMetrics: value
    });
  }
  render() {
    const cardsData = dashboardJSON.allData;
    const renderCards = [];
    cardsData.map((value, index) => {
      renderCards.push(<Col key={index} id={`card_${index}`} style={{width: this.state.width}} className="dashboard-card-cantainer">
        <Card
          className={value.trend === '+' ? 'price-card-style' : 'price-card-style-border'}
          onClick={(e) => this.handleClickMetrics(`card_${index}`, value)}>
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
              <div className={this.state.explore ? 'left-box-50 padding-left-right-7' : 'left-box-100 margin-t-5'}>
                {!this.state.explore ? <Row>
                  <Col md={12} className="padding-left-right-7">
                    <span className={this.state.explore ? 'pull-right margin-r-23' : 'pull-right'}>
                      <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                        <Option value="1">This month to date</Option>
                        <Option value="2">This year to date</Option>
                      </Select>
                    </span>
                  </Col>
                </Row> : null}
                <Row id="cardSection" className={this.state.explore ? 'report-cards scroll-section' : 'report-cards'}>
                  {renderCards}
                </Row>
              </div>
              <div className={this.state.explore ? 'right-box-50' : 'right-box-0'}>
                <ExploreMetrics
                  closeFilter={() => {
                    this.setState({explore: false});
                  }}
                  activeMetrics={this.state.activeMetrics}
                  filterModal="product"
                  open={this.state.explore} />
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
