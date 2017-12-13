import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Tabs, Tab, FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { StyleRoot } from 'radium';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { validateEmail, animationStyle } from '../constants';
import MaterialIcon from '../assets/images/MaterialIcon 3.svg';
import config from '../config';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.goLanding = this.goLanding.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.onForgot = this.onForgot.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onEmailFocus = this.onEmailFocus.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.onPasswordFocus = this.onPasswordFocus.bind(this);
    this.passValidation = this.passValidation.bind(this);
  }

  componentWillMount() {

  }

  goLanding() {
    this.props.history.push('/');
  }

  handleSelect(key) {
    if (key === 1) {
      this.props.history.push('/signin');
    } else if (key === 2) {
      this.props.history.push('/signup');
    }
  }

  onEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  onEmailFocus() {
    this.refs.email.hide();
  }

  emailValidation() {
    const { email } = this.state;
    if (!validateEmail(email)) {
      this.refs.email.show();
      return false;
    }
    return true;
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  onPasswordFocus() {
    this.refs.password.hide();
  }

  passValidation() {
    const { password } = this.state;
    if (password.length < 8) {
      this.refs.password.show();
      return false;
    }
    return true;
  }


  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.onLogin();
    }
  }

  onForgot() {

  }

  onLogin() {
    const { email, password } = this.state;
    const emailAuth = this.emailValidation();
    const passAuth = this.passValidation();
    if (emailAuth && passAuth) {
      this.login(email, password).then((result) => {
        localStorage.setItem('isAuthenticated', 'isAuthenticated');
        this.props.history.push('/financial_insights');
        // this.props.history.push('/connect-shopify');
      })
        .catch(error => {
          console.log('login error', error);
        });
    }
  }

  // login using amazon cognito user pool
  login(email, password) {
    // create a new userPool instance
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    // create a new CognitoUser instance
    const user = new CognitoUser({ Username: email, Pool: userPool });

    // get authentication data
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    // authenticate user
    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  render() {
    const { email, password } = this.state;
    return (
      <Grid className="login-layout">
        <Row>
          <Col md={12}>
            <Col md={6} className="text-left padding-t-20">
              <Label className="login-title">
                akko
              </Label>
            </Col>
            <Col md={6} className="text-right padding-t-20">
              <Button className="close-button" onClick={this.goLanding} />
            </Col>
          </Col>
        </Row>
        <Row>
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="login-tab" onSelect={this.handleSelect}>
            <Tab eventKey={1} title="Login">
              <div>
                <div className="flex-center padding-t-80">
                  <OverlayTrigger
                    placement="right"
                    trigger="manual"
                    ref="email"
                    overlay={
                      <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Invalid email address</Tooltip>
                    }>
                    <FormControl
                      type="text"
                      placeholder="email"
                      className="email-input"
                      value={email}
                      onChange={this.onEmailChange}
                      onKeyPress={this._handleKeyPress}
                      onFocus={this.onEmailFocus}
                      onBlur={this.emailValidation}
                  />
                  </OverlayTrigger>
                </div>
                <div className="flex-center margin-t-5">
                  <OverlayTrigger
                    placement="right"
                    trigger="manual"
                    ref="password"
                    overlay={
                      <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Need at least 8 characters</Tooltip>
                    }>
                    <FormControl
                      type="password"
                      placeholder="password"
                      className="email-input"
                      value={password}
                      onChange={this.onPasswordChange}
                      onKeyPress={this._handleKeyPress}
                      onFocus={this.onPasswordFocus}
                      onBlur={this.passValidation}
                    />
                  </OverlayTrigger>
                </div>
                <div className="flex-center padding-t-10">
                  <Button className="forgot-text" onClick={this.onForgot}>
                    Forgot Password ?
                  </Button>
                </div>
                <div className="flex-center padding-t-20">
                  <Button className="login-button" onClick={this.onLogin}>
                    LOGIN
                  </Button>
                </div>
              </div>
            </Tab>
            <Tab eventKey={2} title="Sign Up" />
          </Tabs>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(SignIn);
