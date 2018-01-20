import React, { Component } from 'react';
import { Button, Row, Col, Label } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
import {isCogsPending} from '../helpers/Csv';

class HeaderWithCloseAndAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertShow: false
    };
    this.close = this.close.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  close() {
    const status = isCogsPending();
    if (status === 'undefined' || this.props.loadingVariants === true) {
      alert('Wait while data is loading...');
    } else if (status === true) {
      this.setState({ alertShow: true });
    } else if (status === false) {
      this.onConfirm();
    }
  }

  onConfirm() {
    this.setState({ alertShow: false }, () => {
      this.props.history.push('/dashboard');
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={12}>
            <Col md={6} className="text-left padding-t-20">
              <Label className="login-title">
                akko
              </Label>
            </Col>
            <Col md={6} className="text-right padding-t-20">
              <Button className="close-button" onClick={this.close} />
            </Col>
          </Col>
        </Row>
        <Row className="account-setup-header">
          <span className="account-comment">
            {this.props.pageTitle}
          </span>
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
      </div>
    );
  }
}

export default HeaderWithCloseAndAlert;
