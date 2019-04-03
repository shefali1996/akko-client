import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Row, Col, Label, Image, DropdownButton } from 'react-bootstrap';
import user from '../auth/user';
import dashboardIcon from '../assets/images/Dashboard.svg'
import goalIcon from '../assets/images/goal.svg';
import settingIcon from '../assets/images/settings.svg'
import profileIcon from '../assets/images/profileIconWhite.svg';
import downArrowWhite from '../assets/images/downArrowWhite.svg';
import logo from '../assets/images/transparent_white.svg'
import { withRouter } from "react-router";
import * as dashboardActions from "../redux/dashboard/actions";

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: user.getUser || {},
    };
    this.onLogout = this.onLogout.bind(this);
  }
componentDidMount(){
  this.props.getUser()
}
  onLogout() {
    user.logout();
    window.location.pathname = '/';
  }

  tabClick=(e)=>{  
      switch (e) {
        case 1:
        this.props.history.push("/dashboard")
        break;
        case 2:
        this.props.history.push("/goals")
        break;
        case 3:
        this.props.history.push("/settings")
      }
  }
  render() {    
    const {userData:{company,firstName,lastName},location:{pathname}} = this.props;         
    return (
      <div className="header">
          <Row className="nav-container">
          <Col xs={12} className="flex-left app-title-container padding-0">
          <Label className="app-title">
              <Image src={logo} className="logo" />
            </Label>
            {company ? <span className="company-name-label">
              <span >{company}</span>
            </span> : null}
            <div className="tabs">
              <div onClick={()=>this.tabClick(1)} > <Image src={dashboardIcon} alt="dashboardIcon" /> <span>DASHBOARD</span></div>
              <div onClick={()=>this.tabClick(2)} > <Image src={goalIcon} alt="goalIcon" /> <span>GOALS</span></div>
              <div onClick={()=>this.tabClick(3)} > <Image src={settingIcon} alt="settingIcon" /> <span>SETTINGS</span></div>
              <div className={`under-line ${pathname=== '/dashboard' ?"one":"one"} 
                   ${pathname=== '/goals' ?"two":null}
                   ${pathname=== '/settings' ?"three":null}`}>
              </div>
           </div>
            <div id="header-user-section">
            <div id="user-name">{firstName} {lastName}</div>
            <DropdownButton
             pullRight
              title={
                <div>
                  <Image src={profileIcon} className="profileIcon" />
                  <Image src={downArrowWhite} className="dd-icon" />
                </div>
              }
              id="bg-nested-dropdown"
              className="user-profile"
            >
                <div className="custom-dropdown-view">
                  <i className="fa fa-sign-out fa-lg username" aria-hidden="true" />
                  <Label className="setting cursor-pointer" onClick={this.onLogout}>
                    Sign Out
                  </Label>
                </div>
            </DropdownButton>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    userData: state.dashboard.userData.data
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUser: () => {
      return dispatch(dashboardActions.getUser());
    }
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Navigationbar));
