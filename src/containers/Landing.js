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
                            Predictive business analytics for eCommerce
                        </Label>
                    </Col>
                    <Col md={12} className="text-center padding-t-20">
                        <Label className="middle-title">
                            Prevent customer churn and stockouts before they happen. Track your profits, sales, 
                        </Label>
                    </Col>
                    <Col md={12} className="text-center padding-t-5">
                        <Label className="middle-title">
                            customer behavior and inventory in realtime, all from a single dashboard.
                        </Label>
                    </Col>
                    <Col md={12} className="padding-t-30">
                                                
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(Landing);
