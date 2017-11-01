import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label, FormControl, Image} from 'react-bootstrap';
import '../styles/App.css';
import shopifyIcon from '../assets/shopify.svg'

class connectShopify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopName: ''
        };
        this.goLanding = this.goLanding.bind(this);
        this.onShopNameChange = this.onShopNameChange.bind(this);
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

    render() {
        let {shopName} = this.state;
        return (
            <Grid className="login-layout">
                <Row>
                    <Col md={12}>
                        <Col md={6} className="text-left padding-t-20">
                            <Label className="login-title">
                                akko
                            </Label>
                        </Col>
                        <Col md={6} className="text-right padding-t-20">
                            <Button className="close-button" onClick={this.goLanding}/>
                        </Col>
                    </Col>
                </Row>
                <Row className="border-view">
                    <span className="shopify-comment">
                        Let's get your Shopify store connected
                    </span>
                </Row>
                <div className="shopify-input-view">
                    <Image src={shopifyIcon} className="shopify-icon" />
                    <FormControl
                        type="text"
                        placeholder="shop name"
                        className="signup-email-input"
                        value={shopName}
                        onChange={this.onShopNameChange}
                    />
                    <span className="shopify-url-text">
                        .myshopify.com
                    </span>
                </div>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(connectShopify);