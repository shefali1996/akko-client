import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Image } from 'react-bootstrap';
import { Input, Select, Checkbox } from 'antd';
import {getProduct} from '../helpers/Csv';

const Option = Select.Option;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: false
    };
    this.getProductCount = this.getProductCount.bind(this);
    this.getProductCountWithCogs = this.getProductCountWithCogs.bind(this);
    this.getProductCountWithoutCogs = this.getProductCountWithoutCogs.bind(this);
    this.getVariant = this.getVariant.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentWillMount() {
    const product = getProduct();
    this.setState({
      product
    });
  }

  getProductCount() {
    const {product} = this.state;
    return product ? product.length : 0;
  }

  getProductCountWithCogs() {
    const {product} = this.state;
    if (product) {
      return _.filter(product, (o) => { return !_.isEmpty(o.cogs); }).length;
    }
    return 0;
  }

  getProductCountWithoutCogs() {
    const {product} = this.state;
    if (product) {
      return _.filter(product, (o) => { return _.isEmpty(o.cogs); }).length;
    }
    return 0;
  }

  getVariant() {
    const {product} = this.state;
    if (product) {
      return _.filter(product, (o) => { return !_.isEmpty(o.variant); }).length;
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
                <Button className="logout-button" onClick={this.goLanding} />
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
            <span className="update-style-text margin-t-20">
              You have <strong>{this.getProductCount()}</strong> products in <strong>{this.getVariant()}</strong> variants.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>{this.getProductCountWithCogs()}</strong> products have COGS set.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>{this.getProductCountWithoutCogs()}</strong> products need COGS.
            </span>
          </div>
          <div className="text-center margin-t-50">
            <Button className="login-button" onClick={this.onConnect}>
                SET COGS
            </Button>
          </div>
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
                <Option value="weeks" disabled>Weeks</Option>
              </Select>
            </span>
          </div>
          <div className="text-center margin-t-20">
            <span className="inventory-alert-text margin-t-20">
              How do you want to receive alerts?
            </span>
            <span className="inventory-alert-text inventory-alert-checkbox">
              In App
              <Checkbox onChange={(e) => this.setState({checked: e.target.checked})}>Email</Checkbox>
            </span>
          </div>
          <div className="text-center margin-t-60">
            <span className="inventory-btn-wrapper">
              <Button className="inventory-button pull-left" >
                  CANCEL
              </Button>
              <Button className="inventory-button pull-right" onClick={this.saveData}>
                  SAVE AND CLOSE
              </Button>
            </span>
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
