import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Tabs, Tab, FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Select from 'react-select';
import SweetAlert from 'sweetalert-react';
import { AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { isEmpty } from 'lodash';
import { validateEmail, testMode } from '../constants';
import config from '../config';
import { invokeApig, signOutUser } from '../libs/awsLib';
import MaterialIcon from '../assets/images/MaterialIcon 3.svg';

const options = [
  { value: 'CEO/Founder', label: 'CEO/Founder' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Employee', label: 'Employee' },
  { value: 'Other', label: 'Other' }
];

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      companyName: '',
      yourRole: '',
      email: '',
      password: '',
      newUser: null,
      emailSent: false,
      verifyCode: '',
      alertShow: false
    };
    this.goLanding = this.goLanding.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.validateFirstName = this.validateFirstName.bind(this);
    this.onFouseFirstName = this.onFouseFirstName.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.onFouseLastName = this.onFouseLastName.bind(this);
    this.onCompanyNameChange = this.onCompanyNameChange.bind(this);
    this.validateCompanyName = this.validateCompanyName.bind(this);
    this.onFouseCompanyName = this.onFouseCompanyName.bind(this);
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
    this.yourRoleFocus = this.yourRoleFocus.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.passwordOnFocus = this.passwordOnFocus.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.validMailCheck();
  }

  validMailCheck() {
    const isEmailValid = this.props.history.location.query;
    if (isEmailValid !== undefined) {
      this.setState({
        email: isEmailValid.email
      });
    } else {
      this.setState({
        email: ''
      });
    }
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

  onFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
  }

  validateFirstName() {
    const {firstName} = this.state;
    if (isEmpty(firstName)) {
      this.refs.firstName.show();
      return false;
    }
    return true;
  }

  onFouseFirstName() {
    this.refs.firstName.hide();
  }

  onLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
  }

  validateLastName() {
    const {lastName} = this.state;
    if (isEmpty(lastName)) {
      this.refs.lastName.show();
      return false;
    }
    return true;
  }

  onFouseLastName() {
    this.refs.lastName.hide();
  }

  onCompanyNameChange(e) {
    this.setState({
      companyName: e.target.value
    });
  }
  validateCompanyName() {
    const {companyName} = this.state;
    if (isEmpty(companyName)) {
      this.refs.companyName.show();
      return false;
    }
    return true;
  }

  onFouseCompanyName() {
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

  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  validatePassword() {
    const {password} = this.state;
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
      this.setState({
        alertShow: true
      });
    } else {
      const {firstName, lastName, companyName, yourRole, email, password} = this.state;
      const firstNameAuth = this.validateFirstName();
      const lastNameAuth = this.validateLastName();
      const companyNameAuth = this.validateCompanyName();
      const roleAuth = this.validateYourRole(yourRole);
      const emailAuth = this.onEmailBlur();
      const passAuth = this.validatePassword();
      if (firstNameAuth && lastNameAuth && companyNameAuth && roleAuth && emailAuth && passAuth) {
        this.signup(email, password).then((result) => {
          if (!result.userConfirmed) {
            this.setState({
              emailSent: true,
              newUser: result.user
            });
          }
        }).catch((error) => {
			if (error.message === "An account with the given email already exists.") {
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
      this.confirm(newUser, verifyCode).then((result) => {
        if (result === 'SUCCESS') {
          this.authenticate(
            newUser,
            email,
            password
          ).then((result) => {
            this.createNewUser({
              fname: this.state.firstName,
              lname: this.state.lastName,
              company: this.state.companyName,
              role: this.state.yourRole,
              email: this.state.email,
              location: 'Earth'
            }).then((result) => {
              this.setState({
                alertShow: true
              });
            });
          });
        }
      });
    }
  }
  onConfirm() {
    this.setState({
      alertShow: false
    });
    this.props.history.push('/connect-shopify');
  }

  createNewUser(userData) {
    return invokeApig({
      path: '/user',
      method: 'POST',
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
          reject(err);
          return;
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
        yourRole: ''
      });
    }
  }

  render() {
    const { firstName, lastName, companyName, yourRole, email, password, emailSent, verifyCode } = this.state;
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
          <Tabs defaultActiveKey={2} id="uncontrolled-tab-example" className="login-tab" onSelect={this.handleSelect}>
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
                          <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Enter first name</Tooltip>
                        }>
                        <FormControl
                          type="text"
                          placeholder="first name"
                          className="signup-email-input"
                          value={firstName}
                          onChange={this.onFirstNameChange}
                          onBlur={this.validateFirstName}
                          onFocus={this.onFouseFirstName}
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
                          <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Enter last name</Tooltip>
                        }>
                        <FormControl
                          type="text"
                          placeholder="last name"
                          className="signup-email-input"
                          value={lastName}
                          onChange={this.onLastNameChange}
                          onBlur={this.validateLastName}
                          onFocus={this.onFouseLastName}
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
                          <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Enter company name</Tooltip>
                        }>
                        <FormControl
                          type="text"
                          placeholder="company name"
                          className="signup-email-input"
                          value={companyName}
                          onChange={this.onCompanyNameChange}
                          onBlur={this.validateCompanyName}
                          onFocus={this.onFouseCompanyName}
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
                          <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Choose your role</Tooltip>
                        }>
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
                          <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" />{this.state.emailError}</Tooltip>
                        }>
                        <FormControl
                          type="text"
                          placeholder="email"
                          className="signup-email-input"
                          value={email}
                          disabled={emailSent}
                          onBlur={this.onEmailBlur}
                          onFocus={this.onEmailFocus}
                          onChange={this.onEmailChange} />
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
                          <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" /> Need at least 8 characters</Tooltip>
                        }>
                        <FormControl
                          type="password"
                          placeholder="password"
                          className="signup-email-input"
                          value={password}
                          disabled={emailSent}
                          onBlur={this.validatePassword}
                          onFocus={this.passwordOnFocus}
                          onChange={this.onPasswordChange} />
                      </OverlayTrigger>
                    </div>
                  </Col>
                </Col>
                {emailSent ?
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
                      <FormControl
                        type="text"
                        placeholder="verification code"
                        className="signup-email-input"
                        value={verifyCode}
                        onChange={this.onVerifyCodeChange} />
                    </Col>
                    <Col md={12} className="padding-t-30">
                      <Button className="login-button" onClick={this.onVerify}>
                          VERIFY
                      </Button>
                    </Col>
                  </div>
                  :
                  <Col md={12} className="padding-t-30">
                    <Button className="login-button" onClick={this.onSignUp}>
                        SIGN UP
                    </Button>
                  </Col>
                }
                <SweetAlert
                  show={this.state.alertShow}
                  showConfirmButton
                  type="success"
                  title="Thanks for signing up!"
                  text="Let us now setup your new akko account."
                  onConfirm={this.onConfirm}
                />
              </div>
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(SignUp);
