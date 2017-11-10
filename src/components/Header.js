import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Label } from 'react-bootstrap';
import '../styles/App.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.goFeature = this.goFeature.bind(this);
        this.goHome = this.goHome.bind(this);
        this.goLogin = this.goLogin.bind(this);
        this.goSignUp = this.goSignUp.bind(this);
    }

    goFeature() {
        this.props.history.push('/signin');
    }

    goHome() {
        this.props.history.push('/inventory');
    }

    goLogin() {
        this.props.history.push('/signin');
    }

    goSignUp() {
        this.props.history.push('/signup');
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <Label className="logo-title">
                        akko
                    </Label>
                </Col>
            </Row>
        );
    }
}

export default connect()(Header);
