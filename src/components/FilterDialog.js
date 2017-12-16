import React, { Component } from 'react';
import { Row, Col, Label, Button, Image } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import SearchInput, { createFilter } from 'react-search-input';
import { KEYS_TO_FILTERS, convertInventoryJSONToObject } from '../constants';
import { invokeApig } from '../libs/awsLib';
import {productData, customerData} from '../constants/dommyData';
import {
  customMultiSelect,
  renderSizePerPageDropDown,
  renderSetTablePaginationPanel,
  productDetailFormatter,
  sortByTitle,
  getCaret,
  sortByCogsValue,
  productPriceFormatter,
  sortByProductPrice,
  customerFormater,
  avgOrderValueFormater,
  orderEveryFormatter
} from '../components/CustomTable';

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
const product = 'product';
const customer = 'customer';

class FilterDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFilterModal: '',
      data: [],
      searchTerm: '',
      selectedRows: []
    };
    this.searchUpdated = this.searchUpdated.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.setSelectedText = this.setSelectedText.bind(this);
    this.getProductData = this.getProductData.bind(this);
    this.getCustomerData = this.getCustomerData.bind(this);
  }
  componentWillMount() {
    // const {filterModal} = this.props;
    this.setData(this.props);
    // if (filterModal === product) {
    //   this.getProductData();
    // } else if (filterModal === customer) {
    //   this.getCustomerData();
    // }
  }
  componentWillReceiveProps(props) {
    const {filterModal, openFilter} = props;
    if (openFilter && this.state.currentFilterModal !== filterModal) {
      this.setData(props);
    }
    // if (openFilter) {
    //   if (filterModal === product) {
    //     this.getProductData();
    //   } else if (filterModal === customer) {
    //     this.getCustomerData();
    //   }
    // }
  }
  setData(props) {
    const {filterModal } = props;
    if (filterModal === product) {
      this.getProductData();
    } else if (filterModal === customer) {
      this.getCustomerData();
    }
    this.setState({
      currentFilterModal: filterModal,
      searchTerm: '',
    });
  }
  getProductData() {
    invokeApig({ path: '/products' }).then((results) => {
      const updateTime = results.lastUpdated;
      const products = convertInventoryJSONToObject(results.variants);
      this.setState({
        data: products,
        selectedRows: this.props.savedData.selectedRows ? this.props.savedData.selectedRows : []
      });
    }).catch(error => {
      console.log('get products error', error);
    });
    // this.setState({
    //   data: productData,
    //   selectedRows: this.props.savedData.selectedRows ? this.props.savedData.selectedRows : []
    // });
  }
  getCustomerData() {
    invokeApig({ path: '/customers' }).then((results) => {
      const updateTime = results.lastUpdated;
      const customers = convertInventoryJSONToObject(results.variants);
      this.setState({
        data: customers,
        selectedRows: this.props.savedData.selectedRows ? this.props.savedData.selectedRows : []
      });
    }).catch(error => {
      console.log('get customers error', error);
    });
    // this.setState({
    //   data: customerData,
    //   selectedRows: this.props.savedData.selectedRows ? this.props.savedData.selectedRows : []
    // });
  }
  searchUpdated(term) {
    this.setState({
      searchTerm: term
    });
  }
  onFocus() {

  }
  setSelectedText(selectedText) {
    this.props.onRowSelect(selectedText);
  }
  onRowSelect(row, isSelected) {
    const {selectedRows, data} = this.state;
    if (isSelected) {
      selectedRows.push(row);
      this.setState({selectedRows});
    } else {
      const i = selectedRows.indexOf(row);
      if (i !== -1) {
        selectedRows.splice(i, 1);
      }
      this.setState({selectedRows});
    }
    let rowsSelected = selectedRows.length;
    if (selectedRows.length === data.length) {
      rowsSelected = 'all';
    }
    this.setSelectedText({data, selectedRows, rowsSelected});
  }

  onSelectAll(isSelected, rows) {
    const idArray = [];
    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        idArray.push(rows[i]);
      }
      this.setState({selectedRows: idArray});
    } else {
      this.setState({selectedRows: []});
    }
    let rowsSelected = idArray.length;
    if (idArray.length === this.state.data.length) {
      rowsSelected = 'all';
    }
    this.setSelectedText({data: this.state.data, selectedRows: idArray, rowsSelected});
  }
  render() {
    const {filterModal} = this.props;
    const {searchTerm, data, selectedRows} = this.state;
    const filteredData = data.filter(createFilter(searchTerm, KEYS_TO_FILTERS));
    const selectRowProp = {
      mode: 'checkbox',
      customComponent: customMultiSelect,
      onSelect: this.onRowSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this)
    };
    const options = {
      sizePerPageDropDown: renderSizePerPageDropDown,
      paginationPanel: renderSetTablePaginationPanel,
      paginationSize: 7,
      prePage: '«   Previous',
      nextPage: 'Next   »',
      withFirstAndLast: false,
      sortIndicator: false,
      sizePerPage: 100
    };

    let filterTitle = '';
    let searchPlaceHolder = '';
    let col2DataField = '';
    let col2Header = '';
    let col2DataFormate = '';
    let col2Width = '';

    let col3DataField = '';
    let col3Header = '';
    let col3DataFormate = '';
    let col3Width = '';

    let col4DataField = '';
    let col4Header = '';
    let col4DataFormate = '';
    let col4Width = '';

    if (filterModal === product) {
      filterTitle = 'Filter By Product';
      searchPlaceHolder = 'Search your products by name or SKU';

      col2DataField = 'product_details';
      col2Header = 'Product';
      col2DataFormate = productDetailFormatter;
      col2Width = '40%';

      col3DataField = 'product_details';
      col3Header = 'Listed Price';
      col3DataFormate = productPriceFormatter;
      col3Width = '20%';

    } else if (filterModal === customer) {
      filterTitle = 'Filter By Customer';
      searchPlaceHolder = 'Search your customers by name or email';

      col2DataField = 'name';
      col2Header = 'Customer';
      col2DataFormate = customerFormater;
      col2Width = '40%';

      col3DataField = 'avgOrderValue';
      col3Header = 'Usually orders for..';
      col3DataFormate = avgOrderValueFormater;
      col3Width = '20%';

      col4DataField = 'every';
      col4Header = 'Orders Every';
      col4DataFormate = orderEveryFormatter;
      col4Width = '20%';

    }
    return (
      <Dialog
        title={<div>
          <span>{filterTitle}</span>
          <span className="pull-right close-btn">
            <Button className="close-button pull-right" onClick={this.props.closeFilter} />
          </span>
        </div>}
        titleStyle={styles.chartsHeaderTitle}
        modal
        open={this.props.openFilter}
        onRequestClose={this.props.closeFilter}
      >
        <Row className="filter-dialog">
          <Col>
            <Card className="charts-card-style">
              <CardText>
                <Row>
                  <Col md={8}>
                    <Row>
                      <Col md={12} className="filterSearch">
                        <SearchInput
                          className="search-input"
                          placeholder={searchPlaceHolder}
                          onChange={this.searchUpdated}
                          onFocus={this.onFocus}
                    />
                      </Col>
                      <Col md={12}>
                        <BootstrapTable
                          ref={(table) => { this.table = table; }}
                          data={filteredData}
                          options={options}
                          bordered={false}
                          selectRow={selectRowProp}
                          pagination
                          trClassName="custom-table"
                          tableHeaderClass="filter-table-header"
                          tableBodyClass="filter-table-body"
                          headerStyle={{ background: '#fbfbfb' }}
                  >
                          <TableHeaderColumn
                            isKey
                            dataField="id"
                            dataAlign="center"
                            dataSort
                            className="custom-table-header"
                            hidden
                            width="20%"
                    >
                      ID
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField={col2DataField}
                            dataAlign="center"
                            dataSort
                            className="set-table-header"
                            dataFormat={col2DataFormate}
                            sortFunc={sortByTitle}
                            caretRender={getCaret}
                            width={col2Width}
                    >
                            {col2Header}
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField={col3DataField}
                            dataAlign="center"
                            className="set-table-header"
                            dataFormat={col3DataFormate}
                            dataSort
                            caretRender={getCaret}
                            sortFunc={sortByProductPrice}
                            width={col3Width}
                    >
                            {col3Header}
                          </TableHeaderColumn>
                          {
                          filterModal === customer ? <TableHeaderColumn
                            dataField={col4DataField}
                            dataAlign="center"
                            className="set-table-header"
                            dataFormat={col4DataFormate}
                            dataSort
                            caretRender={getCaret}
                            sortFunc={sortByProductPrice}
                            width={col4Width}
                            >
                            {col4Header}
                          </TableHeaderColumn> : null
                      }
                        </BootstrapTable>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4} className="text-center">
                    <Row>
                      <Col md={12} className="selected-text">
                      Selected Products : {selectedRows.length} / {data.length}
                      </Col>
                      {selectedRows.length ? selectedRows.map((row, i) => {
                      let selectedRowList = '';
                      if (filterModal === product) {
                        selectedRowList = productDetailFormatter(row.product_details, row);
                      } else if (filterModal === customer) {
                        selectedRowList = customerFormater(row.name, row);
                      }
                      return (<Col key={i} md={12}>
                        <div className="selected-row">
                          {selectedRowList}
                        </div>
                      </Col>);
                    })
                      : null
                    }
                    </Row>
                  </Col>
                </Row>
              </CardText>
            </Card>
          </Col>
        </Row>
      </Dialog>
    );
  }
}

export default FilterDialog;
