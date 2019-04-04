import React from "react";
import { Card, CardHeader } from "material-ui/Card";
import { Col, Button } from "react-bootstrap";
import failedIcon from "../../../assets/images/goal-failed.svg";
import { fail } from "assert";
import { getSmallCardData } from "../../../helpers/goalDataFormat";

export default ({ data = {}, onOkay,metrics={} }) => {
  const { goalId } = data;
  const smallCard = getSmallCardData(data,metrics);
  const { heading, failedText } = smallCard;
  const cardStyle = { backgroundColor: "" };
  const cardHeaderStyle = {
    paddingLeft: "6px",
    paddingTop: "10px",
    height: "48px",
    backgroundColor: "#4688ff",
    backgroundSize: "cover"
  };
  const title = (
    <div className="title">
      <div className="ellipsis">{heading}</div>
    </div>
  );

  return (
    <Col className="dashboard-goal-card-container">
      <Card className="goal-card-style hide-m" style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title={title} />
        <div className="failed flex row align-center">
          <div className="content flex col align-center margin-r-16">
            <div className="icon-box">
              <img alt="" src={failedIcon} />
            </div>
            <div className="goal-status">TIME UP</div>
          </div>
          <div className="text">{failedText}</div>
        </div>
        <div>
          <Button
            onClick={e => {
              e.preventDefault();
              onOkay(goalId);
            }}
            className="goal-archive-btn bg-color-failed"
          >
            ARCHIVE
          </Button>
        </div>
      </Card>
      <div className="only-m time-up-bg box">
        <div className="time-up-header">{title}</div>
        <div className="icon-box time-up">
          <img alt="" src={failedIcon} />
        </div>
        <div className="time-up-text">{failedText}</div>
      </div>
    </Col>
  );
};
