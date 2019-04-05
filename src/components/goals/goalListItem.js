import React, { Component } from "react";
import { Row, div, ProgressBar } from "react-bootstrap";
import { Progress } from "antd";
import success from "../../assets/images/success.svg";
import failed from "../../assets/images/goal-failed.svg";
import deleteIcon from "../../assets/images/delete.svg";
import { getLongCardData } from "../../helpers/goalDataFormat";
import DaysLeftText from "./daysLeftText";
import CardType from "./cardType";
import { CARD_TYPE } from "./constant";

const { ACTIVE, SUCCESS, FAILED, SCHEDULED } = CARD_TYPE;

class GoalListItem extends Component {
  BasicDetail = () => {};

  progressText = percent => {
    return <div className="progress-text">{percent}</div>;
  };

  _onDeleteHandler = () => {
    this.props.onDelete();
  }

  render() {
    const {
      data: { status, endDate, startDate },
      handler,
      metrics = {}
    } = this.props;

    const { data } = this.props;
    const longCard = getLongCardData(data, metrics);
    const {
      metricTag,
      heading,
      subheading,
      goal,
      current,
      deadline,
      startedOn,
      daysLeftText = "",
      goalCompleteDate,
      goalStatusText,
      cardType,
      percentage = 0,
      timePercentage = 0
    } = longCard;
    let currentPercent = parseInt(percentage) || 0;

    let goalPercent = 100;

    if (currentPercent > 100) {
      goalPercent = (goalPercent * 100) / currentPercent;
      goalPercent = goalPercent - 10;
      currentPercent = 100;
    }
    const timeBar = parseInt(timePercentage);

    const clickable =
      goalStatusText === ACTIVE || goalStatusText === SCHEDULED
        ? "clickable"
        : "";
    const clickTrue =
      goalStatusText === ACTIVE || goalStatusText === SCHEDULED ? true : false;

    return (
      <div
        className="goal-list-box-item flex clickable"
        onClick={e => {
          e.preventDefault();
          handler();
        }}
      >
        <div className="goal-list-item-basic-detail no-padding flex-shrink-0 flex col justify-flex-start align-flex-start">
          <div className="metric-tag">{metricTag}</div>
          <div className="heading full-width">{heading}</div>
          <div className="sub-heading">{subheading}</div>
          {clickable && <div className="delete_button" onClick={this._onDeleteHandler}>
            <img alt="" src={deleteIcon} />
          </div>}
        </div>
        <div className="goal-list-item-progess-detail no-padding  flex-grow-1">
          <div className="total-goal flex justify-content-space-between">
            <div className="flex-grow-1">
              <div className="progress-box flex-grow-1 flex">
                <div className="goal-title">GOAL</div>
                <div className="target flex-grow-1">
                  <div className="flex">
                    <div
                      className="bar hide-m margin-r8"
                      style={{ width: `${goalPercent}%` }}
                    />
                    <div className="goal">{goal}</div>
                  </div>
                </div>
              </div>

              <div className="progress-box flex-grow-1 flex margin-b15">
                <div className="goal-title">CURRENT</div>
                <div className="current flex-grow-1">
                  <div className="flex">
                    <div
                      className="bar hide-m margin-r8"
                      style={{ width: `${currentPercent}%` }}
                    />
                    <div className="goal">{current}</div>
                  </div>
                </div>
              </div>
            </div>
            <CardType
              goalStatusText={goalStatusText}
              percentage={`${percentage}%`}
            />
          </div>

          <div className="trace">
            <div className="flex justify-content-space-between">
              <div className="start-on hide-m">
                <div className="title">STARTED ON</div>
                <div className="detail">{startedOn}</div>
              </div>
              <DaysLeftText
                status={status}
                daysLeftText={daysLeftText}
                goalCompleteDate={goalCompleteDate}
              />

              <div className="end-on">
                <div className="title">DEADLINE</div>
                <div className="detail">{deadline}</div>
              </div>
            </div>
            <ProgressBar now={timeBar} />
          </div>
        </div>
        <div className="goal-list-item-progress-box padding-20 flex align-center">
          {status !== FAILED && status !== SUCCESS && (
            <Progress
              className="box"
              type="circle"
              percent={parseInt(percentage) || 0}
              width={90}
              strokeWidth={3}
              format={percentage => this.progressText(`${percentage}%`)}
            />
          )}
          {status === FAILED && (
            <div className="box failed">
              <img alt="" className="icon" src={failed} />
            </div>
          )}
          {status === SUCCESS && (
            <div className="box success">
              <img alt="" className="icon" src={success} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default GoalListItem;
