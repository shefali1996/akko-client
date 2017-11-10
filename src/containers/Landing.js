import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, FormControl, Button } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/App.css';
import shopifyicon from '../assets/shopifyicon.svg';
import landing1 from '../assets/landing_1.png';
import landing2 from '../assets/landing_2.png';
import landing3 from '../assets/landing_3.png';

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
                    <Col md={12} className="productive-text-view">
                        <p className="large-title">
                            Predictive business analytics for eCommerce
                        </p>
                    </Col>
                    <Col md={12} className="flex-center">
                        <p className="middle-title">
                            Prevent customer churn and stockouts before they happen. Track your profits, sales
                            customer behavior and inventory in realtime, all from a single dashboard.
                        </p>
                    </Col>
                    <Col md={12}>
                        <p className="middle-title">
                            
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
                    <Col md={12} className="productive-text-view">
                        <Col md={6} className="no-padding">
                            <div className="request-view">
                                <p className="invite-text">
                                    Request an invite to get early access!
                                </p>
                            </div>
                            <div className="margin-t-20">
                                <div className="email-view">
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
                                    <Button className="invite-button">
                                        REQUEST INVITE
                                    </Button>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="no-padding">
                            <Col md={6} className="flex-center">
                                <p className="recapture-text">
                                    Recapture customers before they leave you
                                </p>
                            </Col>
                            <Col md={6} className="text-center no-padding">
                                <img src={landing1} className="landing-image-one" alt="landing"/>
                            </Col>
                        </Col>
                    </Col>
                    <Col md={12} className="productive-text-view no-padding">
                        <Col md={3} className="flex-center">
                            <p className="inventory-text">
                                Low inventory forecasts so you never lose another sale
                            </p>
                        </Col>
                        <Col md={9} className="inventory-image-view">
                            <img src={landing2} className="landing-image-two" alt="landing"/>
                        </Col>
                    </Col>
                    <Col md={12} className="productive-text-view no-padding">
                        <Col md={3} className="flex-center">
                            <p className="inventory-text">
                                One dashboard to answer all your questions.
                            </p>
                        </Col>
                        <Col md={9} className="no-padding">
                            <div>
                                <Col md={4}>
                                    <p className="sale-text">
                                        How is my sales growing over time?
                                    </p>
                                </Col>
                                <Col md={4}>
                                    <p className="sale-text">
                                        What is my profit margin?
                                    </p>
                                </Col>
                                <Col md={4}>
                                    <p className="sale-text">
                                        How much are customers spending at my store?
                                    </p>
                                </Col>
                            </div>
                            <div>
                                <img src={landing3} className="landing-image-three" alt="landing"/>
                            </div>
                            <div>
                                <Col md={6} className="flex-center">
                                    <p className="sale-text">
                                        How is my gross profit trending over time?
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p className="sale-text">
                                        What is my customer retention rate?
                                    </p>
                                </Col>
                            </div>
                        </Col>
                    </Col>
                    <Col md={12} className="productive-text-view">
                        <p className="seek-text">
                            What other answers do you seek?
                        </p>
                    </Col>
                    <Col md={12} className="margin-t-50 no-padding">
                        <Footer history={this.props.history} />
                    </Col>
                </Row>
                
            </Grid>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(Landing);
