import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label, Tabs, Tab, FormControl} from 'react-bootstrap';
import Select from 'react-select';
import { validateEmail } from '../constants';
import '../styles/App.css';
import 'react-select/dist/react-select.css';
import {
  AuthenticationDetails,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import config from "../config";
import { invokeApig } from "../libs/awsLib";
import { authUser } from "../libs/awsLib";

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
      newUser: null
    };
    this.goLanding = this.goLanding.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.onFirstNameChange = this.onFirstNameChange.bind(this)
    this.onLastNameChange = this.onLastNameChange.bind(this)
    this.onCompanyNameChange = this.onCompanyNameChange.bind(this)
    this.onYourRoleChange = this.onYourRoleChange.bind(this)
    this.logChange = this.logChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onSignUp = this.onSignUp.bind(this)
  }

  componentDidMount() {
    let isEmailValid = this.props.history.location.query;
    if(isEmailValid !== undefined){
      this.setState({
        email: isEmailValid.email
      })
    }else {
      this.setState({
        email: ''
      })
    }
}

async componentWillMount() {
  // redirect to inventory page if user is already logged in
  try {
    if (await authUser()) {
      this.props.history.push('/inventory');
      }
    }catch(e) {
      alert(e);
    }
}

goLanding() {
  this.props.history.push('/');
}

handleSelect(key) {
  if(key === 1){
    this.props.history.push('/signin');
  }else if(key === 2){
    this.props.history.push('/signup');
  }
}

onFirstNameChange(e) {
  this.setState({
    firstName: e.target.value
  })
}

onLastNameChange(e) {
  this.setState({
    lastName: e.target.value
  })
}

onCompanyNameChange(e) {
  this.setState({
    companyName: e.target.value
  })
}

onYourRoleChange(e) {

}

onEmailChange(e) {
  this.setState({
    email: e.target.value
  })
}

onPasswordChange(e) {
  this.setState({
    password: e.target.value
  })
}

onSignUp() {
  let {firstName, lastName, companyName, yourRole, email, password} = this.state
  if(firstName.length > 0 && lastName.length > 0 && companyName.length > 0 && yourRole.length > 0 && validateEmail(email) && password.length > 8 )
  {
    this.props.history.push('/');
  }
}

createNewUser(userData)
{
  return invokeApig({
    path: "/signup",
    method: "POST",
    body: userData
  });
}

signup(email, password)
{
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

    resolve(result.user);
  })
);
}

confirm(user, confirmationCode)
{
  return new Promise((resolve, reject) =>
  user.confirmRegistration(confirmationCode, true, function(err, result) {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  })
);
}

authenticate(user, email, password)
{
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
  if(val !== null) {
    this.setState({
      yourRole: val.value
    })
  }else {
    this.setState({
      yourRole: ''
    })
  }
}


render() {

    let {firstName, lastName, companyName, yourRole, email, password} = this.state
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
                        <Button className="close-button" onClick={this.goLanding}/>
                    </Col>
                </Col>
            </Row>
            <Row>
                <Tabs defaultActiveKey={2} id="uncontrolled-tab-example" className="login-tab" onSelect={this.handleSelect}>
                    <Tab eventKey={1} title="Login">
                    </Tab>
                    <Tab eventKey={2} title="Sign Up">
                        <div>
                            <Col md={12} className="padding-t-30">
                                <Label className="signup-title">
                                    Sign up for a 30 day free trial
                                </Label>
                            </Col>
                            <Col md={12}>
                                <Col md={6}>
                                    <div className="flex-right padding-t-20">
                                        <FormControl
                                            type="text"
                                            placeholder="first name"
                                            className="signup-email-input"
                                            value={firstName}
                                            onChange={this.onFirstNameChange}/>
                                    </div>
                                </Col>
                            <Col md={6}>
                                    <div className="flex-left padding-t-20">
                                        <FormControl
                                            type="text"
                                            placeholder="last name"
                                            className="signup-email-input"
                                            value={lastName}
                                            onChange={this.onLastNameChange}/>
                                </div>
                                </Col>
                            </Col>
                            <Col md={12}>
                                <Col md={6}>
                                    <div className="flex-right padding-t-20">
                                        <FormControl
                                        type="text"
                                        placeholder="company name"
                                        className="signup-email-input"
                                        value={companyName}
                                        onChange={this.onCompanyNameChange}/>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="flex-left padding-t-20">
                                        <Select
                                        name="form-field-name"
                                        placeholder="your role"
                                        className="signup-role-input"
                                        value={yourRole}
                                        options={options}
                                        onChange={this.logChange}
                                        />
                                    </div>
                                </Col>
                            </Col>
                            <Col md={12}>
                                <Col md={6}>
                                    <div className="flex-right padding-t-20">
                                        <FormControl
                                        type="text"
                                        placeholder="email"
                                        className="signup-email-input"
                                        value={email}
                                        onChange={this.onEmailChange}/>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="flex-left padding-t-20">
                                        <FormControl
                                        type="password"
                                        placeholder="password"
                                        className="signup-email-input"
                                        value={password}
                                        onChange={this.onPasswordChange}/>
                                    </div>
                                </Col>
                            </Col>
                            <Col md={12} className="padding-t-30">
                                <Button className="login-button" onClick={this.onSignUp}>
                                    SIGN UP
                                </Button>
                            </Col>
                        </div>
                    </Tab>
                </Tabs>
            </Row>
        </Grid>
    );
  }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(SignUp);
