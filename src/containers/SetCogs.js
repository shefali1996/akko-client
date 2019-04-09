import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Grid, Row, Col, Button, Label, FormControl, Tooltip, OverlayTrigger, Image } from 'react-bootstrap';
import SearchInput, { createFilter } from 'react-search-input';
import swal from 'sweetalert2';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style'
import isEmpty from "lodash/isEmpty"
import isEqual from "lodash/isEqual"
import cloneDeep from "lodash/cloneDeep"

import HeaderWithCloseAndAlert from '../components/HeaderWithCloseAndAlert';
import { KEYS_TO_FILTERS_VARIANTS, INVALID_COGS, convertInventoryJSONToObject, isNumeric, numberFormatter, pollingInterval, PRODUCT, VARIANT } from '../constants';
import { invokeApig } from '../libs/awsLib';
import { beautifyDataForCogsApiCall, getTipBoxMessage, validateCogsValue } from '../helpers/Csv';
import TipBox from '../components/TipBox';
import MarkupAndCsv from '../components/MarkupAndCsv';
import SetCogsTable from '../components/SetCogsTable';
import styles from '../constants/styles';
import * as dashboardActions from '../redux/dashboard/actions';
import { RenderProgressBar } from '../components/dataTable';
import closeIcon from "../assets/images/closeIcon.svg"


class SetCogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:                {},
      tableData:           [],
      selectedRows:        [],
      numSelectedVariants: 0,
      searchTerm:          '',
      hideCompleted:       false,
      inProgressSetCogs:   false,
      pendingRequest:      false,
      fetchSuccess:        false,
      fetchError:          false,
      successMsg:          '',
      errorText:           '',
      progress:            {        
        total:     0,
        pending:   0,
        completed: 0
      },
      setMark:            0,
      setCog:             0,
    };
    this.onFinish = this.onFinish.bind(this);
    this.updateTableData = this.updateTableData.bind(this);
    this.doToggleRows = this.doToggleRows.bind(this);
    this.onSkip = this.onSkip.bind(this);
  }

  componentWillMount(){
    if(this.props.productData.data.products.length != 0){
      const {data, isProductLoading, isVariantsLoading} = this.props.productData;
      if (!isEqual(data, this.state.data) && !this.state.inProgressSetCogs) {
        this.setState({
          data,
          loading: !!(isProductLoading || isVariantsLoading),
        });
        this.updateTableData(data);
      } else {
        this.setState({
          loading: !!(isProductLoading || isVariantsLoading)
        });
      }
    }
  }

  componentWillReceiveProps(props) {    
    const {data, isProductLoading, isVariantsLoading} = props.productData;
    if (!isEqual(data, this.state.data) && !this.state.inProgressSetCogs) {
      this.setState({
        data,
        loading: !!(isProductLoading || isVariantsLoading),
      });
      this.updateTableData(data);
    } else {
      this.setState({
        loading: !!(isProductLoading || isVariantsLoading)
      });
    }
  }

  componentDidMount() {
    document.title = "Set COGS | Akko";
    const data = this.props.productData.data;
    if (!isEmpty(data.products) && !isEmpty(data.variants)) {
      this.setState({
        data
      });
    }
    if(this.props.productData.data.products.length == 0){ 
      this.getProductData();
    }
    if(screen.width<768){
      swal({
        type:              'warning',
        title:             `WARNING`,
        html:              "This page works best on larger screens. Please try again from a device with a larger screen, like a laptop or tablet",
        allowOutsideClick: false,
        confirmButtonText: 'Back',
        focusConfirm:      false,
      }).then(()=>{
        this.props.history.push("/dashboard")

      });
    }
  }

  componentWillUnmount() {
    this.setState({
      data: []
    });
  }

  updateTableData(data) {
    const {tableData} = cloneDeep(this.state);
    let initialData = [];
    const tData = [];
    let index = 0;
    if (!isEmpty(data.products)) {
      initialData = isEmpty(tableData) ? data.products : tableData;
      initialData.map((prod, i) => {
        if (prod.rowType !== VARIANT) {
          prod.id = prod.productId;
          prod.rowType = PRODUCT;
          prod.numVariants = prod.variants.length;
          prod.expanded = prod.variants.length;
          prod.hidden = false;
          prod.index = index;
          tData.push(prod);
          index += 1;
          prod.variants.map((v, i) => {
            const variant = {
              id:           v.variantId,
              rowType:      VARIANT,
              productId:    v.productId,
              productTitle: prod.productTitle,
              variant:      v,
              index
            };
            variant.hidden = !prod.expanded;
            tData.push(variant);
            index += 1;
          });
        }
      });
      this.setState({
        tableData: tData
      }, () => {
        this.countProgress();
      });
    }
  }
  getProductData() {
    this.props.getProducts().then((products) => {
      this.props.getVariants(products);
    }).catch((err) => {
      this.setState({
        errorText:  err,
        fetchError: true
      });
      this.swalertFetchError();
    });
  }
  doToggleRows(checked) {
    this.setState({
      hideCompleted: checked
    });
  }
    countProgress = () => {
      const {tableData, progress} = this.state;
      let {total, pending, completed} = progress;
      const variantsInfo = tableData.filter((item) => {
        return item.rowType === VARIANT;
      });
      total = variantsInfo.length;
      const pendingProducts = variantsInfo.filter((item) => {
        if (item.cogs) {
          return validateCogsValue(item.cogs, item.variant.price) !== true;
        }
        return validateCogsValue(item.variant.cogs, item.variant.price) !== true;
      });
      pending = pendingProducts.length;
      completed = total - pending;
      this.setState({
        progress: {
          total,
          pending,
          completed
        }
      });
    }
    onFinish() {
      const {tableData} = this.state;
      this.setState({
        pendingRequest: true,
      });
      const cogsFinal = beautifyDataForCogsApiCall(tableData);
      if (cogsFinal.numInvalidCogs > 0) {
        this.setState({
          errorText:            `${cogsFinal.numInvalidCogs} of your COGS entries are invalid. Those rows are marked in red.`,
          showInvalidCogsError: true,
          cogsFinal,
          tableData:            cogsFinal.tData
        });
        this.swalertShowInvalidCogsError(this.state.errorText);
      } else {
        this.setState({
          cogsFinal
        }, () => {
          this.updateCogs();
        });
      }
    }
    updateCogs = () => {
      const setcog = this.state.setCog + 1;
      const {cogsFinal} = this.state;
      this.setState({
        setCog:  setcog,
        setMark: 0,
      })
      this.props.fireSetCogsAPI({
        cogs: cogsFinal.variants
      }).then((results) => {
        if(results == undefined){
          this.setState({
            setCog:            0,
            errorText:         "Failed to fetch",
            fetchError:        true,
            inProgressSetCogs: false,
            pendingRequest:    false,
          });
          this.swalertFetchError();
        } else{
          this.setState({
            successMsg:        `COGS successfully set for ${cogsFinal.variants.length} products`,
            setCog:            0,
            fetchSuccess:      true,
            inProgressSetCogs: false,
            pendingRequest:    false,
          });
          this.swalertFetchSuccess();
          this.getProductData();
        }
      }).catch(error => {
        this.setState({
          setCog:            0,
          errorText:         error,
          fetchError:        true,
          inProgressSetCogs: false,
          pendingRequest:    false,
        });
        this.swalertFetchError();
      });
    }
    onSkip() {
      this.props.history.push('/dashboard');
    }
    cogsChange = () => {
      const setmark = this.state.setMark + 1;
      this.setState({
        setMark: setmark
      });
    }
    setMarkup = (newData) => {
      const setmark = this.state.setMark + 1;
      this.setState({
        tableData:         newData,
        setMark:           setmark,
        inProgressSetCogs: true,
      });
    }
    deSelectAllRows = () => {
      this.setState({
        selectedRows:        [],
        numSelectedVariants: 0
      });
    }
    close = () => {
      const { setCog, setMark} = this.state;
      if(setCog >= setMark ){
        this.props.history.push('/dashboard');
      } else{
        swal({
          showConfirmButton:   true,
          showCancelButton:    true,
          confirmButtonText:   'Discard',
          cancelButtonText:    "Go Back",
          type:                'error',
          title:               'Error',
          text:                'You have unsaved changes'
        }).then((result) => {
          if (result.value) {
            this.props.history.push('/dashboard');
          } else if (result.dismiss === swal.DismissReason.cancel) {
               
          }
        })
      }
    }
    swalertFetchSuccess = () => {
      return swal({
        title:             'Success',
        type:              'success',
        text:              this.state.successMsg.toString(),
        allowOutsideClick: false,
        showConfirmButton: true,
      }).then(() => {
        this.setState({
            fetchSuccess: false
        }, () => {
        });
      })
    }
    
    swalertFetchError = () => {
      return swal({
        showConfirmButton:   true,
        type:               'error',
        title:              'Error',
        text:               this.state.errorText.toString()
      }).then(() => {
        this.setState({
          fetchError: false
        })
      })
    }
    
    swalertShowInvalidCogsError = (errorText) => {
      return swal({
        showConfirmButton:   true,
        showCancelButton:    true,
        confirmButtonText:   'Proceed',
        cancelButtonText:    "I'll fix it.",
        type:                'error',
        title:               'Error',
        text:                errorText.toString()
      }).then((result) => {
        if (result.value) {
          this.setState({
              showInvalidCogsError: false
          });
          this.updateCogs();
        } else if (result.dismiss === swal.DismissReason.cancel) {
          this.setState({
            showInvalidCogsError: false,
            pendingRequest:       false
          });   
        }
      })
    }
    render() {       
      const {data, loading, selectedRows, numSelectedVariants, hideCompleted, searchTerm, currentPage, rowsPerPage, progress} = this.state;
      const {tableData} = this.state;
      return (
        <div>
          {screen.width>=768 &&
          <Grid className="login-layout setcogs-container">
            <Row className="devider">
              <Col md={8} style={{ padding: '0' }}>
                <div className="text-left margin-t-10 main-heading" >
                  <span className="select-style-text">Set COGS
                     for your products
                  </span>
                </div>
                <div className="text-left">
                  <span className="select-style-comment" style={{ fontSize: '12px',fontWeight:500 }}>
                  We will use these Cost of Goods Sold (COGS) estimates to calculate your profits and margins                  </span>
                </div>
                </Col>
                <Col md={4} className="text-right set-cogs-close-button-wrapper">
                <MarkupAndCsv
                    selectedRows={selectedRows}
                    numSelectedVariants={numSelectedVariants}
                    tableData={tableData}
                    setMarkup={this.setMarkup}
                    deSelectAllRows={this.deSelectAllRows}
                    loading={loading}
                    progress={progress}
                    updateprogress={(progressStatus) => this.setState({progress: progressStatus})}
                    {...this.props}
                    />
                  <Button className="close-button-set-cogs close-cogs" onClick={this.close} >
                  <Image src={closeIcon}/>
                  </Button>
                </Col>
            </Row>
            <Row className="count-row ">
              <Col md={12} className="center-view" style={{ alignItems: 'normal' }}>
                <div className="margin-t-20 padding-0 completed-count">
                  <RenderProgressBar progress={progress} hideCompleted={this.state.hideCompleted} doToggleRows={this.doToggleRows} />
                </div>
              </Col>
              <Col
                md={12}
                className="center-view table-virtulized"
                style={{ alignItems: 'normal' }}>
                <SetCogsTable
                  tableData={tableData}
                  loading={loading}
                  cogsChange={this.cogsChange}
                  hideCompleted={hideCompleted}
                  selectedRows={selectedRows}
                  numSelectedVariants={numSelectedVariants}
                  searchTerm={searchTerm}
                  progress={progress}
                  updateParentState={(prop) => { this.setState(prop); }}
                  />
              </Col>
            </Row>
            <Row className="footer-set-cogs">
              <Col xsHidden sm={12} className="height-32" />
              <Col xs={12} sm={12} className="text-right">
                <Button className="set-cogs-finish-button" onClick={this.onFinish}>SET COGS
                  <div style={{ marginLeft: 10, display: this.state.pendingRequest ? 'inline-block' : 'none'}}>
                    <Spin size="small" />
                  </div>
                </Button>
              </Col>
            </Row>
          </Grid>}
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
    },
    cogsStatus: () => {
      return dispatch(dashboardActions.cogsStatus());
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SetCogs));
