import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Row, Col, Label, Button, Image, Grid, Tabs, Tab } from 'react-bootstrap';
import infoIcon from '../../assets/images/MaterialIcon5.svg';
import invalidImg from '../../assets/images/FontAwesome472.svg';
import styles from '../../constants/styles';


export default ({width, index, value, userData, onClickSetCogs,height}) => {
  return (<Col key={index} id={`card_${index}`} className="dashboard-card-container">
    <Card className="charts-card-style" >
      <CardHeader
        style={{padding: '20px'}}
        title={<span className="price-title">
          {value.title} <img src={infoIcon} className="alt-price-title" alt="info icon" title={value.description} />
               </span>}
        titleStyle={styles.chartsHeaderTitle}
        subtitleStyle={styles.expenseCardSubtitle}
      />
      <CardText style={styles.expenseCardText}>
        <div className="invalid-block text-center">
          <span className="image-container"><img src={invalidImg} alt="invalid" /></span>
          <div className="invalid-text">
            {userData.cogsStatus == 1
            ? <div><div>We ve successfully set COGS for all your products.</div>
              <div>Now, hang on for a few moments while we update all your metrics.</div>
            </div>
          : 'Please set COGS for your products to calculate these values.'
        }
          </div>
          {userData.cogsStatus == 1
        ? '' :
        <div className="flex-center padding-t-10">
          <Button className="login-button" onClick={() => onClickSetCogs()}>
              SET COGS
          </Button>
        </div>
    }
        </div>
      </CardText>
    </Card>
  </Col>
  );
};
