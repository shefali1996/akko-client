import React from 'react';
import { Spin } from 'antd';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Col} from 'react-bootstrap';
import styles from '../../constants/styles';
import LineChart from '../../components/LineChart';
import PriceBox from '../../components/PriceBox';
import {METRICS_CARD} from '../../constants';

export default ({width, active, index, handleClickMetrics, value, data, openExploreMetric}) => {  
  return (<Col id={`card_${index}`} style={{width}} className="dashboard-card-container" >
    <Card className={`price-card-style ${active}`} >
      <CardHeader className="card-header-style" >
        <PriceBox value={value} analyze />
      </CardHeader>
      <CardText style={{padding: '0px'}}>
        <div>
          <LineChart data={data} selectedOption={METRICS_CARD} chartName={value.metric_name} />
        </div>
      </CardText>
      {openExploreMetric != undefined &&
        <div className={"exploreMetrics "+value.metric_name} title={`Click to explore ${value.title} in detail`} onClick={(e) => handleClickMetrics(`card_${index}`, value)} >
          <div className="exploreImage"/>
        </div>
      }
    </Card>
  </Col>
  );
};
