import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Label } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/App.css';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {

    }

    render() {
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
