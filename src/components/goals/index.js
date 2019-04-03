import React, { Component } from "react";
import { Row, Col, Grid } from "react-bootstrap";
import { Spin } from "antd";
import { isEmpty } from "lodash";
import GoalListItem from "./goalListItem";
import GoalModal from "../../containers/editGoalModal";

class Goals extends Component {
  componentDidMount() {
    const { getAllGoals } = this.props;
    this.props.getUser();
    this.props.getChannel().then(res => {
      getAllGoals();
    });
    this.props.getMetrics().then(res => {
      const { metrics = [] } = res;
      metrics.map(k => {
        this.props.getMetricsDataByName(k.db_name).then(res => {});
      });
      this.props.getProducts().then(products => {
        this.props.getVariants(products);
      });
    });
  }

  prepareGoalList() {
    const {
      goalList,
      data,
      isLoading,
      isSuccess,
      isError,
      openEditGoal,
      metricsData: { data: { metrics: metricList = [] } = {} } = {}
    } = this.props;
    let listToShow = [];
    let metrics = {};
    metricList.forEach((value, index) => {
      metrics[value.db_name] = value;
    });

    goalList.forEach(item => {
      const goalsData = data[item];
      if (!isEmpty(goalsData)) {
        listToShow.push(
          <Col key={item}>
            <GoalListItem
              data={goalsData}
              metrics={metrics}
              handler={() => {
                openEditGoal({ type: "DELETE", id: item });
              }}
            />
          </Col>
        );
      }
    });
    return listToShow;
  }

  afterDelete = () => {
    console.log("goal deleted");
  };

  render() {
    const { isLoading, isSuccess } = this.props;
    const listToShow =
      isLoading === false && isSuccess ? (
        this.prepareGoalList()
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Spin size="large" />
        </div>
      );

    return (
      <Grid className="page-container">
        {this.props.showGoalModal && (
          <GoalModal afterDelete={this.afterDelete} />
        )}
        <Row className="goal-list">{listToShow}</Row>
      </Grid>
    );
  }
}

export default Goals;
