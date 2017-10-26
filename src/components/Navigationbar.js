import React, {Component} from 'react';
import '../styles/App.css';
import {connect} from 'react-redux';
import { Row, Col, Label, Image, DropdownButton } from 'react-bootstrap';
import down from '../assets/down.svg'
import user from '../assets/user.svg'
import { signOutUser } from "../libs/awsLib";

class Navigationbar extends Component {
    constructor(props) {
		super(props);
		this.state = {
            email: '',
            password: ''
        };
        this.onLogout = this.onLogout.bind(this)
    }

    onLogout() {
      signOutUser();
      localStorage.removeItem("isAuthenticated");
      this.props.history.push('/');
    }

  	render() {
		return (
			<div className="nav-container">
				<Row className="no-margin white-bg">
					<Col md={3} xs={4} className="flex-left">
						<Label className="app-title">
							akko
						</Label>
					</Col>
					<Col md={7} xs={3}>
					</Col>
					<Col md={2} xs={5} className="text-right no-padding">
						<DropdownButton
							title={
								<div>
									<Image src={down} className="down" />
									<Label className="username">
										John Smith
									</Label>
									<Image src={user} className="user" />
								</div>
							}
							id="bg-nested-dropdown"
							className="user-profile"
						>
                            <div>
                                <div className="custom-dropdown-view">
                                    <i className="fa fa-cog fa-lg username" aria-hidden="true"></i>
                                    <Label className="setting cursor-pointer">
                                        Settings
                                    </Label>
                                </div>
                                <div className="custom-dropdown-view">
                                    <i className="fa fa-sign-out fa-lg username" aria-hidden="true"></i>
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
