import React, { Component } from 'react';
import { Row, Col, Label, Button, Image } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import { Select } from 'antd';

const Option = Select.Option;

const styles = {
  chipLabelStyle: {
    fontSize: '12px',
    color: '#ffffff',
    fontWeight: 'bold',
    textDecoration: 'none solid white',
    paddingLeft: '30px',
    paddingRight: '30px'
  }
};

class AnalysisRightPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div className="content-box right-box">
        <Row>
          <Col md={12} className="text-center">
            <div className="select-container">
              <Select defaultValue="1" onChange={(event, index, value) => { this.setState({value}); }}>
                <Option value="1">Oct, 28, 2017  - Nov, 28, 2017</Option>
                <Option value="2">Oct, 29, 2017  - Nov, 29, 2017</Option>
                <Option value="3">Oct, 30, 2017  - Nov, 30, 2017</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-center">
            <Card className="charts-card-style">
              <CardText className="card-content text-center">
                <div className="card-title">Filter By Product</div>
                <div className="chip-wrapper">
                  <Chip className="chip" labelStyle={styles.chipLabelStyle}>Showing 5 products</Chip>
                </div>
                <div className="link"><a onClick={() => this.props.openFilter('product')} >change filter</a></div>
              </CardText>
            </Card>
          </Col>
          <Col md={12} className="text-center">
            <Card className="charts-card-style">
              <CardText className="card-content text-center">
                <div className="card-title">Filter By customers</div>
                <div className="chip-wrapper">
                  <Chip className="chip" labelStyle={styles.chipLabelStyle}>Showing all customers</Chip>
                </div>
                <div className="link"><a onClick={() => this.props.openFilter('customer')}>change filter</a></div>
              </CardText>
            </Card>
          </Col>
          <Col md={12} className="text-center">
            <Card className="charts-card-style">
              <CardText className="card-content text-center">
                <div className="card-title">Filter By metrics</div>
                <div className="chip-wrapper">
                  <Chip className="chip" labelStyle={styles.chipLabelStyle}>Showing all Financial metrics</Chip>
                </div>
                <div className="link"><a onClick={() => this.props.openFilter('metrics')}>change filter</a></div>
              </CardText>
            </Card>
          </Col>
          <Col md={12} className="text-center">
            <Card className="charts-card-style">
              <CardText className="card-content text-center">
                <div className="card-title">Add custom filters</div>
                <div className="chip-wrapper">
                  <Chip className="chip" labelStyle={styles.chipLabelStyle}>Using 0 custom filters</Chip>
                </div>
                <div className="link"><a href="#">change filter</a></div>
              </CardText>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AnalysisRightPanel;
