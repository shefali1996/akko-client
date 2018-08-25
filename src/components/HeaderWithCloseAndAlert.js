import React, { Component } from 'react';
import { Button, Row, Col, Label } from 'react-bootstrap';
import swal from 'sweetalert2';
import {isCogsPending} from '../helpers/Csv';


const swalert = () => {
  return swal({
    title:             'Confirm!',
    type:              'warning',
    text:              'We cannot calculate Gross Profit figures without COGS information. You can also set/update these figures later from the Settings menu',
    showCancelButton:  true,
    allowOutsideClick: false,
    focusConfirm:      false,
  });
};

class HeaderWithCloseAndAlert extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  close() {
    const variants = this.props.productData && this.props.productData.data && this.props.productData.data.variants;
    const status = isCogsPending(variants);
    if (status === 'undefined' || this.props.loadingVariants === true) {
      alert('Wait while data is loading...');
    } else if (status === true) {
      swalert().then((result) => {
        if (result.value) {
          this.onConfirm();
        }
      });
    } else if (status === false) {
      this.onConfirm();
    }
  }

  onConfirm() {
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={6} className="text-left padding-t-20">
            <Label className="login-title" style={{paddingLeft: '0px'}}>
                akko
            </Label>
          </Col>
          <Col md={6} className="text-right padding-t-20">
            <Button className="close-button" onClick={this.close} />
          </Col>
        </Row>
        <Row className="account-setup-header">
          <span className="account-comment">
            {this.props.pageTitle}
          </span>
        </Row>
      </div>
    );
  }
}

export default HeaderWithCloseAndAlert;
