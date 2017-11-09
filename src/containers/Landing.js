import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Image, FormControl } from 'react-bootstrap';
import { StyleRoot } from 'radium';
import Header from '../components/Header';
import { validateEmail, animationStyle } from '../constants';
import '../styles/App.css';
import computer from '../assets/computer.png'

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isValid: false
        };
        this.goSignUp = this.goSignUp.bind(this)
        this.onEmailChange = this.onEmailChange.bind(this)
        this.onEmailFocus = this.onEmailFocus.bind(this)
        this.onEmailBlur = this.onEmailBlur.bind(this)
    }

    componentWillMount() {

    }

    onEmailChange(e) {
        this.setState({
            email: e.target.value
        });
    }

    onEmailFocus() {
        let { email, isValid } = this.state;
        if (email.length > 0 && isValid) {
            this.setState({
                isValid: false
            })
        }
    }

    onEmailBlur() {
        let { email, isValid } = this.state;
        if (email.length > 0 && !isValid) {
            this.setState({
                isValid: true
            })
        }
    }

    goSignUp() {
        let { email } = this.state;
        this.setState({
            isValid: false
        })
        if (validateEmail(email)) {
            this.props.history.push({
                pathname: '/signup',
                query: {
                    email: email
                }
            })
        } else {
            this.setState({
                isValid: true
            })
        }
    }

    render() {
        let { email, isValid } = this.state
        return (
            <Grid className="main-layout">
                <Header history={this.props.history} />
                <Row>
                    <Col md={12} className="text-center padding-t-66">
                        <Label className="large-title">
                            Real-time dashboard for multi-channel eCommerce
                        </Label>
                    </Col>
                    <Col md={12} className="text-center padding-t-20">
                        <Label className="middle-title">
                            Instantly sync inventory and orders across multiple channels
                        </Label>
                    </Col>
                    <Col md={12} className="text-center padding-t-5">
                        <Label className="middle-title">
                            Track and compare performance in real-time
                        </Label>
                    </Col>
                    <Col md={12} className="padding-t-30">
                        <Col md={7} className="text-right">
                            <Col md={6} className="text-center" mdOffset={6}>
                                <Col md={12} className="text-center">
                                    <Label className="small-title">
                                        Sign up now for a 30 day free trial
                                    </Label>
                                </Col>
                                <Col md={12} className="text-center flex-center padding-t-10">
                                    <FormControl
                                        ref="email"
                                        type="text"
                                        placeholder="email"
                                        className="email-input"
                                        value={email}
                                        data-tip="invalid email address"
                                        data-for='sadFace'
                                        onChange={this.onEmailChange}
                                        onFocus={this.onEmailFocus}
                                        onBlur={this.onEmailBlur}
                                    />
                                </Col>
                                <Col md={12} className="text-center">
                                    {isValid ?
                                        <StyleRoot>
                                            <div className="bubble-alert-view" style={animationStyle.headShake}>
                                                <span className="alert-text">
                                                    Invalid email address
                                            </span>
                                                <i className="fa fa-info-circle fa-lg red-mark" aria-hidden="true"></i>
                                            </div>
                                        </StyleRoot>
                                        :
                                        <StyleRoot>
                                            <div className="bubble-alert-view">
                                            </div>
                                        </StyleRoot>
                                    }
                                </Col>
                            </Col>
                        </Col>
                        <Col md={5} className="padding-t-30">
                            <Button className="trial-button" onClick={this.goSignUp}>
                                START FREE TRIAL
                            </Button>
                        </Col>
                    </Col>
                    <Col md={12} className="padding-t-50 text-center">
                        <Image src={computer} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(Landing);
