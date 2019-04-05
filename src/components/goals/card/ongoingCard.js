import React from "react";
import { Card, CardHeader } from "material-ui/Card";
import {Progress} from "antd";
import { Col, Button, ProgressBar } from "react-bootstrap";
import editPen from "../../../assets/images/edit-pen.svg";
import {getSmallCardData} from '../../../helpers/goalDataFormat';

export default ({ data = {},openEditModal,metrics }) => {
  
  const {goalId} = data;
  const smallCard = getSmallCardData(data,metrics);
  const {
    heading ,
    subheading ,
    daysLeftText,
    deadline,
    current,
    goal,
    percentage=0,
    timePercentage = 0
  } = smallCard;


  let currentPercent = parseInt(percentage) || 0;
  let goalPercent = 100;
  if (currentPercent > 100) {
    goalPercent = (goalPercent * 100) / currentPercent;
    goalPercent = goalPercent - 10;
    currentPercent = 100;
  }

  const cardStyle = { backgroundColor: "" };
  const cardHeaderStyle = {
    paddingLeft: "6px",
    paddingTop: "10px",
    height: "48px",
    width: "100%",
    backgroundColor: "#4688ff",
    backgroundSize: "cover"
  };
  const title = (
    <div className="title flex justify-content-space-between">
      <div className="">
        <div className="ellipsis">{heading}</div>
        <div style={{fontSize:'11px'}}>{subheading}</div>
      </div>
    </div>
  );
  const progressText = (percent)=>{
    return (<div className="progress-text">
      {percent}
    </div>);
  }
  

  return (
    <Col className="dashboard-goal-card-container">
      <Card className="goal-card-style ongoing" style={cardStyle}>
        <CardHeader className="goal-card-header" style={cardHeaderStyle} title={title} />
        <div className="ongoing">
        <div className="flex justify-content-space-between margin-t-10 padding-l-6">
        <div className="flex-grow-1">
              <div className="progress-box flex-grow-1 flex">
                <div className="goal-title">GOAL</div>
                <div className="target flex-grow-1" >
                <div className="flex">
                    <div className="bar hide-m margin-r8" style={{width:`${goalPercent}%`}} />
                    <div className="goal">{goal}</div>
                  </div>
                </div>
              </div>

              <div className="progress-box flex-grow-1 flex margin-b15">
                <div className="goal-title">CURRENT</div>
                <div className="current flex-grow-1">
                  <div className="flex">
                    <div className="bar hide-m margin-r8" style={{width:`${currentPercent}%`}} />
                    <div className="goal">{current}</div>
                  </div>
                </div>
              </div>
            </div>
        <Progress className = "box" type="circle" percent={parseInt(percentage) || 0} width={61} strokeWidth={3} format={() => progressText(`${percentage}%`)} />
        </div>

          <div className="trace">
            <div className="flex justify-content-space-between">
              <div className="day-left">
                <div className="detail padding-l-6 padding-t-10">{daysLeftText}</div>
              </div>
              <div className="end-on padding-r-10">
                <div className="title">DEADLINE</div>
                <div className="detail">{deadline}</div>
              </div>
            </div>
            <ProgressBar now={timePercentage} />
          </div>
        </div>
      </Card>
    </Col>
  );
};
