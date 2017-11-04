import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label, FormControl, Image} from 'react-bootstrap';
import { invokeApig } from "../libs/awsLib";
import '../styles/App.css';
const queryString = require('query-string');

class BusinessType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopName: ''
        };
        this.goLanding = this.goLanding.bind(this);
        this.onShopNameChange = this.onShopNameChange.bind(this);
        this.onConnect = this.onConnect.bind(this);
    }

    componentDidMount() {
        
    }   

    componentWillMount() {
        
    }

    goLanding() {
        this.props.history.push('/');
    }

    onShopNameChange(e) {
        this.setState({
            shopName: e.target.value
        })
    }

    onConnect() {
        invokeApig({
            path: "/connect-shopify",
            method: "POST",
            body: {
              shopId: this.state.shopName
            }
        }).then((result) => {
            const uri = result.uri;
            window.location = uri;
        })
    }

    renderSuccessPage() {
        invokeApig({
            path: "/connect-shopify",
            method: "PUT",
            body: {
              shopId: this.state.shop,
              queryParams: this.props.location.search
        }}).then((result) => {
            localStorage.setItem("isAuthenticated", "isAuthenticated")
            this.props.history.push('/inventory');
        })
    }

    render() {
        let {shopName} = this.state;
        const parsedParams = queryString.parse(this.props.location.search);
        return (
            <div>
            {!Object.keys(parsedParams).length ?
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
                        <span className="shopify-instruction-text">
                            
                        </span>
                    </div>
                    <div className="text-center margin-t-50">
                        <Button className="login-button" onClick={this.onConnect}>
                            CONNECT                        
                        </Button>
                    </div>
                </Grid>
                :
                this.renderSuccessPage()
            }
            </div>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(BusinessType);