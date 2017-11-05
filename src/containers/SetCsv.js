import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label, Image} from 'react-bootstrap';
import '../styles/App.css';
import cogs2 from '../assets/cogs2.svg'

class SetCsv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopName: ''
        };
        this.goLanding = this.goLanding.bind(this);
        this.onConnect = this.onConnect.bind(this);
    }

    componentDidMount() {
        
    }   

    componentWillMount() {
        
    }

    goLanding() {
        this.props.history.push('/');
    }
    
    onConnect() {
        this.props.history.push('/set-table');
    }
    
    render() {
        return (
            <div>
                <Grid className="login-layout">
                    <Row>
                        <Col md={12}>
                            <Col md={6} className="text-left padding-t-20">
                                <Label className="login-title">
                                    akko
                                </Label>
                            </Col>
                            <Col md={6} className="text-right padding-t-20">
                                <Button className="logout-button" onClick={this.goLanding}/>
                            </Col>
                        </Col>
                    </Row>
                    <Row className="account-setup-header">
                        <span className="account-comment">
                            Account Setup
                        </span>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3} className="center-view">
                            <div className="text-center margin-t-40">
                                <span className="select-style-text">
                                    Set COGS for your products
                                </span>
                            </div>
                            <div className="text-center margin-t-5">
                                <span className="select-style-comment">
                                    We will use these Cost of Goods Sold (COGS) estimates to calculate your gross profit
                                </span>
                            </div>
                            <div className="text-center margin-t-5">
                                <span className="select-style-comment-small">
                                    ( you can update these anytime from the Settings menu )
                                </span>
                            </div>
                            <div className="content-center margin-t-40">
                                <Col md={7} className="no-padding">
                                    <div>
                                        <div className="step-one-view">
                                            <span className="step-title">
                                                STEP 1: 
                                            </span>
                                            <span className="step-content">
                                                &nbsp;Download CSV
                                            </span>
                                        </div>
                                        <div className="margin-t-20 text-center">
                                            <span className="step-content">
                                                We have pre-filled this CSV file with your SKUs. Just download the file, enter the COGS values and upload it.
                                            </span>
                                        </div>
                                        <div className="step-one-view margin-t-30">
                                            <span className="step-title">
                                                STEP 2: 
                                            </span>
                                            <span className="step-content">
                                                &nbsp;Fill COGS values
                                            </span>
                                        </div>
                                        <div className="step-one-view margin-t-30">
                                            <span className="step-title">
                                                STEP 3: 
                                            </span>
                                            <span className="step-content">
                                                &nbsp;Upload the finished CSV file
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={5} className="flex-right no-padding">
                                    <div className="style-icon-view">
                                        <Image src={cogs2} className="business-icon" />
                                    </div>
                                </Col>
                            </div>
                            <div className="drag-view margin-t-20">
                                <span className="drag-text">
                                    drag and drop your finished CSV file here
                                </span>
                            </div>
                            <div className="flex-center margin-t-20">
                                <span className="step-content">
                                    (or)
                                </span>
                            </div>
                            <div className="flex-center margin-t-20">
                                <Button className="login-button" onClick={this.onConnect}>
                                    UPLOAD CSV
                                </Button>
                            </div>
                            <div className="content-center margin-t-40">
                                <Col md={6} className="text-left no-padding">
                                    <Button className="skip-button" onClick={this.onConnect}>
                                        SKIP FOR NOW
                                    </Button>
                                </Col>
                                <Col md={6} className="text-right no-padding">
                                    <Button className="login-button" onClick={this.onConnect}>
                                        SUBMIT
                                    </Button>
                                </Col>
                            </div>
                        </Col>
                        <Col md={3} className="center-view">
                            <div className="description-view margin-t-40 text-center">
                                <span className="select-style-comment">
                                    COGS is the cost of buying one unit of the product from your vendor.
                                </span>
                            </div>
                            <div className="description-view margin-t-10 text-center">
                                <span className="select-style-comment">
                                    Do not include costs incurred when selling the product, like Shipping, Tax or Discounts.
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(SetCsv);