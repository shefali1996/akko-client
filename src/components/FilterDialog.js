import React, { Component } from 'react';
import { Row, Col, Label, Button, Image } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import SearchInput, { createFilter } from 'react-search-input';
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
import { KEYS_TO_FILTERS } from '../constants';

const productData = [{
  id: '136650063902:1766258671646',
  currency: '$',
  product_details: {
    variant: 'Black / L',
    title: 'MK 2017 Slim Drawstring Elastic Waist Sweatpants Trousers Men Harem Pants Men\'S Big Pockets Man Cargo Joggers',
    sku: '3656230-black-l',
    image: 'https://cdn.shopify.com/s/files/1/2374/4003/products/product-image-204525014.jpg?v=1506929542',
    category: 'null',
    tags: 'null',
    price: '17.62',
    currency: '$',
    cogs: '3'
  },
  active: true,
},
{
  id: '136650063902:1766258704414',
  currency: '$',
  product_details: {
    variant: 'Black / XL',
    title: 'MK 2017 Slim Drawstring Elastic Waist Sweatpants Trousers Men Harem Pants Men\'S Big Pockets Man Cargo Joggers',
    sku: '3656230-black-xl',
    image: 'https://cdn.shopify.com/s/files/1/2374/4003/products/product-image-204525014.jpg?v=1506929542',
    category: 'null',
    tags: 'null',
    price: '17.62',
    currency: '$',
    cogs: '1'
  },
  active: true,
}
];
const customerData = [
  { id: '1', name: 'Guest User', email: 'anudeep@example.com', avgOrderValue: 22.34, every: 5 },
  { id: '2', name: 'Guest User', email: 'anudeep@example.com', avgOrderValue: 22.34, every: 5 },
  { id: '3', name: 'Guest User', email: 'anudeep@example.com', avgOrderValue: 22.34, every: 5 },
];
const metricsData = [];

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
const metrics = 'metrics';

class FilterDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchTerm: '',
      selectedRows: []
    };
    this.searchUpdated = this.searchUpdated.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
  }
  componentWillMount() {
    console.log('componentWillMount');
    const {filterModal} = this.props;
    if (filterModal === product) {
      this.getProductData();
    } else if (filterModal === customer) {
      this.getCustomerData();
    } else if (filterModal === metrics) {
      this.getMetricsData();
    }
  }
  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps');
    const {filterModal, openFilter} = props;
    if (openFilter) {
      if (filterModal === product) {
        this.getProductData();
      } else if (filterModal === customer) {
        this.getCustomerData();
      } else if (filterModal === metrics) {
        this.getMetricsData();
      }
    }
  }
  getProductData() {
    // invokeApig({ path: '/products' }).then((results) => {
    //   this.setState({ data: results });
    // })
    //   .catch(error => {
    //     console.log('get products error', error);
    //   });
    this.setState({
      data: productData
    });
  }
  getCustomerData() {
    // invokeApig({ path: '/customers' }).then((results) => {
    //   this.setState({ data: results });;
    // })
    //   .catch(error => {
    //     console.log('get customers error', error);
    //   });
    this.setState({
      data: customerData
    });
  }
  getMetricsData() {
    // invokeApig({ path: '/product' }).then((results) => {
    //   this.setState({ data: results });
    // })
    //   .catch(error => {
    //     console.log('get metrics error', error);
    //   });
    this.setState({
      data: metricsData
    });

  }
  searchUpdated(term) {
    this.setState({
      searchTerm: term
    });
  }
  onFocus() {

  }
  onRowSelect(row, isSelected) {
    const {selectedRows} = this.state;
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
    return true;
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

    } else if (filterModal === metrics) {
      filterTitle = 'Filter By Metrics';
      searchPlaceHolder = 'Search your metrics';

      // col2DataField = 'product_details';
      // col2Header = 'Mertics';
      // col2DataFormate = productDetailFormatter;
      // col2Width = '40%';
      //
      // col3DataField = 'product_details';
      // col3Header = 'Mertics';
      // col3DataFormate = productPriceFormatter;
      // col3Width = '20%';

    }
    //   <CardHeader
    //     textStyle={styles.chartHeader}
    //     title={<div>
    //       <span>{filterTitle}</span>
    //       <span className="pull-right close-btn">
    //         <Button className="close-button pull-right" onClick={this.props.closeFilter} />
    //       </span>
    //     </div>}
    //     titleStyle={styles.chartsHeaderTitle}
    // />
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
                      } else if (filterModal === metrics) {

                      }
                      return (<Col key={i} md={12}>
                        <div className="selected-row">
                          {selectedRowList}
                        </div>
                      </Col>);
                    }
                      )
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
