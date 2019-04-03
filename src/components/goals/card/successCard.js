import React from "react";
import { Card, CardHeader } from "material-ui/Card";
import { Col, Button } from "react-bootstrap";
import SuccessIcon from "../../../assets/images/apple-fill-success.svg";
import { getSmallCardData } from "../../../helpers/goalDataFormat";

export default ({ data = {}, onGotIt, metrics = {} }) => {
  const { goalId } = data;
  const smallCard = getSmallCardData(data, metrics);
  const { heading, successText } = smallCard;
  const cardStyle = { backgroundColor: " #52ab43" };
  const cardHeaderStyle = { paddingLeft: "6px", paddingTop: "10px" };
  const title = (
    <div className="title">
      <div className="ellipsis">{heading}</div>
    </div>
  );

  return (
    <Col className="dashboard-goal-card-container">
      <Card className="goal-card-style hide-m" style={cardStyle}>
        <CardHeader
          className="goal-card-header"
          style={cardHeaderStyle}
          title={title}
        />
        <div className="success flex row align-center">
          <div className="content flex col align-center margin-r-16">
            <div className="icon-box">
              <img alt="" src={SuccessIcon} />
            </div>
            <div className="goal-status">SUCCESS</div>
          </div>
          <div className="text">{successText}</div>
        </div>
        <div>
          <Button
            onClick={e => {
              e.preventDefault();
              onGotIt(goalId);
            }}
            className="goal-archive-btn bg-color-success"
          >
            GOT IT
          </Button>
        </div>
      </Card>
      <div className="only-m success-bg box">
        <div className="success-header">{title}</div>
        <div className="icon-box success">
          <img alt="" src={SuccessIcon} />
        </div>
        <div className="success-text">{successText}</div>
      </div>
    </Col>
  );
};
