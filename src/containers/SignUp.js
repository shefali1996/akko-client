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
  CognitoUser,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import isEmpty from "lodash/isEmpty"
import { testMode } from "../constants";
import { validateEmail } from "../helpers/functions";
import config from "../config";
import {signOutUser } from "../libs/awsLib";
import MaterialIcon from "../assets/images/MaterialIcon.svg";
import { invokeApigWithoutErrorReport } from "../libs/apiUtils";
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style'
import { withRouter } from "react-router";
import user from "../auth/user";
import logoImage from "../assets/images/transparent_blue.svg"
import VericationCode from "../components/VerificationCode"
import * as dashboardActions from '../redux/dashboard/actions';
const queryString = require('query-string');

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
      pendingRequest: false,
      shop:""
    };
    this.goLanding = this.goLanding.bind(this);
    this.onLogin = this.onLogin.bind(this);
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
       
        email,
        password
      } = this.state;

      const emailAuth = this.onEmailBlur();
      const passAuth = this.validatePassword();
      if (
        emailAuth &&
        passAuth
      ) {
        this.setState({
          pendingRequest: true
        });
        const userCurrentTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone
        this.signup(email, password,userCurrentTimeZone)
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
    if(this.props.location.search){
      let parsed = queryString.parse(this.props.location.search)
      let shopName= parsed.shop.split(".")[0]      
      this.props.connectShopify({shopId: shopName})
    }
    else{      
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
      email,
      password,
      emailSent,
      verifyCode
    } = this.state;
    return (
      <Grid className="login-layout">
        <Row>
          <Col md={12}>
            <Col md={12} className="text-left padding-t-20">
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
                    {!emailSent ?
      <div className="signup-wrapper">
        <Row>
         
                <h1 className="main-heading first-section">Let's create your new </h1>
                <h1 className="main-heading">Akko account</h1>
                <p className="signup-instruction">Enter your credentials to signup</p>
                <Col md={12}>
                  <Col md={12}>
                    <div className="text-box">
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
                          placeholder="business email"
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
                  <Col md={12}>
                    <div className="padding-t-20 text-box">
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
                  <Col md={12} >
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
                
        </Row>
              <p className="already-account">Already have an account? <u onClick={()=>{this.props.history.push('/')}}>Login</u></p>
        </div>: <VericationCode 
                   email={email}
                   onVerify={this.onVerify}
                   pendingRequest={this.state.pendingRequest}
                   onVerifyCodeChange={this.onVerifyCodeChange}
                   codeError={this.codeError}
                   verifyCode={verifyCode}
                   />}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = (dispatch) => {
  return {
    connectShopify: (body) => {
      return dispatch(dashboardActions.connectShopify(body));
    },
    updateShopify: (body) => {
      return dispatch(dashboardActions.updateShopify(body));
    }
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(SignUp));
