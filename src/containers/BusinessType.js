import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label} from 'react-bootstrap';
import '../styles/App.css';
import businessType1 from '../assets/businessType1.svg'
import businessType2 from '../assets/businessType2.svg'
import businessType3 from '../assets/businessType3.svg'
import businessType4 from '../assets/businessType4.svg'

class BusinessType extends Component {
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
                    <div className="text-center margin-t-40">
                        <span className="select-style-text">
                            Select the style of your business
                        </span>
                    </div>
                    <div className="text-center margin-t-5">
                        <span className="select-style-comment">
                            This enables us to customize akko to best suit your business style
                        </span>
                    </div>
                    <div className="flex-center margin-t-40">
                        <div className="style-container flex-center">
                            <div className="style-icon-view">

                            </div>
                        </div>
                    </div>
                    <div className="flex-center margin-t-10">
                        <div className="style-container flex-center">

                        </div>
                    </div>
                    <div className="flex-center margin-t-10">
                        <div className="style-container flex-center">

                        </div>
                    </div>
                    <div className="flex-center margin-t-10">
                        <div className="style-container flex-center">

                        </div>
                    </div>
                    <div className="text-center margin-t-50">
                        <Button className="login-button" onClick={this.onConnect}>
                            PROCEED
                        </Button>
                    </div>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(BusinessType);