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
import Select from "react-select";
import swal from "sweetalert2";
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from "amazon-cognito-identity-js";
import { isEmpty } from "lodash";
import { testMode } from "../constants";
import { validateEmail } from "../helpers/functions";
import config from "../config";
import {signOutUser } from "../libs/awsLib";
import MaterialIcon from "../assets/images/MaterialIcon.svg";
import { invokeApigWithoutErrorReport } from "../libs/apiUtils";
import { Spin } from "antd";
import { withRouter } from "react-router";
import user from "../auth/user";
import logoImage from "../assets/images/transparent_blue.svg"

const options = [
  {
    value: "CEO/Founder",
    label: "CEO/Founder"
  },
  {
    value: "Manager",
    label: "Manager"
  },
  {
    value: "Employee",
    label: "Employee"
  },
  {
    value: "Other",
    label: "Other"
  }
];

const swalert = () => {
  return swal({
    title: "Thanks for signing up!!",
    type: "success",
    text: "Let us now setup your new akko account.",
    allowOutsideClick: false,
    focusConfirm: false
  });
};

class SignUp extends Component {
  constructor(props) {
    super(props);
    const email = localStorage.getItem("email");
    this.state = {
      firstName: "",
      lastName: "",
      companyName: "",
      yourRole: "",
      email: email || "",
      password: "",
      newUser: null,
      emailSent: false,
      verifyCode: "",
      pendingRequest: false
    };
    this.goLanding = this.goLanding.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.validateFirstName = this.validateFirstName.bind(this);
    this.onFocusFirstName = this.onFocusFirstName.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.onFocusLastName = this.onFocusLastName.bind(this);
    this.onCompanyNameChange = this.onCompanyNameChange.bind(this);
    this.validateCompanyName = this.validateCompanyName.bind(this);
    this.onFocusCompanyName = this.onFocusCompanyName.bind(this);
    this.validateYourRole = this.validateYourRole.bind(this);
    this.logChange = this.logChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onVerify = this.onVerify.bind(this);
    this.onVerifyCodeChange = this.onVerifyCodeChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onEmailBlur = this.onEmailBlur.bind(this);
    this.onEmailFocus = this.onEmailFocus.bind(this);
    this.onCodeFocus = this.onCodeFocus.bind(this);
    this.yourRoleFocus = this.yourRoleFocus.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.passwordOnFocus = this.passwordOnFocus.bind(this);
  }

  componentWillMount() {
    if (user.isAuthenticated !== null) {
      this.props.history.push("/dashboard");
    }
  }

  componentDidMount() {
    this.validMailCheck();
  }

  validMailCheck() {
    const queryParams = new URLSearchParams(this.props.location.search)
    const email  = queryParams.get('email')
    
     if (email !== undefined) {
      this.setState({
        email
      });
    } else {
      this.setState({
        email: ""
      });
    }
  }

  goLanding() {
    this.props.history.push("/");
  }

  handleSelect(key) {
    if (key === 1) {
      this.props.history.push("/");
    } else if (key === 2) {
      this.props.history.push("/signup");
    }
  }

  onFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
  }

  validateFirstName() {
    const { firstName } = this.state;
    if (isEmpty(firstName)) {
      this.refs.firstName.show();
      return false;
    }
    return true;
  }

  onFocusFirstName() {
    this.refs.firstName.hide();
  }

  onLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
  }

  validateLastName() {
    const { lastName } = this.state;
    if (isEmpty(lastName)) {
      this.refs.lastName.show();
      return false;
    }
    return true;
  }

  onFocusLastName() {
    this.refs.lastName.hide();
  }

  onCompanyNameChange(e) {
    this.setState({
      companyName: e.target.value
    });
  }
  validateCompanyName() {
    const { companyName } = this.state;
    if (isEmpty(companyName)) {
      this.refs.companyName.show();
      return false;
    }
    return true;
  }

  onFocusCompanyName() {
    this.refs.companyName.hide();
  }

  validateYourRole(role) {
    if (!role) {
      this.refs.yourRole.show();
      return false;
    }
    return true;
  }

  yourRoleFocus() {
    this.refs.yourRole.hide();
  }

  onEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  onEmailBlur() {
    const { email } = this.state;
    if (!validateEmail(email)) {
      this.setState({
        emailError: " Invalid email address"
      });
      this.refs.email.show();
      return false;
    }
    return true;
  }

  onEmailFocus() {
    this.refs.email.hide();
  }

  onCodeFocus() {
    this.refs.code.hide();
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  validatePassword() {
    const { password } = this.state;
    if (password.length < 8) {
      this.refs.password.show();
      return false;
    }
    return true;
  }
  passwordOnFocus() {
    this.refs.password.hide();
  }

  onVerifyCodeChange(e) {
    this.setState({
      verifyCode: e.target.value
    });
  }

  onSignUp() {
    if (testMode) {
      swalert().then(() => {
        this.onConfirm();
      });
    } else {
      const {
        firstName,
        lastName,
        companyName,
        yourRole,
        email,
        password
      } = this.state;
      const firstNameAuth = this.validateFirstName();
      const lastNameAuth = this.validateLastName();
      const companyNameAuth = this.validateCompanyName();
      const roleAuth = this.validateYourRole(yourRole);
      const emailAuth = this.onEmailBlur();
      const passAuth = this.validatePassword();
      if (
        firstNameAuth &&
        lastNameAuth &&
        companyNameAuth &&
        roleAuth &&
        emailAuth &&
        passAuth
      ) {
        this.setState({
          pendingRequest: true
        });
        this.signup(email, password)
          .then(result => {
            if (!result.userConfirmed) {
              this.setState({
                emailSent: true,
                pendingRequest: false,
                newUser: result.user
              });
            }
          })
          .catch(error => {
            this.setState({
              pendingRequest: false
            });
            if (
              error.message ===
              "An account with the given email already exists."
            ) {
              this.setState({
                emailError: " An account with the given email already exists"
              });
              this.refs.email.show();
            }
          });
      }
    }
  }

  onVerify() {
    const { verifyCode, newUser, email, password } = this.state;
    if (verifyCode.length > 0) {
      this.setState({ pendingRequest: true });
      this.confirm(newUser, verifyCode).then(result => {
        if (result === "SUCCESS") {
          this.authenticate(newUser, email, password).then(result => {
            this.setState({ pendingRequest: false });
            this.createNewUser({
              fname: this.state.firstName,
              lname: this.state.lastName,
              company: this.state.companyName,
              role: this.state.yourRole,
              email: this.state.email,
              location: "Earth"
            }).then(result => {
              swalert().then(() => {
                this.onConfirm();
              });
            });
          });
        }
      });
    }
  }
  onConfirm() {
    const email = this.state.email;
    const password = this.state.password;
    this.onLogin();
  }
  onLogin() {
    const { email, password } = this.state;
    this.login(email, password)
      .then(result => {
        return invokeApigWithoutErrorReport({ path: "/user" });
      })
      .then(result => {
        localStorage.setItem("isAuthenticated", "isAuthenticated");
        switch (result.accountSetupStatus) {
          case 0:
            this.props.history.push("/connect-shopify");
            break;
          case 1:
            this.props.history.push("/fetch-status");
            break;
          case 2:
            this.props.history.push("/dashboard");
            break;
          default:
            this.props.history.push("/dashboard");
        }
      })
      .catch(error => {
        console.log("login error", error);
      });
  }
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

  createNewUser(userData) {
    return invokeApigWithoutErrorReport({
      path: "/user",
      method: "POST",
      body: userData
    });
  }

  signup(email, password) {
    // for safety sake, sign out any logged in users first
    signOutUser();

    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    return new Promise((resolve, reject) =>
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      })
    );
  }

  confirm(user, confirmationCode) {
    return new Promise((resolve, reject) =>
      user.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          this.setState({
            pendingRequest: false,
            codeError: "Invalid verification code"
          });
          this.refs.code.show();
          return err;
        }
        resolve(result);
      })
    );
  }

  authenticate(user, email, password) {
    const authenticationData = {
      Username: email,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  logChange(val) {
    if (val !== null) {
      this.setState({
        yourRole: val.value
      });
    } else {
      this.setState({
        yourRole: ""
      });
    }
  }

  render() {
    const {
      firstName,
      lastName,
      companyName,
      yourRole,
      email,
      password,
      emailSent,
      verifyCode
    } = this.state;
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
          <Tabs
            defaultActiveKey={2}
            id="uncontrolled-tab-example"
            className="login-tab"
            onSelect={this.handleSelect}
          >
            <Tab eventKey={1} title="Login" />
            <Tab eventKey={2} title="Sign Up">
              <div>
                <Col md={12} className="padding-t-30">
                  <Col md={6}>
                    <div className="flex-right padding-t-20">
                      <OverlayTrigger
                        placement="left"
                        trigger="manual"
                        ref="firstName"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" /> Enter first
                            name
                          </Tooltip>
                        }
                      >
                        <FormControl
                          type="text"
                          placeholder="first name"
                          className="signup-email-input"
                          value={firstName}
                          onChange={this.onFirstNameChange}
                          onBlur={this.validateFirstName}
                          onFocus={this.onFocusFirstName}
                        />
                      </OverlayTrigger>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="flex-left padding-t-20">
                      <OverlayTrigger
                        placement="right"
                        trigger="manual"
                        ref="lastName"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" /> Enter last
                            name
                          </Tooltip>
                        }
                      >
                        <FormControl
                          type="text"
                          placeholder="last name"
                          className="signup-email-input"
                          value={lastName}
                          onChange={this.onLastNameChange}
                          onBlur={this.validateLastName}
                          onFocus={this.onFocusLastName}
                        />
                      </OverlayTrigger>
                    </div>
                  </Col>
                </Col>
                <Col md={12}>
                  <Col md={6}>
                    <div className="flex-right padding-t-20">
                      <OverlayTrigger
                        placement="left"
                        trigger="manual"
                        ref="companyName"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" /> Enter company
                            name
                          </Tooltip>
                        }
                      >
                        <FormControl
                          type="text"
                          placeholder="company name"
                          className="signup-email-input"
                          value={companyName}
                          onChange={this.onCompanyNameChange}
                          onBlur={this.validateCompanyName}
                          onFocus={this.onFocusCompanyName}
                        />
                      </OverlayTrigger>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="flex-left padding-t-20">
                      <OverlayTrigger
                        placement="right"
                        trigger="manual"
                        ref="yourRole"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" /> Choose your
                            role
                          </Tooltip>
                        }
                      >
                        <Select
                          name="form-field-name"
                          placeholder="your role"
                          className="signup-role-input"
                          value={yourRole}
                          options={options}
                          onChange={this.logChange}
                          onFocus={this.yourRoleFocus}
                        />
                      </OverlayTrigger>
                    </div>
                  </Col>
                </Col>
                <Col md={12}>
                  <Col md={6}>
                    <div className="flex-right padding-t-20">
                      <OverlayTrigger
                        placement="left"
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
                          className="signup-email-input"
                          value={email}
                          disabled={emailSent}
                          onBlur={this.onEmailBlur}
                          onFocus={this.onEmailFocus}
                          onChange={this.onEmailChange}
                        />
                      </OverlayTrigger>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="flex-left padding-t-20">
                      <OverlayTrigger
                        placement="right"
                        trigger="manual"
                        ref="password"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" /> Need at least
                            8 characters
                          </Tooltip>
                        }
                      >
                        <FormControl
                          type="password"
                          placeholder="password"
                          className="signup-email-input"
                          value={password}
                          disabled={emailSent}
                          onBlur={this.validatePassword}
                          onFocus={this.passwordOnFocus}
                          onChange={this.onPasswordChange}
                        />
                      </OverlayTrigger>
                    </div>
                  </Col>
                </Col>
                {emailSent ? (
                  <div>
                    <Col md={12} className="padding-t-30">
                      <Label className="signup-title">
                        We've sent a verification code to {email}
                      </Label>
                    </Col>
                    <Col md={12}>
                      <Label className="signup-title">
                        Please enter the code to verify your email address
                      </Label>
                    </Col>
                    <Col md={12} className="flex-center padding-t-10">
                      <OverlayTrigger
                        placement="left"
                        trigger="manual"
                        ref="code"
                        overlay={
                          <Tooltip id="tooltip">
                            <img src={MaterialIcon} alt="icon" />
                            {this.state.codeError}
                          </Tooltip>
                        }
                      >
                        <FormControl
                          type="text"
                          placeholder="verification code"
                          className="signup-email-input"
                          value={verifyCode}
                          onFocus={this.onCodeFocus}
                          onChange={this.onVerifyCodeChange}
                        />
                      </OverlayTrigger>
                    </Col>
                    <Col md={12} className="padding-t-30">
                      <Button className="login-button" onClick={this.onVerify}>
                        VERIFY
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
                    </Col>
                  </div>
                ) : (
                  <Col md={12} className="padding-t-30">
                    <Button className="login-button" onClick={this.onSignUp}>
                      SIGN UP
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
                  </Col>
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

export default withRouter(connect(mapStateToProps)(SignUp));
