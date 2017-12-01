import React, { Component } from 'react';
import { Button, Row, Col, Label } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';

class HeaderWithCloseAndAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertShow: false
    };
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ alertShow: true });
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
          onConfirm={() => {
            this.setState({ alertShow: false }, () => {
              this.props.history.push('/dashboard');
            });
          }}
          onCancel={() => {
              this.setState({ alertShow: false });
          }}
        />
      </div>
    );
  }
}

export default HeaderWithCloseAndAlert;
