import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Label, Image, DropdownButton } from 'react-bootstrap';
import '../styles/App.css';
import user from '../auth/user';
import profileIcon from '../assets/profileIcon.svg';

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout() {
    user.logout();
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="nav-container">
        <Row className="no-margin white-bg">
          <Col md={3} className="flex-left">
            <Label className="app-title">
              akko
            </Label>
          </Col>
          <Col md={2} mdOffset={7} className="text-right no-padding">
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
                  <Label className="setting cursor-pointer">
                  Settings
                  </Label>
                </div>
                <div className="custom-dropdown-view">
                  <i className="fa fa-sign-out fa-lg username" aria-hidden="true" />
                  <Label className="setting cursor-pointer" onClick={this.onLogout}>
                    Logout
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
