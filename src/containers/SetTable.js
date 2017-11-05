import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label, FormControl} from 'react-bootstrap';
import SearchInput from 'react-search-input'
import '../styles/App.css';

class SetTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markup: ''
        };
        this.goLanding = this.goLanding.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onMarkUpChange = this.onMarkUpChange.bind(this);
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
    
    onMarkUpChange(e) {

    }

    render() {
        let {markup} = this.state;
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
                            <div className="table-center margin-t-60">
                                <span className="select-style-comment-small">
                                    Enter the COGS values for all the products.
                                </span>
                                <span className="select-style-comment-small margin-t-10">
                                    (or)
                                </span>
                                <span className="select-style-comment-small margin-t-10">
                                    select products and set the markup you charge and we will back-calculate their original price.
                                </span>
                            </div>
                            <div className="table-center margin-t-10">
                                <SearchInput
                                    className="search-input"
                                    placeholder="Search all your inventory"
                                    onChange={this.searchUpdated}
                                    onFocus={this.onFocus}
                                />
                            </div>
                            <div className="markup-center margin-t-30">
                                <Col md={4} className="flex-right height-center">
                                    <span className="select-style-comment-small">
                                        Markup:
                                    </span>
                                    <FormControl
                                        type="text"
                                        className="markup-input"
                                        value={markup}
                                        onChange={this.onMarkUpChange}
                                    />
                                </Col>
                                <Col md={4} className="text-left left-padding">
                                    <div className="radio">
                                        <label className="select-style-comment-small">
                                            <input type="radio" value="option1" />
                                            Percentage
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label className="select-style-comment-small">
                                            <input type="radio" value="option2" />
                                            Fixed Markup
                                        </label>
                                    </div>
                                </Col>
                                <Col md={4} className="flex-center height-center">
                                    <Button className="skip-button" onClick={this.onConnect}>
                                        SET MARKUP
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

export default connect(mapStateToProps)(SetTable);