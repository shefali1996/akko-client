import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  Button,
  Label,
  Tabs,
  Tab,
  FormControl,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style'
import isEmpty from "lodash/isEmpty"
import swal from "sweetalert2";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";
import { validateEmail } from "../helpers/functions";
import MaterialIcon from "../assets/images/MaterialIcon.svg";
import config from "../config";
import user from "../auth/user";
import styles from "../constants/styles";
import logoImage from "../assets/images/transparent_blue.svg"



class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      verificationCode: "",
      newPassword: "",
      alertError: { open: false, message: "" },
      pendingRequest: false,
      step: 0
    };
  }

  componentWillMount() {
    if (user.isAuthenticated !== null) {
      this.props.history.push("/dashboard");
    }
  }

  goLanding = () => {
    this.props.history.push("/");
  };

  emailValidation = () => {
    const { email } = this.state;
    if (!validateEmail(email)) {
      this.setState({
        emailError: " Invalid email address"
      });
      this.refs.email.show();
      return false;
    }
    return true;
  };
  swalert = () => {
    return swal({
      title: "Error!",
      type: "error",
      text: this.state.alertError.message,
      allowOutsideClick: false,
      focusConfirm: false
    });
  };
  otpValidation = () => {
    const { verificationCode } = this.state;
    if (isEmpty(verificationCode)) {
      this.setState({
        otpError: "Verification Code is empty"
      });
      this.refs.verificationCode.show();
      return false;
    }
    return true;
  };

  passValidation = () => {
    const { newPassword } = this.state;
    if (newPassword.length < 8) {
      this.setState({
        passwordError: " Need at least 8 characters"
      });
      this.refs.newPassword.show();
      return false;
    }
    return true;
  };

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.forgotPassword();
    }
  };

  forgotPassword = () => {
    const {
      email,
      newPassword,
      verificationCode,
      step,
      pendingRequest
    } = this.state;
    const _self = this;
    _self.setState({ pendingRequest: true });
    const emailAuth = this.emailValidation();
    if (emailAuth) {
      // create a new userPool instance
      const userPool = new CognitoUserPool({
        UserPoolId: config.cognito.USER_POOL_ID,
        ClientId: config.cognito.APP_CLIENT_ID
      });

      // create a new CognitoUser instance
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      if (step === 0) {
        cognitoUser.forgotPassword({
          onSuccess(result) {
            _self.setState({ step: 1, pendingRequest: false });
          },
          onFailure(err) {
            _self.setState({
              alertError: {
                open: true,
                pendingRequest: false,
                message: "Username / email not found"
              }
            },()=>{
              _self.swalert();
            });
          }
        });
      } else if (step === 1) {
        const passAuth = this.passValidation();
        const otpAuth = this.otpValidation();
        if (passAuth && otpAuth) {
          cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess() {
              _self.setState({ step: 2, pendingRequest: false });
              _self.props.history.push({
                pathname: "/signin",
                state: { email }
              });
            },
            onFailure(err) {
              _self.setState({
                alertError: {
                  open: true,
                  pendingRequest: false,
                  message: `Could not reset password for user ${email}, Retry.`
                }
              },()=>{
                _self.swalert();
              });
            }
          });
        }
      }
    }
  };

  render() {
    const { email, newPassword, verificationCode, step, message } = this.state;
    return (
      <Grid className="login-layout">
        <Row>
          <Col md={12}>
            <Col md={6} className="text-left padding-t-20">
            <a className="logo" href="https://www.akko.io">
                  <img
                    className="fixed-logo"
                    src={logoImage}
                    width="52px"
                    alt="Akko"
                  />
                  <span>Akko</span>
                </a>    
                </Col>
          </Col>
        </Row>
        <Row>
      
              <div className="forget-password-wrapper">
                <h1 className="main-heading first-section">No worries. Let's get </h1>
                <h1 className="main-heading">you back online</h1>
                
                {this.state.step !== 1 ? 
                <div >
                 <p className="email-use">What is the email you use to login?</p>
                  <OverlayTrigger
                    placement="right"
                    trigger="manual"
                    ref="email"
                    overlay={
                      <Tooltip id="tooltip">
                        <img src={MaterialIcon} alt="icon" />
                        {this.state.emailError}
                      </Tooltip>
                    }
                  >
                    <FormControl
                      type="text"
                      placeholder="business email"
                      disabled={step === 1}
                      className="email-input forget-email-section"
                      value={email}
                      onChange={e => this.setState({ email: e.target.value })}
                      onKeyPress={this._handleKeyPress}
                      onFocus={() => this.refs.email.hide()}
                      onBlur={this.emailValidation}
                    />
                  </OverlayTrigger>
                  <div>
                    <div className="flex-center">
                      <Button
                        className="login-button"
                        onClick={this.forgotPassword}
                      >
                        VERIFY EMAIL
                        <div
                          style={{
                            marginLeft: 10,
                            display: this.state.pendingRequest
                              ? "inline-block"
                              : "none"
                          }}
                        >
                          <Spin size="small" />
                        </div>
                      </Button>
                    </div>
                     <p className="forget-write"> Don't remember that either?
                     <a href="mailto:help@akko.io" target="_blank">Write to us</a>
                     </p>
                  </div>
                </div>

                :
                  <div>
                    <div className="flex-center margin-t-5">
                      <Label className="signup-title title-section">
                      Check your email for verification code
                      </Label>
                    </div>
                    <div className="flex-center margin-t-5">
                      <Label className="signup-title">
                      Enter the code to reset your password
                      </Label>
                    </div>
                    <div className="flex-center margin-t-5">
                      <OverlayTrigger
                        placement="right"
                        trigger="manual"
                        ref="verificationCode"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" />
                            {this.state.otpError}
                          </Tooltip>
                        }
                      >
                        <FormControl
                          type="text"
                          placeholder="Verification Code"
                          className="email-input verification-code"
                          value={verificationCode}
                          onChange={e =>
                            this.setState({ verificationCode: e.target.value })
                          }
                          onKeyPress={this._handleKeyPress}
                          onFocus={() => this.refs.verificationCode.hide()}
                          onBlur={this.otpValidation}
                        />
                      </OverlayTrigger>
                    </div>
                    <div className="flex-center margin-t-10">
                      <OverlayTrigger
                        placement="right"
                        trigger="manual"
                        ref="newPassword"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" />
                            {this.state.passwordError}
                          </Tooltip>
                        }
                      >
                        <FormControl
                          type="password"
                          placeholder="new password"
                          className="email-input"
                          value={newPassword}
                          onChange={e =>
                            this.setState({ newPassword: e.target.value })
                          }
                          onKeyPress={this._handleKeyPress}
                          onFocus={() => this.refs.newPassword.hide()}
                          onBlur={this.passValidation}
                        />
                      </OverlayTrigger>
                    </div>
                    <div className="flex-center padding-t-30">
                      <Button
                        className="reset-password-button"
                        onClick={this.forgotPassword}
                      >
                        RESET PASSWORD
                        <div
                          style={{
                            marginLeft: 10,
                            display: this.state.pendingRequest
                              ? "inline-block"
                              : "none"
                          }}
                        >
                          <Spin size="small" />
                        </div>
                      </Button>
                    </div>
                  </div>
                }
              </div>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(ForgotPassword);
