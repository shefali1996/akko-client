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
import { StyleRoot } from "radium";
import { Spin } from "antd";
import { isEmpty } from "lodash";
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

const swalert = () => {
  return swal({
    title: "Error!",
    type: "error",
    text: this.state.alertError.message,
    allowOutsideClick: false,
    focusConfirm: false
  });
};

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
            });
            swalert();
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
              });
              swalert();
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
              <Label className="login-title">akko</Label>
            </Col>
            <Col md={6} className="text-right padding-t-20">
              <Button className="close-button" onClick={this.goLanding} />
            </Col>
          </Col>
        </Row>
        <Row>
          <Tabs
            defaultActiveKey={1}
            id="ForgotPasswordTabs"
            className="login-tab forgot-password-tabs"
            onSelect={this.handleSelect}
          >
            <Tab eventKey={1} title="Reset Password">
              <div>
                <div className="flex-center padding-t-80">
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
                      placeholder="email"
                      disabled={step === 1}
                      className="email-input"
                      value={email}
                      onChange={e => this.setState({ email: e.target.value })}
                      onKeyPress={this._handleKeyPress}
                      onFocus={() => this.refs.email.hide()}
                      onBlur={this.emailValidation}
                    />
                  </OverlayTrigger>
                </div>

                {this.state.step === 1 ? (
                  <div>
                    <div className="flex-center margin-t-5">
                      <Label className="signup-title">
                        We've sent a verification code to {this.state.email}.
                      </Label>
                    </div>
                    <div className="flex-center margin-t-5">
                      <Label className="signup-title">
                        Please enter the code to verify your email address
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
                          className="email-input"
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
                    <div className="flex-center margin-t-5">
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
                    <div className="flex-center padding-t-20">
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
                ) : (
                  <div>
                    <div className="flex-center padding-t-10">
                      <span className="forgot-text already-have-password">
                        Already have password ?
                        <span>
                          <Button
                            className="forgot-text"
                            bsStyle="link"
                            onClick={() => this.props.history.push("/signin")}
                          >
                            {" "}
                            Login
                          </Button>
                        </span>
                      </span>
                    </div>
                    <div className="flex-center padding-t-20">
                      <Button
                        className="login-button"
                        onClick={this.forgotPassword}
                      >
                        SUBMIT
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
                )}
              </div>
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(ForgotPassword);
