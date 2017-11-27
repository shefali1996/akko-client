import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Image } from 'react-bootstrap';
import '../styles/App.css';
import businessType1 from '../assets/images/businessType1.svg';
import businessType2 from '../assets/images/businessType2.svg';
import businessType3 from '../assets/images/businessType3.svg';
import businessType4 from '../assets/images/businessType4.svg';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: ''
    };
    this.goLanding = this.goLanding.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onTypeOneSelected = this.onTypeOneSelected.bind(this);
    this.onTypeTwoSelected = this.onTypeTwoSelected.bind(this);
    this.onTypeThreeSelected = this.onTypeThreeSelected.bind(this);
    this.onTypeFourSelected = this.onTypeFourSelected.bind(this);
  }

  componentDidMount() {

  }

  componentWillMount() {

  }

  goLanding() {
    this.props.history.push('/');
  }

  onTypeOneSelected() {
    this.setState({
      option: 'one'
    });
  }

  onTypeTwoSelected() {
    this.setState({
      option: 'two'
    });
  }

  onTypeThreeSelected() {
    this.setState({
      option: 'three'
    });
  }

  onTypeFourSelected() {
    this.setState({
      option: 'four'
    });
  }

  onConnect() {
    const { option } = this.state;
    if (option.length > 0) {
      this.props.history.push('/set-cogs');
    }
  }

  render() {
    const { option } = this.state;
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
                <Button className="logout-button" onClick={this.goLanding} />
              </Col>
            </Col>
          </Row>
          <Row className="account-setup-header">
            <span className="account-comment">
              Settings
            </span>
          </Row>
          <div className="text-center margin-t-40">
            <span className="update-style-title">
              UPDATE COGS
            </span>
          </div>
          <div className="text-center margin-t-40">
            <span className="update-style-text margin-t-20">
              You have <strong>114</strong> products in <strong>342</strong> variants.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>73</strong> products have COGS set.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>41</strong> products need COGS.
            </span>
          </div>
          <div className="text-center margin-t-50">
            <Button className="login-button" onClick={this.onConnect}>
                SET COGS
            </Button>
          </div>

        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(Setting);
