import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, FormControl } from 'react-bootstrap';
import SearchInput, { createFilter } from 'react-search-input';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import SweetAlert from 'sweetalert-react';
import { Switch, Progress, Spin } from 'antd';
import {
  customMultiSelect,
  renderSizePerPageDropDown,
  renderSetTablePaginationPanel,
  productDetailFormatter,
  sortByTitle,
  getCaret,
  sortByCogsValue,
  productPriceFormatter,
  sortByProductPrice
} from '../components/CustomTable';
import HeaderWithCloseAndAlert from '../components/HeaderWithCloseAndAlert';
import { KEYS_TO_FILTERS, convertInventoryJSONToObject, isNumeric, numberFormatter, pollingInterval } from '../constants';
import { invokeApig } from '../libs/awsLib';
import {
  checkAndUpdateProductCogsValue,
  beautifyDataForCogsApiCall,
  moveAcceptedToBottom,
  sortByCogs,
  getProduct,
  getVariants,
  parsVariants
} from '../helpers/Csv';
import TipBox, {tipBoxMsg} from '../components/TipBox';

class SetTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markup: '',
      data: [],
      searchTerm: '',
      selectedOption: 'option1',
      selectedRows: [],
      fetchError: false,
      errorText: '',
      fetchSuccess: false,
      successMsg: '',
      hideCompleted: false,
      valueError: false,
      loading: false
    };
    this.onFinish = this.onFinish.bind(this);
    this.onMarkUpChange = this.onMarkUpChange.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);
    this.onSetMarkup = this.onSetMarkup.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.doToggleRows = this.doToggleRows.bind(this);
    this.renderProgressBar = this.renderProgressBar.bind(this);
    this.variants = [];
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getProduct();
    // this.onVariantUpdate();
    this.loadInterval = setInterval(() => {
      this.onVariantUpdate();
    }, pollingInterval);
  }
  componentWillUnmount() {
    clearInterval(this.loadInterval);
    this.setState({data: []});
  }
  onVariantUpdate() {
    const variantsInfo = JSON.parse(localStorage.getItem('variantsInfo'));
    if (variantsInfo) {
      this.updateVariants(variantsInfo);
    }
  }
  onMarkUpChange(e) {
    this.setState({ markup: e.target.value });
  }

  onSkip() {
    this.props.history.push('/dashboard');
  }

  fireSetCogsAPI(params) {
    return invokeApig({
      path: '/products',
      method: 'PUT',
      body: params
    });
  }

  onFinish() {
    const { data } = this.state;
    const pendingCogs = false;
    let pendingCogsProducts = data.filter((item) => {
      return item.cogsValidateStatus !== true;
    });
    pendingCogsProducts = [];
    if (pendingCogsProducts.length > 0) {
      this.setState({
        errorText: 'Please set COGS for all products or to skip click SKIP FOR NOW button',
        fetchError: true
      });
    } else {
      const cogsFinal = beautifyDataForCogsApiCall(data);
      this.fireSetCogsAPI(cogsFinal).then((results) => {
        this.onVariantUpdate();
        this.setState({
          successMsg: `COGS successfully set for ${cogsFinal.variants.length} products`,
          fetchSuccess: true
        });
      }).catch(error => {
        this.setState({
          errorText: error,
          fetchError: true
        });
      });
    }
  }

  onSetMarkup() {
    const {markup, data, selectedRows, selectedOption} = this.state;
    if (isNumeric(markup) && selectedRows.length > 0) {
      selectedRows.forEach((id) => {
        const product = data.find((p) => {
          return id === p.id;
        });
        if (product) {
          const productPrice = product.variant_details.price;
          let cogs = '';
          if (selectedOption === 'option1') {
            // if percentage is opted
            cogs = productPrice / (1 + (markup / 100));
            cogs = cogs.toFixed(2);
          } else {
            // if fixed markup is opted
            cogs = productPrice - markup;
          }
          const newData = checkAndUpdateProductCogsValue(cogs, product, data);
          this.setState({
            data: sortByCogs(newData)// moveAcceptedToBottom(newData, product)
          });
        }
      });
    }
    this.setState({
      markup: '',
      selectedRows: []
    });
  }

  getProduct() {
    getProduct().then((res) => {
      this.getVariants(res.products);
    }).catch((err) => {
      this.setState({
        errorText: err,
        fetchError: true
      });
    });
  }
  handleOptionChange(e) {
    this.setState({
      selectedOption: e.target.value
    });
  }
  getVariants(products, i = 0) {
    this.setState({ loading: true });
    const next = i + 1;
    invokeApig({
      path: `/products/${products[i].productId}`,
      queryParams: {
        cogs: true
      }
    }).then((results) => {
      results.productId = products[i].productId;
      this.variants.push(results);
      if (products.length > next) {
        this.getVariants(products, next);
      } else {
        localStorage.setItem('variantsInfo', JSON.stringify(this.variants));
        const variantsList = parsVariants(this.variants);
        this.setState({
          data: variantsList ? sortByCogs(variantsList) : [],
          loading: false
        });
        this.variants = [];
      }
    }).catch(error => {
      this.setState({loading: false});
      console.log('Error Product Details', error);
    });
  }
  updateVariants(variantsInfo, i = 0) {
    const next = i + 1;
    invokeApig({
      path: `/products/${variantsInfo[i].productId}`,
      queryParams: {
        cogs: true,
        lastUpdated: variantsInfo[i].lastUpdated
      }
    }).then((results) => {
      if (results.lastUpdated !== -1 && !isEmpty(results.variants)) {
        variantsInfo[i].variants = results.variants;
        variantsInfo[i].lastUpdated = results.lastUpdated;
      }
      if (variantsInfo.length > next) {
        this.updateVariants(variantsInfo, next);
      } else {
        const variantsList = parsVariants(variantsInfo);
        this.setState({
          data: variantsList ? sortByCogs(variantsList) : [],
        });
        localStorage.setItem('variantsInfo', JSON.stringify(variantsInfo));
      }
    }).catch(error => {
      console.log('Error Product Details', error);
    });
  }
  products() {
    return invokeApig({ path: '/products' });
  }

  searchUpdated(term) {
    this.setState({
      searchTerm: term
    });
  }

  onRowSelect(row, isSelected) {
    const {selectedRows} = this.state;
    if (isSelected) {
      selectedRows.push(row.id);
      this.setState({selectedRows});
    } else {
      const i = selectedRows.indexOf(row.id);
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
        idArray.push(rows[i].id);
      }
      this.setState({selectedRows: idArray});
    } else {
      this.setState({selectedRows: []});
    }
    return true;
  }

  onCogsChange(e, row) {
    const {data} = this.state;
    const index = data.findIndex((element) => {
      return element.id === row.id;
    });
    if (index > -1) {
      data[index].cogs = e.target.value;
      data[index].variant_details.cogs = e.target.value;
    }
    this.setState({data});
  }

  onCogsBlur(e, row) {
    const {data} = this.state;
    // if (e.target.value !== '' && e.target.value !== row.cogs || e.target.value !== row.variant_details.cogs) {
    const newData = checkAndUpdateProductCogsValue(e.target.value, row, data);
    this.setState({data: moveAcceptedToBottom(newData, row)});
    // }
  }

  cogsValueFormatter(cell, row) {
    let warningMessage = null;
    if (row.variant_details.cogs !== '' && row.variant_details.cogs !== null && row.variant_details.cogs !== 'null') { // (row.cogsValidateStatus === true) {
      warningMessage = (<div>
        <span className="cogs-completed" />
                        </div>);
    } else {
      warningMessage = (<div title={row.cogsValidateStatus}>
        <span className="cogs-pending" />
                        </div>);
    }
    // numberFormatter(cell);
    return (
      <div className="flex-center padding-t-20">
        <div className="currency-view">
          <span className="product-currency">
            $
          </span>
          <span className="product-currency-text">
            COGS
          </span>
        </div>
        <FormControl
          type="number"
          className="product-input"
          value={cell.cogs}
          onChange={(e) => {
            this.onCogsChange(e, row);
          }}
          onBlur={(e) => {
            this.onCogsBlur(e, row);
          }}
        />
        {warningMessage}
      </div>
    );
  }

  doToggleRows(checked) {
    this.setState({
      hideCompleted: checked
    });
  }

  renderProgressBar(total, completed, pending) {
    const per = (completed / total) * 100;
    return (
      <div>
        <div className="markup-center margin-0 padding-0 select-style-comment-small">
          <Col md={4} className="flex-left height-center">
            {completed} / {total}
            <br />
            Completed
          </Col>
          <Col md={4} className="text-center left-padding ">
            Hide completed
            <br />
            <Switch defaultChecked={this.state.hideCompleted} onChange={this.doToggleRows} />
          </Col>
          <Col md={4} className="flex-right height-center">
            {pending}
            <br />
            Pending
          </Col>
        </div>
        <div className="markup-center margin-0 padding-0">
          <Col md={12} className="flex-right height-center margin-0 padding-0">
            <Progress strokeWidth={5} percent={per} showInfo={false} />
          </Col>
        </div>
      </div>
    );
  }

  render() {
    const { searchTerm, markup, loading } = this.state;
    let { data } = this.state;
    // hide valid COGS products, i.e where cogsValidateStatus is true
    const countTotal = data.length;
    const pendingProducts = data.filter((item) => {
      return item.cogsValidateStatus !== true;
    });
    const countPending = pendingProducts.length;
    const countCompleted = countTotal - countPending;
    if (this.state.hideCompleted) {
      data = data.filter((item) => {
        return item.cogsValidateStatus !== true;
      });
    }
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
      sizePerPage: 100,
      noDataText: loading ? <Spin /> : 'No data found'
    };

    return (
      <div>
        <Grid className="login-layout">
          <HeaderWithCloseAndAlert pageTitle="Account Setup" {...this.props} />
          <Row>
            <Col md={6} mdOffset={3} className="center-view">
              <div className="text-center margin-t-40">
                <span className="select-style-text">
                  Set COGS for your products
                </span>
              </div>
              <div className="text-center margin-t-5">
                <span className="select-style-comment">
                  We will use these Cost of Goods Sold (COGS) estimates to calculate your gross profit
                </span>
              </div>
              <div className="text-center margin-t-5">
                <span className="select-style-comment-small">
                  {'( you can update these anytime from the Settings menu )'}
                </span>
              </div>
              <div className="table-center margin-t-60">
                <span className="select-style-comment-small">
                  Enter the COGS values for all the products.
                </span>
                <span className="select-style-comment-small margin-t-10">
                  (or)
                </span>
                <span className="select-style-comment-small margin-t-10">
                  select products and set the markup you charge and we will back-calculate their original price.
                </span>
              </div>
              <div className="table-center margin-t-10">
                <SearchInput
                  className="search-input"
                  placeholder="Search through all your products"
                  onChange={this.searchUpdated}
                  onFocus={this.onFocus}
                />
              </div>

              <div className="markup-center margin-t-30">
                <Col md={4} className="flex-right height-center">
                  <span className="select-style-comment-small">
                    Markup:
                  </span>
                  <FormControl
                    type="text"
                    className="markup-input"
                    value={markup}
                    onChange={this.onMarkUpChange}
                  />
                </Col>
                <Col md={4} className="text-left left-padding">
                  <div className="radio">
                    <label className="select-style-comment-small">
                      <input type="radio" value="option1" checked={this.state.selectedOption === 'option1'} onChange={this.handleOptionChange} />
                            Percentage
                    </label>
                  </div>
                  <div className="radio">
                    <label className="select-style-comment-small">
                      <input type="radio" value="option2" checked={this.state.selectedOption === 'option2'} onChange={this.handleOptionChange} />
                        Fixed Markup
                    </label>
                  </div>
                </Col>
                <Col md={4} className="flex-center height-center">
                  <Button className="skip-button" onClick={this.onSetMarkup}>
                    SET MARKUP
                  </Button>
                </Col>
              </div>

              <div className="markup-center margin-t-20 padding-0">
                {this.renderProgressBar(countTotal, countCompleted, countPending)}
              </div>

              <div className="markup-center margin-t-10">
                <BootstrapTable
                  ref={(table) => { this.table = table; }}
                  data={filteredData}
                  options={options}
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
                    hidden
                  >
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="variant_details"
                    dataAlign="center"
                    dataSort
                    className="set-table-header"
                    dataFormat={productDetailFormatter}
                    sortFunc={sortByTitle}
                    caretRender={getCaret}
                    width="40%"
                  >
                    Product
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="variant_details"
                    dataAlign="center"
                    className="set-table-header"
                    dataFormat={productPriceFormatter}
                    dataSort
                    caretRender={getCaret}
                    sortFunc={sortByProductPrice}
                    width="20%"
                  >
                    Listed Price
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="variant_details"
                    dataAlign="center"
                    className="set-table-header"
                    dataFormat={this.cogsValueFormatter.bind(this)}
                    width="20%"
                  >
                    COGS
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
              <div className="content-center margin-40">
                <Col md={6} className="text-left no-padding">
                  <Button className="skip-button" onClick={this.onSkip}>
                    SKIP FOR NOW
                  </Button>
                </Col>
                <Col md={6} className="text-right no-padding">
                  <Button className="login-button" onClick={this.onFinish}>
                    FINISH
                  </Button>
                </Col>
              </div>
            </Col>
            <Col md={3}>
              <TipBox message={tipBoxMsg.cogsValue} />
            </Col>
          </Row>
        </Grid>
        <SweetAlert
          show={this.state.fetchSuccess}
          showConfirmButton
          type="success"
          title="Success"
          text={this.state.successMsg.toString()}
          onConfirm={() => {
            this.setState({ fetchSuccess: false }, () => {
              this.props.history.push('/dashboard');
            });
          }}
        />
        <SweetAlert
          show={this.state.fetchError}
          showConfirmButton
          type="error"
          title="Error"
          text={this.state.errorText.toString()}
          onConfirm={() => {
                this.setState({ fetchError: false });
            }}
        />
        <SweetAlert
          show={this.state.valueError}
          showConfirmButton
          type="error"
          title="Error"
          text="Markup value can't be larger than original price."
          onConfirm={() => {
                this.setState({ valueError: false });
            }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // dataset: state.dataset,
  // profile: state.user
});

export default connect(mapStateToProps)(SetTable);
