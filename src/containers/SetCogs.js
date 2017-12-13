import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Image } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
import { convertInventoryJSONToObject } from '../constants';
import { invokeApig } from '../libs/awsLib';

import cogs1 from '../assets/images/cogs1.svg';
import cogs2 from '../assets/images/cogs2.svg';
import cogs3 from '../assets/images/cogs3.svg';
import TipBox, {tipBoxMsg} from '../components/TipBox';
import HeaderWithCloseAndAlert from '../components/HeaderWithCloseAndAlert';

class SetCogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      option: '',
      alertShow: false
    };
    this.onSkip = this.onSkip.bind(this);
    this.onTypeOneSelected = this.onTypeOneSelected.bind(this);
    this.onTypeTwoSelected = this.onTypeTwoSelected.bind(this);
    this.onTypeThreeSelected = this.onTypeThreeSelected.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getProduct();
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
    this.setState({ alertShow: true });
    // let {option} = this.state;
    // if(option.length > 0) {
    //     this.props.history.push('/set-csv');
    // }
  }

  onConfirm() {
    this.setState({ alertShow: false });
    this.props.history.push('/financial_insights');
  }

  getProduct() {
    if (localStorage.getItem('inventoryInfo') === null) {
      this.products().then((results) => {
        const products = convertInventoryJSONToObject(results.variants);
        this.setState({ data: products });
        localStorage.setItem('inventoryInfo', JSON.stringify(products));
      })
        .catch(error => {
          console.log(error);
        });
    } else {
      const existingProducts = JSON.parse(localStorage.getItem('inventoryInfo'));
      this.setState({ data: existingProducts });
    }
  }

  products() {
    return invokeApig({ path: '/inventory' });
  }

  render() {
    const { option, data } = this.state;
    return (
      <div>
        <Grid className="login-layout">
          <HeaderWithCloseAndAlert pageTitle="Account Setup" {...this.props} />
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
                    We found {data.length} product-variants from your shop. How do you
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
              <TipBox message={tipBoxMsg.cogsValue} />
            </Col>
          </Row>
          <div className="text-center margin-t-50">
            <Button className="skip-button" onClick={this.onSkip}>
                SKIP FOR NOW
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

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(SetCogs);
