import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, FormControl, Button } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/App.css';
import shopifyicon from '../assets/shopifyicon.svg';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
        this.onEmailChange = this.onEmailChange.bind(this);
    }

    componentWillMount() {

    }

    onEmailChange(e) {
        this.setState({email: e.target.value})
    }

    render() {
        let {email} = this.state;
        return (
            <Grid className="main-layout">
                <Header history={this.props.history} />
                <Row>
                    <Col md={12} className="text-center padding-t-66">
                        <p className="large-title">
                            Predictive business analytics for eCommerce
                        </p>
                    </Col>
                    <Col md={12}>
                        <p className="middle-title">
                            Prevent customer churn and stockouts before they happen. Track your profits, sales, 
                        </p>
                    </Col>
                    <Col md={12}>
                        <p className="middle-title">
                            customer behavior and inventory in realtime, all from a single dashboard.
                        </p>
                    </Col>
                    <Col md={12} className="inline-block text-center margin-t-20">
                        <span className="small-title">
                            Works with
                        </span>
                        <span>
                            <img src={shopifyicon} className="shopify-icon" alt="shopify"/>
                        </span>
                        <span className="small-title">
                            . More integrations coming soon.
                        </span>
                    </Col>
                    <Col md={12} className="margin-t-20">
                        <Col md={6}>
                            <div className="text-center">
                                <p className="invite-text">
                                    Request an invite to get early access!
                                </p>
                            </div>
                            <div className="margin-t-20">
                                <Col md={7}>
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
                                <Col md={5} className="text-center">
                                    <Button className="invite-button">
                                        REQUEST INVITE
                                    </Button>
                                </Col>
                            </div>
                        </Col>
                        <Col md={6}>
                            
                        </Col>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(Landing);
