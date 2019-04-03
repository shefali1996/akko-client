import React from "react";
import { Card, CardText } from "material-ui/Card";
import { Col } from "react-bootstrap";
import addGoal from "../../../assets/images/addGoal.svg";

export default ({
  openAddGoal
}) => {
  return (
    <Col className="dashboard-goal-card-container">
      <Card onClick={e => {
            e.preventDefault();
            openAddGoal({ type: "ADD" });
          }} className="goal-card-style add-new-goal flex align-center">
        <div
          
          className="flex justify-content-center"
        >
          <img alt="" src={addGoal} />
          <div>ADD NEW GOAL</div>
        </div>
        <CardText style={{ padding: "0px" }} />
      </Card>
    </Col>
  );
};
