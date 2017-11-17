import React, { Component } from 'react';
import { Grid, Row, Tabs, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Navigationbar from '../components/Navigationbar';
import Footer from '../components/Footer';
import styles from '../constants/styles';
import '../styles/App.css';

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
    console.log(styles);
    return (
      <div>
        <Navigationbar history={this.props.history} />
        <Grid className="inventory-container no-padding">
          <Row className="no-margin min-height custom-shadow">
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
              <Tab eventKey={1} title="Dashboard">
                <div className="padding-left-right-100">
                  <Paper className="margin-t-50">
                    <Paper>
                      <div style={styles.content}>
                        aaa
                      </div>
                    </Paper>
                    <Paper>
                      <div style={styles.content}>
                        bbb
                      </div>
                    </Paper>
                  </Paper>
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
