import React, { Component } from 'react';
import { Button, Row, Col, Label } from 'react-bootstrap';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.goFeature = this.goFeature.bind(this);
    this.goHome = this.goHome.bind(this);
    this.goLogin = this.goLogin.bind(this);
    this.goSignUp = this.goSignUp.bind(this);
  }

  goFeature() {
    this.props.history.push('/signin');
  }

  goHome() {
    this.props.history.push('/dashboard');
  }

  goLogin() {
    this.props.history.push('/signin');
  }

  goSignUp() {
    this.props.history.push('/signup');
  }

  render() {
    return (
      <Row className="header-bar">
        <Col xs={12} className="padding-t-15 padding-b-10">
          <Col className="logo-container">
            <Label className="logo-title">
              akko
            </Label>
          </Col>
          <Col className="menu-btn-signup-box">
            <Button className="signup-button-text" onClick={this.goSignUp}>
              SIGN UP FOR FREE
            </Button>
          </Col>
          <Col className="menu-btn-box-container">
            <Col className="menu-btn-box">
              <Button className="feature-text" onClick={this.goLogin}>
                LOGIN
              </Button>
            </Col>
            <Col className="menu-btn-box">
              <a href="#pricing" className="feature-text btn-link" >
                PRICING
              </a>
            </Col>
            <Col className="menu-btn-box">
              <a href="#features" className="feature-text btn-link">
                FEATURES
              </a>
            </Col>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default Header;
