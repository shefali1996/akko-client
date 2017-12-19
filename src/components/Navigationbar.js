import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Label, Image, DropdownButton } from 'react-bootstrap';
import user from '../auth/user';
import profileIcon from '../assets/images/profileIcon.svg';

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const {companyName} = this.props;
    return (
      <div className="nav-container">
        <Row>
          <Col md={3} sm={6} xs={6} className="flex-left app-title-container">
            <Label className="app-title">
              akko
            </Label>
            {companyName ? <span className="company-name-label">
              <span>{companyName}</span>
            </span> : null}
          </Col>
          <Col md={2} mdOffset={7} sm={6} xs={6} className="text-right no-padding">
            <DropdownButton
              title={
                <div>
                  <Image src={profileIcon} className="profileIcon" />
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
