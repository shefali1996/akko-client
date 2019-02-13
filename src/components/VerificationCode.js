import React, { Component } from "react";
import {
  Col,
  Button,
  Label,
  FormControl,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";
import { Spin } from "antd";
import MaterialIcon from "../assets/images/MaterialIcon.svg";

export default class VerificationCode extends Component {
  render() {
    return (
      <div className="verification-container">
        <Col md={12} className="">
          <h1 className="main-heading">Creating your new</h1>
          <h1 className="main-heading bottom-heading">Akko account</h1>
        </Col>
        <Col md={12}>
          <p className="info first-info">We take security very seriously to</p>
          <p className="info"> protect your sensitive data.</p>
          <p className="detail first-detail">We have sent a verification code to</p>
          <p className="detail"> {this.props.email}.Please enter the code to</p>
          <p className="detail">  verify your identity.</p>
        </Col>

        <Col md={12} className="flex-center padding-t-15">
          <OverlayTrigger
            placement="left"
            trigger="manual"
            overlay={
              <Tooltip id="tooltip">
                <img src={MaterialIcon} alt="icon" />
                {this.props.codeError}
              </Tooltip>
            }
          >
            <FormControl
              type="text"
              placeholder="verification code"
              className="signup-email-input"
              value={this.props.verifyCode}
              onFocus={this.props.onCodeFocus}
              onChange={this.props.onVerifyCodeChange}
            />
          </OverlayTrigger>
        </Col>
        <Col md={12} className="padding-t-20">
          <Button className="login-button" onClick={this.props.onVerify}>
            VERIFY
            <div
              style={{
                marginLeft: 10,
                display: this.props.pendingRequest ? "inline-block" : "none"
              }}
            >
              <Spin size="small" />
            </div>
          </Button>
        </Col>
      </div>
    );
  }
}
