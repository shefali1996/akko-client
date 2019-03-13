import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';
import Switch from 'antd/lib/switch';
import Progress from 'antd/lib/progress';
import 'antd/lib/switch/style'
import 'antd/lib/progress/style'
import styles from '../../constants/styles';

export default ({data, tableData, progress, hideCompleted, doToggleRows}) => {
  const {total, pending, completed} = progress;
  const per = (completed / total) * 100;
  return (
    <div>
      <div className="margin-0 padding-t select-style-comment-small setcogs-status">
        <Col xs={6} className="flex-left height-center">
          COMPLETED
        <br />
          {completed} / {total}
          
        </Col>
        <Col xs={6} className="flex-right height-center">
          PENDING
          <br />
          {pending}
        </Col>
      </div>
      <div className="margin-0 padding-0">
        <Col xs={12} className="flex-right height-center margin-0 padding-0" style={styles.cogsProgressBarContainer}>
          <Progress strokeWidth={5} percent={per} showInfo={false} />
        </Col>
      </div>
    </div>
  );
};
