import React from 'react';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import styles from '../../constants/styles';

export default ({width,height}) => {
  const CustomSpin = (
    <div style={{width: '100%', textAlign: 'center'}}>
      <Spin size="large" />
    </div>
  );
  return (<Col  className="dashboard-card-container">
    <Card className="price-card-style">
      <CardText>
        <div style={{padding: '40%'}}>
          {CustomSpin}
        </div>
      </CardText>
    </Card>
  </Col>
  );
};
