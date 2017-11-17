import React, { Component } from 'react';
import { Grid, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import SearchInput, { createFilter } from 'react-search-input';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import _ from 'underscore';
import Navigationbar from '../components/Navigationbar';
import Footer from '../components/Footer';
import { KEYS_TO_FILTERS, convertInventoryJSONToObject } from '../constants';
import {
  getCaret,
  customMultiSelect,
  createCustomInsertButton,
  createCustomDeleteButton,
  createCustomExportCSVButton,
  renderSizePerPageDropDown,
  renderPaginationPanel,
  createCustomButtonGroup,
  createCustomToolBar,
  productCellFormatter,
  cellUnitFormatter,
  cellValueFormatter,
  arrowFormatter,
  sortByTitle,
  sortByStockValue,
  sortByCommitValue,
  sortBySaleValue
} from '../components/CustomTable';
import { invokeApig } from '../libs/awsLib';

import '../styles/App.css';
import '../styles/react-search-input.css';
import '../styles/react-bootstrap-table.min.css';
import '../styles/customMultiSelect.css';

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
    return (
      <div>
        <Navigationbar history={this.props.history} />
        <Grid className="inventory-container no-padding">
          <Row className="no-margin min-height custom-shadow">
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
              <Tab eventKey={1} title="Dashboard">
                <div className="padding-left-right-100">
                  sadfasdf
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
