import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid,Row, Col, Label, Image, DropdownButton } from 'react-bootstrap';
import user from '../auth/user';
import profileIcon from '../assets/images/profileIconWhite.svg';
import downArrowWhite from '../assets/images/downArrowWhite.svg';
import logo from '../assets/images/transparent_white.svg'

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: user.getUser || {}
    };
    this.onLogout = this.onLogout.bind(this);
    this.goToSetting = this.goToSetting.bind(this);
  }

  onLogout() {
    user.logout();
    window.location.pathname = '/';
  }

  goToSetting() {
    this.props.history.push('/settings');
  }
  render() {
    const companyName = this.props.companyName;
    return (
      <div className="header">
          <Row className="nav-container">
          <Col md={8} sm={6} xs={8} className="flex-left app-title-container padding-0">
            <Label className="app-title">
              <Image src={logo} className="logo" />
            </Label>
            {companyName ? <span className="company-name-label">
              <span >{companyName}</span>
            </span> : null}
          </Col>
          <Col  md={4} sm={6} xs={4} className="pull-right text-right setting-popup padding-0">
            <DropdownButton
              title={
                <div>
                  <Image src={profileIcon} className="profileIcon" />
                  <Image src={downArrowWhite} className="dd-icon" />
                </div>
              }
              id="bg-nested-dropdown"
              className="user-profile"
            >
              <div>
                <div className="custom-dropdown-view">
                  <i className="fa fa-cog fa-lg username" aria-hidden="true" />
                  <Label className="setting cursor-pointer" onClick={this.goToSetting}>
                    Settings
                  </Label>
                </div>
                <div className="custom-dropdown-view">
                  <i className="fa fa-sign-out fa-lg username" aria-hidden="true" />
                  <Label className="setting cursor-pointer" onClick={this.onLogout}>
                    Sign Out
                  </Label>
                </div>
              </div>
            </DropdownButton>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect()(Navigationbar);
