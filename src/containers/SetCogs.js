import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label, Image} from 'react-bootstrap';
import '../styles/App.css';
import cogs1 from '../assets/cogs1.svg'
import cogs2 from '../assets/cogs2.svg'
import cogs3 from '../assets/cogs3.svg'

class SetCogs extends Component {
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
                        <Col md={6} mdOffset={3}>
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
                            <div className="flex-center margin-t-40">
                                <span className="select-style-comment">
                                    We found 112 products in 364 variants from your shop. How do you
                                </span>
                            </div>
                            <div className="flex-center margin-t-5">
                                <span className="select-style-comment">
                                    want to set COGS for all these products?
                                </span>
                            </div>
                            <div className="flex-center margin-t-40">
                                <div className="style-container flex-center">
                                    <div className="style-icon-view">
                                        <Image src={cogs1} className="business-icon" />
                                    </div>
                                    <div className="style-text-view">
                                        <span className="select-text-large">
                                            ENTER MANUALLY
                                        </span>
                                        <span className="select-text-small">
                                            Enter COGS for each product manually.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-center margin-t-10">
                                <div className="style-container flex-center">
                                    <div className="style-icon-view">
                                        <Image src={cogs2} className="business-icon" />
                                    </div>
                                    <div className="style-text-view">
                                        <span className="select-text-large">
                                            UPLOAD CSV
                                        </span>
                                        <span className="select-text-small">
                                            We will prefill the SKUs in a CSV which you can download, enter
                                        </span>
                                        <span className="select-text-small">
                                            COGS and upload.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-center margin-t-10">
                                <div className="style-container flex-center">
                                    <div className="style-icon-view">
                                        <Image src={cogs3} className="business-icon" />
                                    </div>
                                    <div className="style-text-view">
                                        <span className="select-text-large">
                                            SET MARKUP
                                        </span>
                                        <span className="select-text-small">
                                            You can set the markup that you charge and we can back
                                        </span>
                                        <span className="select-text-small">
                                            calculate your COGS by comparing it against your selling price.
                                        </span>
                                    </div>
                                </div>
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
                    <div className="text-center margin-t-50">
                        <Button className="skip-button" onClick={this.onConnect}>
                            SKIP FOR NOW
                        </Button>
                    </div>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(SetCogs);