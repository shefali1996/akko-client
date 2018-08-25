import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import invalidImg from '../../assets/images/FontAwesome472.svg';
import styles from '../../constants/styles';
import {RESPONSE_TEXT_MATRICS,HAND_ON_TEXT,UPDATED_COGS_TEXT} from "../../constants"


export default ({width, status, onClickFetchStatus,propsData}) => {
  const cardText=propsData.metricsData.data.message===RESPONSE_TEXT_MATRICS?UPDATED_COGS_TEXT:HAND_ON_TEXT  
  return (<Col style={{width}} className="dashboard-card-container">
    <Card className="charts-card-style" >
      <CardHeader
        titleStyle={styles.chartsHeaderTitle}
        subtitleStyle={styles.expenseCardSubtitle}
      />
      <CardText style={styles.expenseCardText}>
        <div className="invalid-block text-center">
          <span className="image-container"><img src={invalidImg} alt="invalid" /></span>
          { status === -1 ? 
          <div className="invalid-text">Fetching data from Shopify has failed unexpectedly. We will resolve the issue and email you.</div>
          :
          <div>
            <div className="invalid-text">{cardText}</div>
            <div className="flex-center padding-t-10">
            {propsData.metricsData.data.message!==RESPONSE_TEXT_MATRICS &&
              <Button className="fetch-status-button" style={{}} onClick={() => onClickFetchStatus()}>
                  CHECK STATUS
              </Button>
            }
            </div>
          </div>
          }
        </div>
      </CardText>
    </Card>
  </Col>
  );
};
