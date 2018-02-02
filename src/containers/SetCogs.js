import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import { Grid, Row, Col, Button, Image } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
import { Spin } from 'antd';
import {isEmpty} from 'lodash';
import cogs1 from '../assets/images/cogs1.svg';
import cogs2 from '../assets/images/cogs2.svg';
import cogs3 from '../assets/images/cogs3.svg';
import TipBox, {tipBoxMsg} from '../components/TipBox';
import HeaderWithCloseAndAlert from '../components/HeaderWithCloseAndAlert';
import {getProduct, getTipBoxMessage, isCogsPending} from '../helpers/Csv';
import * as dashboardActions from '../redux/dashboard/actions';

class SetCogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:            [],
      option:          '',
      alertShow:       false,
      loading:         false,
      loadingVariants: false
    };
    this.onSkip = this.onSkip.bind(this);
    this.onTypeOneSelected = this.onTypeOneSelected.bind(this);
    this.onTypeTwoSelected = this.onTypeTwoSelected.bind(this);
    this.onTypeThreeSelected = this.onTypeThreeSelected.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.variants = [];
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
    this.props.getProducts().then((products) => {
      this.props.getVariants(products);
    });
  }
  componentWillReceiveProps(props) {
    this.setState({
      data:    props.productData.data,
      loading: props.productData.isProductLoading
    });
  }

  onTypeOneSelected() {
    this.setState({ option: 'one' });
    this.props.history.push('/set-table');
  }

  onTypeTwoSelected() {
    this.setState({ option: 'two' });
    this.props.history.push('/set-csv');
  }

  onTypeThreeSelected() {
    this.setState({ option: 'three' });
    this.props.history.push('/set-table');
  }

  onSkip() {
    const status = isCogsPending();
    if (status === 'undefined' || this.state.loadingVariants === true) {
      alert('Wait while data is loading...');
    } else if (status === true) {
      this.setState({ alertShow: true });
    } else if (status === false) {
      this.onConfirm();
    }
  }

  onConfirm() {
    this.setState({ alertShow: false });
    this.props.history.push('/dashboard');
  }

  getNumOfVariants(productData) {
    let numOfVariants = 0;
    !isEmpty(productData) && productData.products.map((product, i) => {
      numOfVariants += product.numVariants;
    });
    return numOfVariants;
  }
  render() {
    const { option, data, loading, selectedBusinessType, loadingVariants } = this.state;
    return (
      <div>
        <Grid className="login-layout">
          <HeaderWithCloseAndAlert pageTitle="Account Setup" loadingVariants={loadingVariants} {...this.props} />
          <Row>
            <Col md={6} mdOffset={3}>
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
                    ( you can update these anytime from the Settings menu )
                </span>
              </div>
              <div className="flex-center margin-t-40">
                <span className="select-style-comment">
                    We found {loading ? <Spin /> : this.getNumOfVariants(data.products)} product-variants from your shop. How do you
                </span>
              </div>
              <div className="flex-center margin-t-5">
                <span className="select-style-comment">
                    want to set COGS for all these products?
                </span>
              </div>
              <div className="flex-center margin-t-40">
                <div className={option === 'one' ? 'flex-center active-border' : 'style-container flex-center'} onClick={this.onTypeOneSelected}>
                  <div className="style-icon-view">
                    <Image src={cogs1} className="business-icon" />
                  </div>
                  <div className="style-text-view">
                    <span className="select-text-large">
                        ENTER MANUALLY
                    </span>
                    <span className="select-text-small">
                        Enter COGS for each product manually.
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-center margin-t-10">
                <div className={option === 'two' ? 'flex-center active-border' : 'style-container flex-center'} onClick={this.onTypeTwoSelected}>
                  <div className="style-icon-view">
                    <Image src={cogs2} className="business-icon" />
                  </div>
                  <div className="style-text-view">
                    <span className="select-text-large">
                      UPLOAD CSV
                    </span>
                    <span className="select-text-small">
                      We will prefill the SKUs in a CSV which you can download, enter
                    </span>
                    <span className="select-text-small">
                      COGS and upload.
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-center margin-t-10">
                <div className={option === 'three' ? 'flex-center active-border' : 'style-container flex-center'} onClick={this.onTypeThreeSelected}>
                  <div className="style-icon-view">
                    <Image src={cogs3} className="business-icon" />
                  </div>
                  <div className="style-text-view">
                    <span className="select-text-large">
                      SET MARKUP
                    </span>
                    <span className="select-text-small">
                      You can set the markup that you charge and we can back
                    </span>
                    <span className="select-text-small">
                      calculate your COGS by comparing it against your selling price.
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <TipBox message={getTipBoxMessage(selectedBusinessType)} />
            </Col>
          </Row>
          <div className="text-center margin-t-50">
            <Button className="skip-button" style={{height: 'auto'}} onClick={this.onSkip} disabled={!!loadingVariants}>
              {!loadingVariants ? 'SKIP FOR NOW' :
              <div>
                <div>Loading...</div>
                <div><Spin /></div>
              </div>
              }
            </Button>
          </div>
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
        </Grid>
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
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SetCogs));
