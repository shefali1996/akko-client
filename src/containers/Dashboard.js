import React, { Component } from 'react';
import { Grid, Row, Tabs, Tab, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import RGL, { WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Navigationbar from '../components/Navigationbar';
import PriceCard from '../components/PriceCard';
import Footer from '../components/Footer';
import '../styles/App.css';

const ReactGridLayout = WidthProvider(RGL);

const dashboardJSON = {
  dummyData: [
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 3,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 424,
      trend: '-',
      trendValue: '10%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 3,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 424,
      trend: '-',
      trendValue: '10%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 3,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 424,
      trend: '-',
      trendValue: '10%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 3,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 424,
      trend: '-',
      trendValue: '10%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 3,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 424,
      trend: '-',
      trendValue: '10%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 3,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 424,
      trend: '-',
      trendValue: '10%',
      trendPeriod: 'last month'
    },
  ]
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
  }

  handleSelect(key) {
    if (key === 1) {
      this.props.history.push('/dashboard');
    } else if (key === 2) {
      this.props.history.push('/inventory');
    } else {
      this.props.history.push('/orders');
    }
  }

  renderCards() {
    const dummyDataValue = dashboardJSON.dummyData;
    return (
      dummyDataValue.map((value, index) => {
        // const w = _.result(p, 'w') || Math.ceil(Math.random() * 4);
        // const y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
        return (
          <Col md={4} key={index} data-grid={{x: index, y: 4, h: 1, w: 3}} >
            <PriceCard value={value} />
          </Col>
        );
      })
    );
  }

  render() {
    return (
      <div>
        <Navigationbar history={this.props.history} />
        <Grid className="inventory-container no-padding">
          <Row className="no-margin min-height custom-shadow">
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
              <Tab eventKey={1} title="Dashboard">
                <ReactGridLayout className="padding-left-right-100">
                  {this.renderCards()}
                </ReactGridLayout>
              </Tab>
              <Tab eventKey={2} title="Inventory" />
              <Tab eventKey={3} title="Orders" />
            </Tabs>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(Dashboard);
