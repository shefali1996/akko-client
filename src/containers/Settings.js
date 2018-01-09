import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Image } from 'react-bootstrap';
import { Input, Select, Checkbox, Spin } from 'antd';
import {getProduct, parseVariants} from '../helpers/Csv';
import { invokeApig } from '../libs/awsLib';

const Option = Select.Option;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variants: false,
      loading:  false,
    };
    this.getProductCount = this.getProductCount.bind(this);
    this.getProductCountWithCogs = this.getProductCountWithCogs.bind(this);
    this.getProductCountWithoutCogs = this.getProductCountWithoutCogs.bind(this);
    this.saveData = this.saveData.bind(this);
    this.goDashboard = this.goDashboard.bind(this);
    this.variants = [];
  }

  componentDidMount() {
    const variantsInfo = JSON.parse(localStorage.getItem('variantsInfo'));
    if (variantsInfo) {
      this.setState({
        variants: parseVariants(variantsInfo)
      });
    }
    this.getProduct();
  }
  goDashboard() {
    this.props.history.push('/dashboard');
  }
  getProduct() {
    getProduct().then((res) => {
      this.getVariants(res.products);
    }).catch((err) => {
      console.log('Error in getProduct', err);
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
        const variantsList = parseVariants(this.variants);
        this.setState({
          variants: variantsList || [],
          loading:  false
        });
        this.variants = [];
      }
    }).catch(error => {
      this.setState({loading: false});
      console.log('Error Product Details', error);
    });
  }
  getProductCount() {
    const {variants} = this.state;
    return variants ? variants.length : 0;
  }

  getProductCountWithCogs() {
    const {variants} = this.state;
    if (variants) {
      return _.filter(variants, (o) => {
        return !_.isEmpty(o.variant_details.cogs) && !_.isNull(o.variant_details.cogs) && o.variant_details.cogs !== 'null';
      }).length;
    }
    return 0;
  }

  getProductCountWithoutCogs() {
    const {variants} = this.state;
    if (variants) {
      return _.filter(variants, (o) => {
        return _.isEmpty(o.variant_details.cogs) || _.isNull(o.variant_details.cogs) || o.variant_details.cogs === 'null';
      }).length;
    }
    return 0;
  }

  saveData() {

  }

  render() {
    return (
      <div>
        <Grid className="login-layout">
          <Row>
            <Col md={12}>
              <Col md={6} className="text-left padding-t-20">
                <Label className="login-title">
                  akko
                </Label>
              </Col>
              <Col md={6} className="text-right padding-t-20">
                <Button className="close-button" onClick={this.goDashboard} />
              </Col>
            </Col>
          </Row>
          <Row className="account-setup-header">
            <span className="account-comment">
              Settings
            </span>
          </Row>
          <div className="text-center margin-t-40">
            <span className="update-style-title">
              UPDATE COGS
            </span>
          </div>
          <div className="text-center margin-t-40">
            {this.state.loading ? <span className="update-style-text"><Spin /></span> : null}
            <span className="update-style-text margin-t-20">
              You have <strong>{this.getProductCount()}</strong> products/variants.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>{this.getProductCountWithCogs()}</strong> products have COGS set.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>{this.getProductCountWithoutCogs()}</strong> products need COGS.
            </span>
          </div>
          <div className="text-center margin-t-50">
            <Button className="login-button" onClick={() => { this.props.history.push('/set-cogs'); }}>
                SET COGS
            </Button>
          </div>
          <div className="hide hide-inventory-alert-section">
            <div className="text-center margin-t-60">
              <span className="update-style-title">
              INVENTORY ALERTS
              </span>
            </div>
            <div className="text-center margin-t-20">
              <span className="inventory-alert-text margin-t-20">
              Alerts are triggered when you don't have enough inventory in stock to serve your rate of sales.
              </span>
            </div>
            <div className="inventory-form text-center margin-t-40">
              <span className="inventory-alert-text">
              Trigger alert when I don't have enough stock for
              </span>
              <span className="inventory-alert-text input-field">
                <Input placeholder="20" onChange={(e) => this.setState({timePeriod: e.target.value})} />
              </span>
              <span className="inventory-alert-text">
                <Select defaultValue="days" style={{ width: 120 }} onChange={(value) => this.setState({unit: value})}>
                  <Option value="days">Days</Option>
                  <Option value="months">Months</Option>
                  <Option value="weeks">Weeks</Option>
                </Select>
              </span>
            </div>
            <div className="text-center margin-t-20">
              <span className="inventory-alert-text margin-t-20">
              How do you want to receive alerts?
              </span>
              <span className="inventory-alert-text inventory-alert-checkbox">
                <span><Checkbox className="margin-l-5 margin-r-10" onChange={(e) => this.setState({inAppChecked: e.target.checked})} checked disabled />In App</span>
                <span><Checkbox className="margin-r-10" onChange={(e) => this.setState({emailChecked: e.target.checked})} />Email</span>
              </span>
            </div>
            <div className="text-center margin-t-60">
              <span className="inventory-btn-wrapper">
                <Button className="inventory-button btn-savenclose" onClick={this.goDashboard}>
                SAVE AND CLOSE
                </Button>
                <Button className="inventory-button btn-cancel" onClick={this.goDashboard}>
                  CANCEL
                </Button>
              </span>
            </div>
          </div>
          <div className="text-center margin-t-60" />
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(Setting);
