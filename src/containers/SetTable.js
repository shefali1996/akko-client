import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import { Grid, Row, Col, Button, Label, FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';
import SearchInput, { createFilter } from 'react-search-input';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import SweetAlert from 'sweetalert-react';
import { Switch, Progress, Spin } from 'antd';
import {isEmpty, isNull} from 'lodash';
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
import { KEYS_TO_FILTERS_VARIANTS, convertInventoryJSONToObject, isNumeric, numberFormatter, pollingInterval } from '../constants';
import { invokeApig } from '../libs/awsLib';
import {
  checkAndUpdateProductCogsValue,
  beautifyDataForCogsApiCall,
  moveAcceptedToBottom,
  sortByCogs,
  getProduct,
  parseVariants,
  getTipBoxMessage
} from '../helpers/Csv';
import MaterialIcon from '../assets/images/MaterialIcon 3.svg';
import TipBox, {tipBoxMsg} from '../components/TipBox';
import * as dashboardActions from '../redux/dashboard/actions';

const INVALID_COGS = 'invalid';

class SetTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markup:            '',
      data:              [],
      searchTerm:        '',
      selectedOption:    'option1',
      selectedRows:      [],
      fetchError:        false,
      errorText:         '',
      fetchSuccess:      false,
      successMsg:        '',
      hideCompleted:     true,
      valueError:        false,
      loading:           false,
      inProgressSetCogs: false,
      pendingRequest:    false,
    };
    this.onFinish = this.onFinish.bind(this);
    this.onMarkUpChange = this.onMarkUpChange.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);
    this.onSetMarkup = this.onSetMarkup.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.doToggleRows = this.doToggleRows.bind(this);
    this.renderProgressBar = this.renderProgressBar.bind(this);
  }

  componentWillMount() {
    const selectedBusinessType = localStorage.getItem('businessType');
    if (selectedBusinessType) {
      this.setState({
        selectedBusinessType
      });
    } else {
      this.props.history.push('/business-type');
    }
  }
  componentWillReceiveProps(props) {
    const {data, isProductLoading, isVariantsLoading} = props.productData;
    let variants = [];
    if (!isEmpty(data.variants) && !this.state.inProgressSetCogs) {
      const variantsList = parseVariants(data.variants);
      variants = sortByCogs(variantsList);
    }
    this.setState({
      data:    variants,
      loading: !!(isProductLoading || isVariantsLoading)
    });
  }
  componentDidMount() {
    const variantsInfo = this.props.productData.data.variants;
    if (!isEmpty(variantsInfo)) {
      const variantsList = parseVariants(variantsInfo);
      this.setState({
        data: sortByCogs(variantsList)
      });
    }
    this.onVariantUpdate();
    this.loadInterval = setInterval(() => {
      this.onVariantUpdate();
    }, pollingInterval);
  }
  componentWillUnmount() {
    clearInterval(this.loadInterval);
    this.setState({data: []});
  }
  onVariantUpdate() {
    const variantsInfo = this.props.productData.data.variants;
    if (!isEmpty(variantsInfo)) {
      this.props.updateVariants(variantsInfo);
    } else {
      this.props.getProducts().then((products) => {
        this.props.getVariants(products);
      }).catch((err) => {
        this.setState({
          errorText:  err,
          fetchError: true
        });
      });
    }
  }
  onMarkUpChange(e) {
    this.setState({ markup: e.target.value });
  }
  onMarkUpFocus = (e) => {
    this.refs.markupError.hide();
  }

  onSkip() {
    this.props.history.push('/dashboard');
  }

  onFinish() {
    const { data } = this.state;
    const pendingCogs = false;
    const pendingCogsProducts = data.filter((item) => {
      return item.cogsValidateStatus !== true;
    });
    this.setState({
      pendingRequest: true,
    });
    const cogsFinal = beautifyDataForCogsApiCall(data);
    this.props.fireSetCogsAPI(cogsFinal).then((results) => {
	  this.setState({
	    successMsg:        `COGS successfully set for ${cogsFinal.variants.length} products`,
	    fetchSuccess:      true,
	    inProgressSetCogs: false,
	    pendingRequest:    false,
	  });
    }).catch(error => {
	  this.setState({
	    errorText:         error,
	    fetchError:        true,
	    inProgressSetCogs: false,
	    pendingRequest:    false,
	  });
    });
  }

  onSetMarkup() {
    const {markup, data, selectedRows, selectedOption} = this.state;
    let error = false;
    if (markup < 0) {
      error = 'Markup cannot be negative';
    } else if (!isNumeric(markup)) {
      error = 'Invalid value for Markup';
    } else if (selectedRows.length <= 0) {
      error = 'Select one or more products before setting markup';
    }

    if (error === false) {
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
            cogs = (productPrice - markup).toFixed(2);
          }
          const newData = checkAndUpdateProductCogsValue(cogs, product, data);
          this.setState({
            data:              sortByCogs(newData),
            inProgressSetCogs: true
          });
        }
      });
      this.setState({
        markup:       '',
        selectedRows: []
      });
    } else {
      this.setState({markupError: error});
      this.refs.markupError.show();
    }
  }

  handleOptionChange(e) {
    this.setState({
      selectedOption: e.target.value
    });
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
      this.setState({
        selectedRows,
        inProgressSetCogs: true
      });
    } else {
      const i = selectedRows.indexOf(row.id);
      if (i !== -1) {
        selectedRows.splice(i, 1);
      }
      this.setState({
        selectedRows,
        inProgressSetCogs: !!selectedRows.length
      });
    }
  }

  onSelectAll(isSelected, rows) {
    const idArray = [];
    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        idArray.push(rows[i].id);
      }
      this.setState({
        selectedRows:      idArray,
        inProgressSetCogs: true
      });
    } else {
      this.setState({
        selectedRows:      [],
        inProgressSetCogs: false
      });
    }
    return true;
  }

  onCogsChange(e, row) {
    const {data} = this.state;
    const index = data.findIndex((element) => {
      return element.id === row.id;
    });
    if (index > -1) {
      const cogsValue = data[index].variant_details.cogs;
      let value = e.target.value;
      if (isEmpty(value)) {
        value = INVALID_COGS;// cogsValue;
      }
      data[index].cogs = value;
    }
    this.setState({data});
  }

  onCogsBlur(e, row) {
    const {data} = this.state;
    if (row.variant_details.cogs !== row.cogs) {
      const newData = checkAndUpdateProductCogsValue(e.target.value, row, data);
      this.setState({
        // data:              moveAcceptedToBottom(newData, row),
        data:              newData,
        inProgressSetCogs: true
      });
    }
  }

  cogsValueFormatter(cell, row) {
    let warningMessage = null;
    let cogsValue = cell.cogs;
    if (row.cogs) {
      cogsValue = row.cogs;
    }
    if (!isEmpty(cogsValue) && cogsValue !== null && cogsValue !== INVALID_COGS) {
      warningMessage = (<div>
        <span className="cogs-completed" />
                        </div>);
    } else {
      warningMessage = (<div title={row.cogsValidateStatus}>
        <span className="cogs-pending" />
                        </div>);
    }
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
          value={cogsValue}
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
            {this.state.hideCompleted ? 'Hiding completed' : 'Showing completed'}
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
    const { searchTerm, markup, loading, selectedRows, selectedBusinessType } = this.state;
    let { data } = this.state;
    const countTotal = data.length;
    const pendingProducts = data.filter((item) => {
      return isEmpty(item.variant_details.cogs) || isNull(item.variant_details.cogs) || item.variant_details.cogs === INVALID_COGS;
    });
    const countPending = pendingProducts.length;
    const countCompleted = countTotal - countPending;
    if (this.state.hideCompleted) {
      data = pendingProducts;
    }
    const filteredData = data.filter(createFilter(searchTerm, KEYS_TO_FILTERS_VARIANTS));
    const selectRowProp = {
      mode:            'checkbox',
      customComponent: customMultiSelect,
      onSelect:        this.onRowSelect.bind(this),
      onSelectAll:     this.onSelectAll.bind(this),
      selected:        selectedRows
    };
    const options = {
      sizePerPageDropDown: renderSizePerPageDropDown,
      paginationPanel:     renderSetTablePaginationPanel,
      paginationSize:      7,
      prePage:             '«   Previous',
      nextPage:            'Next   »',
      withFirstAndLast:    false,
      sortIndicator:       false,
      sizePerPage:         50,
      noDataText:          loading ? <Spin /> : 'No data found'
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
                  <OverlayTrigger
                    placement="left"
                    trigger="manual"
                    ref="markupError"
                    overlay={
                      <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" />{this.state.markupError}</Tooltip>
                    }>
                    <FormControl
                      type="text"
                      className="markup-input"
                      value={markup}
                      onFocus={this.onMarkUpFocus}
                      onChange={this.onMarkUpChange}
                  />
                  </OverlayTrigger>
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
                    <div style={{marginLeft: 10, display: this.state.pendingRequest ? 'inline-block' : 'none'}}>
                      <Spin size="small" />
                    </div>
                  </Button>
                </Col>
              </div>
            </Col>
            <Col md={3}>
              <TipBox message={getTipBoxMessage(selectedBusinessType)} />
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

const mapStateToProps = state => {
  return {
    productData: state.products.products,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProducts: () => {
      return dispatch(dashboardActions.getProducts());
    },
    getVariants: (products) => {
      return dispatch(dashboardActions.getVariants(products));
    },
    updateVariants: (variantsInfo) => {
      return dispatch(dashboardActions.updateVariants(variantsInfo));
    },
    fireSetCogsAPI: (params) => {
      return dispatch(dashboardActions.fireSetCogsAPI(params));
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SetTable));
