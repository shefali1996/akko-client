import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import { Grid, Row, Col, Button, Label, Image } from 'react-bootstrap';
import { Input, Select, Checkbox, Spin } from 'antd';
import {filter, isEmpty, isNull} from 'lodash';
import {getProduct, parseVariants} from '../helpers/Csv';
import { invokeApig } from '../libs/awsLib';
import * as dashboardActions from '../redux/dashboard/actions';

const Option = Select.Option;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variants: [],
      loading:  false,
    };
    this.getProductCount = this.getProductCount.bind(this);
    this.getProductCountWithCogs = this.getProductCountWithCogs.bind(this);
    this.getProductCountWithoutCogs = this.getProductCountWithoutCogs.bind(this);
    this.saveData = this.saveData.bind(this);
    this.goDashboard = this.goDashboard.bind(this);
    this.variants = [];
  }

  componentWillReceiveProps(props) {
    const {data, isProductLoading, isVariantsLoading} = props.productData;
    this.setState({
      variants: parseVariants(data.variants),
      loading:  !!(isProductLoading || isVariantsLoading)
    });
  }

  componentDidMount() {
    const variantsInfo = this.props.productData.data.variants;
    if (!isEmpty(variantsInfo)) {
      this.setState({
        variants: parseVariants(variantsInfo)
      });
    }
    this.props.getProducts().then((products) => {
      this.props.getVariants(products);
    });
  }
  goDashboard() {
    this.props.history.push('/dashboard');
  }

  getProductCount() {
    return this.state.variants.length;
  }

  getProductCountWithCogs() {
    return filter(this.state.variants, (o) => {
      return !isEmpty(o.variant_details.cogs) && !isNull(o.variant_details.cogs) && o.variant_details.cogs !== 'null' && o.variant_details.cogs !== 'invalid';
    }).length;
  }

  getProductCountWithoutCogs() {
    return filter(this.state.variants, (o) => {
      return isEmpty(o.variant_details.cogs) || isNull(o.variant_details.cogs) || o.variant_details.cogs === 'null' || o.variant_details.cogs === 'invalid';
    }).length;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Setting));
