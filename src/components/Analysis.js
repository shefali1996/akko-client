import React, { Component } from 'react';
import { Row, Col, Label, Button, Image } from 'react-bootstrap';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import FinancialInsights from '../components/FinancialInsights';
// import CustomerInsights from '../components/CustomerInsights';

const dashboardJSON = {
  financialData: [
    {
      title: 'Total Sales',
      description: 'What is the total sales volume this month?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Gross Profit',
      description: 'Which customers are at risk of leaving?',
      prefix: '',
      value: 78,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'last month'
    },
    {
      title: 'Margin',
      description: 'What was the gross margin this period?',
      prefix: '$',
      value: 57923,
      trend: '+',
      trendValue: '3%',
      trendPeriod: 'from last month'
    }
  ],
  customerData: [
    {
      title: 'Avg. Order Value',
      description: 'On average, how much do customers spend in your store?',
      prefix: '$',
      value: 57923,
    },
    {
      title: 'Retention Rate',
      description: 'How many customers come back to buy again?',
      postfix: '%',
      value: 78,
    },
    {
      title: 'Reorder Rate',
      description: 'How many orders does a recurring customer make?',
      prefix: '',
      value: 3,
    },
    {
      title: 'Reorder Frequency',
      description: 'How often do customers buy again?',
      postfix: 'days',
      value: 15,
    },
    {
      title: 'Lifetime Value',
      description: 'How much do customers spend on your store over their entire lifetime?',
      prefix: '$',
      value: 5687,
    },
  ]
};
const chartDataLine = {
  labels: ['Aug 17', 'Sep 17', 'Oct 17', 'Nov 17'],
  datasets: [{
    type: 'line',
    label: 'Sales',
    data: ['57000', '55000', '56881', '58000'],
    borderColor: 'rgba(55, 141, 238, 0.1)',
    backgroundColor: 'rgba(55, 141, 238, 0.5)',
    fill: '1',
    tension: 0,
  },
  {
    type: 'line',
    label: 'Gross Profit',
    data: ['56000', '53500', '55888', '56010'],
    borderColor: 'rgba(234, 71, 62, 0.6)',
    backgroundColor: 'rgba(234, 71, 62, 0.5)',
    fill: true,
    tension: 0,
  },
  {
    type: 'line',
    label: 'Margin',
    data: ['57000', '52500', '57888', '59010'],
    borderColor: '#ff9900',
    backgroundColor: '#ff9900',
    fill: true,
    tension: 0,
  }]
};
const chartDataBar = {
  labels: ['Aug 17', 'Sep 17', 'Oct 17', 'Nov 17'],
  datasets: [{
    type: 'bar',
    label: 'Sales',
    data: ['57000', '55000', '56881', '58000'],
    borderColor: 'rgba(55, 141, 238, 0.1)',
    backgroundColor: 'rgba(55, 141, 238, 0.5)',
    fill: '1',
    tension: 0,
  },
  {
    type: 'bar',
    label: 'Gross Profit',
    data: ['56000', '53500', '55888', '56010'],
    borderColor: 'rgba(234, 71, 62, 0.6)',
    backgroundColor: 'rgba(234, 71, 62, 0.5)',
    fill: true,
    tension: 0,
  },
  {
    type: 'bar',
    label: 'Margin',
    data: ['57000', '52500', '57888', '59010'],
    borderColor: '#ff9900',
    backgroundColor: '#ff9900',
    fill: true,
    tension: 0,
  }]
};

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

class Analysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: dashboardJSON,
      showingPage: 'financial'
    };
    this.goLanding = this.goLanding.bind(this);
  }
  goLanding() {
    this.props.closeAnalysis();
  }

  render() {
    if (!this.props.show) {
      return <div className="hidden" />;
    }
    return (
      <div className="dialog analysis">
        <Row>
          <Col md={9} className="padding-t-15 padding-r-0">
            <span className="pull-left page-select-text">
              <span>Showing </span>
              <span>
                <SelectField
                  value={this.state.showingPage}
                  onChange={(event, index, value) => { this.setState({showingPage: value}); }}
                  style={{fontFamily: 'ubuntu', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', bottom: '-20px'}}
                  selectedMenuItemStyle={{color: '#575dde', textDecoration: 'none solid #666666'}}
                  labelStyle={{color: '#575dde', textDecoration: 'none solid #666666'}}
                >
                  <MenuItem value="financial" primaryText="Financial" />
                  <MenuItem value="customer" primaryText="Customer" />
                </SelectField>
              </span>
              <span>Insights</span>
            </span>
            <span className="pull-right">
              <Button className="custom-btn">
              SAVE CUSTOM REPORT
              </Button>
            </span>
          </Col>
          <Col md={3}>
            <span className="pull-left right-top-description">Save your favorite custom reports and we'll add them to your personalized dashboard.</span>
            <Button className="close-button pull-right" onClick={this.goLanding} />
          </Col>
        </Row>
        {
          // this.state.showingPage === 'financial' ?
          // <FinancialInsights cardsData={this.state.data.financialData} chartDataLine={chartDataLine} chartDataBar={chartDataBar} />
          // :
          // <CustomerInsights cardsData={this.state.data.customerData} chartDataLine={chartDataLine} chartDataBar={chartDataBar} />
        }
      </div>
    );
  }
}

export default Analysis;