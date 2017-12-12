import React, { Component } from 'react';
import { Row, Col, Label, Image } from 'react-bootstrap';
import headerIcon from '../assets/images/headerIcon.svg';

class Footer extends Component {
  render() {
    return (
      <div className="footer-container">
        <Row className="no-margin white-bg padding-header">
          <div className="top-border">
            <Col md={12} sm={12} className="text-right padding-t-5 no-padding">
              <Label className="contact-title">
                help@akko.io
              </Label>
            </Col>
          </div>
        </Row>
      </div>
    );
  }
}

export default Footer;
