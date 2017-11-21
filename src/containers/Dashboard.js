import React, { Component } from 'react';
import { Grid, Row, Tabs, Tab } from 'react-bootstrap';
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
      value: 78,
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
      trendValue: '23%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 424,
      trend: '-',
      trendValue: '45%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 74,
      trend: '+',
      trendValue: '63%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 562,
      trend: '-',
      trendValue: '21%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '43%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 54,
      trend: '+',
      trendValue: '13%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 896,
      trend: '-',
      trendValue: '32%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '63%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 893,
      trend: '+',
      trendValue: '63%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '73%',
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
      value: 58,
      trend: '+',
      trendValue: '41%',
      trendPeriod: 'last month'
    },
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 569,
      trend: '-',
      trendValue: '41%',
      trendPeriod: 'last month'
    },
    {
      title: 'Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '63%',
      trendPeriod: 'last month'
    },
    {
      title: 'Churning Customers',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 98,
      trend: '+',
      trendValue: '43%',
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
      data: dashboardJSON.dummyData,
    };
    this.handleSelect = this.handleSelect.bind(this);
    // this.itemSelected = this.itemSelected.bind(this);
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
    const {data} = this.state;
    const p = this.props;
    return (
      data.map((value, index) => {
        // const w = _.result(p, 'w') || Math.ceil(Math.random() * 4);
        const y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
        return (
          <div key={index} data-grid={{i: index.toString(), x: (index * 4) % 12, y: Math.floor(index / 4) * y, w: 3.3, h: 1 }} >
            <PriceCard value={value} />
          </div>
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
                <ReactGridLayout
                  {...this.props}
                >
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

Dashboard.defaultProps = {
  className: 'padding-left-right-50',
  cols: 12,
  onLayoutChange() {},
  verticalCompact: true,
  preventCollision: true,
  isResizable: false,
  isDraggable: false,
};
export default connect(mapStateToProps)(Dashboard);
