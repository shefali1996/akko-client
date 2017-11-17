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
      data: [],
      searchTerm: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentDidMount() {
    this.getInventory();
  }

  onFocus() {
    
  }

  getInventory() {
    if (localStorage.getItem('inventoryInfo') === null) {
      invokeApig({ path: '/inventory' }).then((results) => {
        const products = convertInventoryJSONToObject(results);
        this.setState({ data: products });
        localStorage.setItem('inventoryInfo', JSON.stringify(products));
      })
        .catch(error => {
          console.log('get product error', error);
        });
    } else {
      const existingProducts = JSON.parse(localStorage.getItem('inventoryInfo'));
      this.setState({ data: existingProducts });
    }
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

  searchUpdated(term) {
    this.setState({
      searchTerm: term
    });
  }

  renderStockUnitsHeader() {
    return (
      <div className="text-right">
          Stock on
      </div>
    );
  }

  renderStockValueHeader() {
    return (
      <div className="text-left custom-padding-left">
        Hand
      </div>
    );
  }

  renderCommitUnitsHeader() {
    return (
      <div className="text-right">
        Commi
      </div>
    );
  }

  renderCommitValueHeader() {
    return (
      <div className="text-left">
          tted
      </div>
    );
  }

  renderSaleUnitsHeader() {
    return (
      <div className="text-right">
        Available
      </div>
    );
  }

  renderSaleValueHeader() {
    return (
      <div className="text-left custom-padding-left">
        for Sale
      </div>
    );
  }

  render() {
    const { data, searchTerm } = this.state;
    const filteredData = data.filter(createFilter(searchTerm, KEYS_TO_FILTERS));
    const selectRowProp = {
      mode: 'checkbox',
      customComponent: customMultiSelect,
      clickToSelect: true
    };
    const options = {
      insertBtn: createCustomInsertButton,
      deleteBtn: createCustomDeleteButton,
      exportCSVBtn: createCustomExportCSVButton,
      sizePerPageDropDown: renderSizePerPageDropDown,
      paginationPanel: renderPaginationPanel,
      btnGroup: createCustomButtonGroup,
      toolBar: createCustomToolBar,
      paginationSize: 7,
      prePage: '«   Previous',
      nextPage: 'Next   »',
      withFirstAndLast: false,
      sortIndicator: false
    };
    return (
      <div>
        <Navigationbar history={this.props.history} />
        <Grid className="inventory-container no-padding">
          <Row className="no-margin min-height custom-shadow">
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
              <Tab eventKey={1} title="Channels">
                <div className="padding-left-right-100">
                  <Row className="padding-50">
                    <Col md={3} className="no-left-padding">
                      <div className="white-view" />
                    </Col>
                    <Col md={3} className="no-left-padding">
                      <div className="white-view" />
                    </Col>
                    <Col md={3} className="no-left-padding">
                      <div className="white-view" />
                    </Col>
                    <Col md={3} className="no-right-padding no-left-padding">
                      <div className="white-view" />
                    </Col>
                  </Row>
                  <Row className="padding-left-right-50">
                    <Col md={6} mdOffset={3}>
                      <SearchInput
                        className="search-input"
                        placeholder="Search all your inventory"
                        onChange={this.searchUpdated}
                        onFocus={this.onFocus}
                        />
                    </Col>
                  </Row>
                  <Row className="padding-50">
                    <BootstrapTable
                      data={filteredData}
                      options={options}
                      insertRow
                      deleteRow
                      exportCSV
                      bordered={false}
                      selectRow={selectRowProp}
                      pagination
                      trClassName="custom-table"
                    >
                      <TableHeaderColumn
                        isKey
                        dataField="id"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        hidden
                      >
                          ID
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="productDetail"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        dataFormat={productCellFormatter}
                        sortFunc={sortByTitle}
                        width="40%"
                      >
                          Product
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="stockOnHandUnits"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        dataFormat={cellUnitFormatter}
                      >
                        {this.renderStockUnitsHeader()}
                          Units
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="stockOnHandValue"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        dataFormat={cellValueFormatter}
                        sortFunc={sortByStockValue}
                      >
                        {this.renderStockValueHeader()}
                          $
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="committedUnits"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        dataFormat={cellUnitFormatter}
                      >
                        {this.renderCommitUnitsHeader()}
                          Units
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="committedValue"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        dataFormat={cellValueFormatter}
                        sortFunc={sortByCommitValue}
                      >
                        {this.renderCommitValueHeader()}
                          $
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="availableForSaleUnits"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        dataFormat={cellUnitFormatter}
                      >
                        {this.renderSaleUnitsHeader()}
                          Units
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="availableForSaleValue"
                        dataAlign="center"
                        dataSort
                        className="custom-table-header"
                        caretRender={getCaret}
                        dataFormat={cellValueFormatter}
                        sortFunc={sortBySaleValue}
                      >
                        {this.renderSaleValueHeader()}
                          $
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataAlign="center"
                        className="custom-table-header"
                        dataFormat={arrowFormatter}
                        width="5%"
                      />
                    </BootstrapTable>
                  </Row>
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