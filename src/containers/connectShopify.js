import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col, Button, Label} from 'react-bootstrap';
import '../styles/App.css';
import shopifyIcon from '../assets/shopify.svg'

class connectShopify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.goLanding = this.goLanding.bind(this)
    }

    componentDidMount() {
        
    }   

    componentWillMount() {
        
    }

    goLanding() {
        this.props.history.push('/');
    }

    render() {
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

                </div>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(connectShopify);