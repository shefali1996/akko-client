import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from "amazon-cognito-identity-js";
import config from "../config";
import { invokeApig } from "../libs/awsLib";

export default class Signup extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: false,
      fname:"",
      lname:"",
      company:"",
      role:"CEO/Founder",
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm()
  {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 7 &&
      this.state.fname.length > 0 && this.state.company.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm()
  {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await this.signup(this.state.email, this.state.password);
      this.setState({
        newUser: newUser
      });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.confirm(this.state.newUser, this.state.confirmationCode);

      await this.authenticate(
        this.state.newUser,
        this.state.email,
        this.state.password
      );

      //await this.login(this.state.email, this.state.password);

      await this.createNewUser(
        {
          fname: this.state.fname,
          lname: this.state.lname,
          company: this.state.company,
          role: this.state.role,
          email: this.state.email,
          location: "Earth" // placeholder. Later, use geolocation API to fetch location. Also log device, browser, etc. if possible.
        });

        this.props.userHasAuthenticated(true);
        this.setState({ isLoading: true });
        this.props.history.push("/");
      }catch (e) {
        alert(e);
        this.setState({ isLoading: false });
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

renderConfirmationForm()
{
  return (
    <form onSubmit={this.handleConfirmationSubmit}>
    <FormGroup controlId="confirmationCode" bsSize="large">
    <ControlLabel>Confirmation Code</ControlLabel>
    <FormControl
    autoFocus
    type="tel"
    value={this.state.confirmationCode}
    onChange={this.handleChange}
    />
    <HelpBlock>Please check your email for the code.</HelpBlock>
    </FormGroup>
    <LoaderButton
    block
    bsSize="large"
    disabled={!this.validateConfirmationForm()}
    type="submit"
    isLoading={this.state.isLoading}
    text="Verify"
    loadingText="Verifying…"
    />
    </form>
  );
}

renderForm()
{
  return (
    <form onSubmit={this.handleSubmit}>
    <FormGroup controlId="fname" bsSize="large">
    <ControlLabel>First Name</ControlLabel>
    <FormControl autoFocus type="text" value={this.state.fname}
    onChange={this.handleChange}
    />
    </FormGroup>

    <FormGroup controlId="lname" bsSize="large">
    <ControlLabel>Last Name</ControlLabel>
    <FormControl type="text" value={this.state.lname}
    onChange={this.handleChange}
    />
    </FormGroup>

    <FormGroup controlId="company" bsSize="large">
    <ControlLabel>Company Name</ControlLabel>
    <FormControl type="text" value={this.state.company}
    onChange={this.handleChange}
    />
    </FormGroup>

    <FormGroup controlId="role" bsSize="large">
    <ControlLabel>Your Role</ControlLabel>
    <FormControl componentClass="select">
    <option value="CEO/Founder"> CEO or Founder </option>
    <option value="Manager"> Manager </option>
    <option value="Employee"> Employee </option>
    <option value="Other"> Other </option>
    onChange={this.handleChange}
    </FormControl>
    </FormGroup>

    <FormGroup controlId="email" bsSize="large">
    <ControlLabel>Email</ControlLabel>
    <FormControl
    autoFocus
    type="email"
    value={this.state.email}
    onChange={this.handleChange}
    />
    </FormGroup>

    <FormGroup controlId="password" bsSize="large">
    <ControlLabel>Password</ControlLabel>
    <FormControl
    value={this.state.password}
    onChange={this.handleChange}
    type="password"
    />
    </FormGroup>
    <FormGroup controlId="confirmPassword" bsSize="large">
    <ControlLabel>Confirm Password</ControlLabel>
    <FormControl
    value={this.state.confirmPassword}
    onChange={this.handleChange}
    type="password"
    />
    </FormGroup>
    <LoaderButton
    block
    bsSize="large"
    disabled={!this.validateForm()}
    type="submit"
    isLoading={this.state.isLoading}
    text="Signup"
    loadingText="Signing up…"
    />
    </form>
  );
}

render()
{
  return (
    <div className="Signup">
    {this.state.newUser === null
      ? this.renderForm()
      : this.renderConfirmationForm()}
      </div>
    );
  }
}
