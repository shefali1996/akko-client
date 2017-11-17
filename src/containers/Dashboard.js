import React, { Component } from 'react';
import { Grid, Row, Tabs, Tab, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import {Responsive, WidthProvider} from 'react-grid-layout';
import Navigationbar from '../components/Navigationbar';
import Footer from '../components/Footer';
import PercentBox from '../components/PercentBox';
import PriceBox from '../components/PriceBox';
import styles from '../constants/styles';
import '../styles/App.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

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

  render() {
    const layouts = [
      {i: 'a', x: 0, y: 0, w: 3, h: 5},
      {i: 'b', x: 1, y: 0, w: 3, h: 5},
      {i: 'c', x: 4, y: 0, w: 3, h: 5}
    ];

    return (
      <div>
        <Navigationbar history={this.props.history} />
        <Grid className="inventory-container no-padding">
          <Row className="no-margin min-height custom-shadow">
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
              <Tab eventKey={1} title="Dashboard">
                <div className="padding-left-right-100">
                  <Paper className="margin-t-50 white-bg" style={styles.paper}>
                    <Col md={2}>
                      <PriceBox
                        title="Sales"
                        currency="$"
                        value="57.9K"
                        raisePercentage="1.8"
                        period="from last month"
                        raise
                      />
                    </Col>
                    <Col md={2}>
                      <PriceBox
                        title="Gross Profit"
                        currency="$"
                        value="56.1K"
                        raisePercentage="0.6"
                        period="from last month"
                        raise
                      />
                    </Col>
                    <Col md={2}>
                      <PercentBox
                        title="Avg. Margin"
                        percentage="3"
                        raisePercentage="43"
                        period="from last month"
                        raise
                      />
                    </Col>
                    <Col md={2}>
                      <PercentBox
                        title="Retention Rate"
                        percentage="78"
                        raisePercentage="13"
                        period="from last month"
                        raise={false}
                      />
                    </Col>
                    <Col md={2}>
                      <PriceBox
                        title="Avg. Order Value"
                        currency="$"
                        value="424"
                        percentage="10"
                        raisePercentage="10"
                        period="from last month"
                        raise={false}
                      />
                    </Col>
                    <Col md={2}>
                      <PriceBox
                        title="Customer Lifetime Value"
                        currency="$"
                        value="4.5K"
                        percentage="18"
                        raisePercentage="18"
                        period="from last month"
                        raise
                      />
                    </Col>
                  </Paper>
                  <Paper className="margin-t-10 white-bg" style={styles.paper}>
                    <Col md={2}>
                      <PercentBox
                        title="Repeat Rate"
                        percentage="53"
                        raisePercentage="3"
                        period="from last month"
                        raise
                      />
                    </Col>
                    <Col md={2}>
                      <PriceBox
                        title="Gross Profit"
                        currency="$"
                        value="56.1K"
                        raisePercentage="0.6"
                        period="from last month"
                        raise
                      />
                    </Col>
                    <Col md={2}>
                      <PercentBox
                        title="Avg. Margin"
                        percentage="3"
                        raisePercentage="43"
                        period="from last month"
                        raise
                      />
                    </Col>
                    <Col md={2}>
                      <PercentBox
                        title="Retention Rate"
                        percentage="78"
                        raisePercentage="13"
                        period="from last month"
                        raise={false}
                      />
                    </Col>
                    <Col md={2}>
                      <PriceBox
                        title="Avg. Order Value"
                        currency="$"
                        value="424"
                        percentage="10"
                        raisePercentage="10"
                        period="from last month"
                        raise={false}
                      />
                    </Col>
                    <Col md={2}>
                      <PriceBox
                        title="Customer Lifetime Value"
                        currency="$"
                        value="4.5K"
                        percentage="18"
                        raisePercentage="18"
                        period="from last month"
                        raise
                      />
                    </Col>
                  </Paper>
                  <div>
                    <ResponsiveReactGridLayout
                      className="layout"
                      layouts={layouts}
                      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                      cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
                      <Paper key="1">1</Paper>
                      <Paper key="2">2</Paper>
                      <Paper key="3">3</Paper>
                    </ResponsiveReactGridLayout>
                  </div>
                </div>
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
