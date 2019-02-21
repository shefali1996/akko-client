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
      <div className="margin-0 padding-0 select-style-comment-small">
        <Col xs={4} className="flex-left height-center">
          {completed} / {total}
          <br />
          Completed
        </Col>
        <Col xs={4} className="text-center hide-completed">
          <div className="text">{hideCompleted ? 'Hiding completed' : 'Showing completed'}</div>
          <div className="switch"><Switch defaultChecked={hideCompleted} onChange={(checked) => doToggleRows(checked)} /></div>
        </Col>
        <Col xs={4} className="flex-right height-center">
          {pending}
          <br />
          Pending
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
