import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import SweetAlert from 'sweetalert-react';
import { ToastContainer, ToastMessageAnimated } from 'react-toastr';
import Papa from 'papaparse';
import { Spin } from 'antd';
import { getProductValue, convertInventoryJSONToObject, exportCSVFile, headers } from '../constants';
import { invokeApig } from '../libs/awsLib';
import cogs2 from '../assets/images/cogs2.svg';
import { beautifyUploadedCsvData, validateCogsValue, getProduct, sortByCogs, parsVariants, beautifyDataForCogsApiCall } from '../helpers/Csv';
import TipBox, {tipBoxMsg} from '../components/TipBox';
import HeaderWithCloseAndAlert from '../components/HeaderWithCloseAndAlert';

const ToastMessageFactory = React.createFactory(ToastMessageAnimated);

class SetCsv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:              [],
      importedCSV:       null,
      alertShow:         false,
      cogsValueShow:     false,
      fetchError:        false,
      errorText:         '',
      totalProductCount: 0,
      selectedCogsValue: 0,
      loading:           false,
    };
    this.onConnect = this.onConnect.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.csvButtonClicked = this.csvButtonClicked.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCogsConfirm = this.onCogsConfirm.bind(this);
    this.variants = [];
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getProduct();
  }

  onDrop(files) {
    this.setState({
      importedCSV: files[0]
    });
    this.container.success(
      '',
      'Upload CSV file is success. Click Submit button for next step', {
        timeOut:         2000,
        extendedTimeOut: 2000
      });
  }

  onSkip() {
    this.setState({ alertShow: true });
  }

  onConfirm() {
    this.setState({ alertShow: false });
    this.props.history.push('/dashboard');
  }

  onCogsConfirm() {
    const {totalProductCount, selectedCogsValue} = this.state;
    this.setState({ cogsValueShow: false });
    if (totalProductCount !== selectedCogsValue) {
      this.props.history.push('/set-table');
    } else {
      this.props.history.push('/dashboard');
    }
  }
  fireSetCogsAPI(params) {
    return invokeApig({
      path:   '/products',
      method: 'PUT',
      body:   params
    });
  }
  onConnect() {
    const $this = this;
    const { data } = this.state;
    const { importedCSV } = this.state;
    if (importedCSV !== null) {
      // this.props.history.push('/set-table');
      Papa.parse(importedCSV, {
        complete(results) {
          // start
          const updatedProducts = [];
          let nullCogsCount = 0;
          const beautyData = beautifyUploadedCsvData(results.data);
          data.forEach((product) => {
            beautyData.csvData.forEach((csvProduct) => {
              if (product.id === csvProduct.id) {
                product.cogs = csvProduct.cogs;
                product.variant_details.cogs = csvProduct.cogs;
              }
            });
            const cogsValidateStatus = validateCogsValue(product.variant_details.cogs, product.variant_details.price);
            if (cogsValidateStatus === true) {

            } else {
              nullCogsCount++;
              product.cogs = '';
              product.variant_details.cogs = '';
            }
            product.cogsValidateStatus = cogsValidateStatus;
            updatedProducts.push(product);
          });
          // end
          const cogsFinal = beautifyDataForCogsApiCall(data);
          $this.fireSetCogsAPI(cogsFinal).then((results) => {
            $this.setState({
              totalProductCount: updatedProducts.length,
              selectedCogsValue: updatedProducts.length - nullCogsCount,
              cogsValueShow:     true
            });
          }).catch(error => {
            this.setState({
              errorText:  error,
              fetchError: true
            });
          });
        }
      });
    }
  }
  getProduct() {
    getProduct().then((res) => {
      this.getVariants(res.products);
    }).catch((err) => {
      this.setState({
        errorText:  err,
        fetchError: true
      });
    });
  }

  getVariants(products, i = 0) {
    this.setState({ loading: true });
    const next = i + 1;
    invokeApig({
      path:        `/products/${products[i].productId}`,
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
          data:    variantsList ? sortByCogs(variantsList) : [],
          loading: false
        });
        this.variants = [];
      }
    }).catch(error => {
      this.setState({loading: false});
      console.log('Error Product Details', error);
    });
  }

  csvButtonClicked() {
    const { data } = this.state;
    exportCSVFile(headers, getProductValue(data), 'variants');
  }

  render() {
    const { totalProductCount, selectedCogsValue } = this.state;
    const restProduct = totalProductCount - selectedCogsValue;
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
              <div className="content-center margin-t-40">
                <Col md={7} className="no-padding">
                  <div>
                    <div className="step-one-view">
                      <span className="step-title">
                        STEP 1:
                      </span>
                      <span className="step-content">
                        &nbsp;Download CSV
                      </span>
                    </div>
                    <div className="margin-t-20 text-center">
                      <span className="step-content">
                        We have pre-filled this CSV file with your SKUs. Just download the file, enter the COGS values and upload it.
                      </span>
                    </div>
                    <div className="step-one-view margin-t-30">
                      <span className="step-title">
                        STEP 2:
                      </span>
                      <span className="step-content">
                        &nbsp;Fill COGS values
                      </span>
                    </div>
                    <div className="step-one-view margin-t-30">
                      <span className="step-title">
                        STEP 3:
                      </span>
                      <span className="step-content">
                        &nbsp;Upload the finished CSV file
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={5} className="flex-right no-padding">
                  <div className="style-icon-view">
                    {this.state.loading ? <Spin /> : <Image src={cogs2} className="business-icon cursor-pointer" onClick={this.csvButtonClicked} />}
                  </div>
                </Col>
              </div>
              <div className="margin-t-20">
                <Dropzone
                  accept="text/csv"
                  onDrop={this.onDrop.bind(this)}
                  className="drag-view"
                >
                  <span className="drag-text">
                    drag and drop your finished CSV file here
                  </span>
                </Dropzone>
              </div>
              <div className="flex-center margin-t-20">
                <span className="step-content">
                  (or)
                </span>
              </div>
              <div className="flex-center margin-t-20">
                <Dropzone
                  accept="text/csv"
                  onDrop={this.onDrop.bind(this)}
                  className="upload-csv-button"
                >
                    UPLOAD CSV
                </Dropzone>
              </div>
              <div className="content-center margin-t-40">
                <Col md={6} className="text-left no-padding">
                  <Button className="skip-button" onClick={this.onSkip}>
                      SKIP FOR NOW
                  </Button>
                </Col>
                <Col md={6} className="text-right no-padding">
                  <Button className="login-button" onClick={this.onConnect}>
                      SUBMIT
                  </Button>
                </Col>
              </div>
            </Col>
            <Col md={3}>
              <TipBox message={tipBoxMsg.cogsValue} />
            </Col>
          </Row>
          <SweetAlert
            show={this.state.alertShow}
            showConfirmButton
            showCancelButton
            type="warning"
            title="Confirm"
            text="We cannot calculate Gross Profit figures without COGS information. You can also set/update these figures later from the Settings menu"
            onConfirm={this.onConfirm}
            onCancel={() => {
                  this.setState({ alertShow: false });
              }}
          />
          <SweetAlert
            show={this.state.cogsValueShow}
            showConfirmButton
            showCancelButton
            type="success"
            title="Confirm"
              // text={"COGS set for ``99/110 products. 11 products are still missing COGS"}
            text={`COGS set for ${selectedCogsValue}/${totalProductCount} products.${restProduct} products are still missing COGS`}
            onConfirm={this.onCogsConfirm}
            onCancel={() => {
                  this.setState({ cogsValueShow: false });
              }}
          />
          <ToastContainer
            ref={(toast) => { this.container = toast; }}
            toastMessageFactory={ToastMessageFactory}
            className="toast-top-right"
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
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(SetCsv);
