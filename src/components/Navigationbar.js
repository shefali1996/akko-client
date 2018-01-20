import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Label, Image, DropdownButton } from 'react-bootstrap';
import user from '../auth/user';
import profileIcon from '../assets/images/profileIconWhite.svg';
import downArrowWhite from '../assets/images/downArrowWhite.svg';
import { invokeApig } from '../libs/awsLib';

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
    this.props.history.push('/');
  }

  goToSetting() {
    this.props.history.push('/settings');
  }
  render() {
    const companyName = this.props.companyName;
    return (
      <div className="nav-container">
        <Row>
          <Col md={3} sm={6} xs={6} className="flex-left app-title-container padding-left-right-7">
            <Label className="app-title">
              akko
            </Label>
            {companyName ? <span className="company-name-label">
              <span>{companyName}</span>
            </span> : null}
          </Col>
          <Col md={2} sm={6} xs={6} className="pull-right padding-left-right-7">
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
