import React from "react";
import { Card,CardText } from "material-ui/Card";
import { Col } from "react-bootstrap";
import { Spin } from 'antd';

export default () => {
  const CustomSpin = (
    <div style={{width: '100%', textAlign: 'center'}}>
      <Spin size="large" />
    </div>
  );
  return (<Col  className="dashboard-goal-card-container">
    <Card className="goal-card-style">
      <CardText>
        <div style={{padding: '20%'}}>
          {CustomSpin}
        </div>
      </CardText>
    </Card>
  </Col>
  );
};
