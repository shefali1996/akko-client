import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";
import RouteNavButton from "./components/RouteNavButton";
import { authUser, signOutUser } from "./libs/awsLib";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      shopifyNonce: ""
    };

    this.setShopifyNonce = this.setShopifyNonce.bind(this);
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setShopifyNonce(nonce){
    this.setState({ shopifyNonce: nonce });
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/");
  }

  renderLanderNavBar(){
    return( [
      <RouteNavButton key={1} href="/signup">
      Signup
      </RouteNavButton>,
      <RouteNavButton key={2} href="/login">
      Login
      </RouteNavButton>
    ]);
  }

  renderUserNavBar(){
    return (
      [<RouteNavButton key={1} href="/connect-shopify">
      +Shopify
      </RouteNavButton>,
      <RouteNavButton onClick={this.handleLogout}>Logout</RouteNavButton>]
    );
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      shopifyNonce: this.state.shopifyNonce,
      setShopifyNonce: this.setShopifyNonce
    };

    return (
      !this.state.isAuthenticating &&
      <div className="app-container">
      <Navbar fluid collapseOnSelect>
      <Navbar.Header>
      <Navbar.Brand>
      <a href="/">akko</a>
      </Navbar.Brand>
      <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
      <Nav pullRight>
      {this.state.isAuthenticated
        ? this.renderUserNavBar() : this.renderLanderNavBar()
      }
        </Nav>
        </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
        </div>
      );
    }
  }

  export default withRouter(App);
