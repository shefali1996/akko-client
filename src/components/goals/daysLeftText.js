import React from 'react';
import {CARD_TYPE} from './constant';

const {SUCCESS,ACTIVE,ONGOING,SCHEDULED,FAILED} = CARD_TYPE;

export default ({ status, daysLeftText, goalCompleteDate }) => {
  switch (status) {
    case SUCCESS:
      return (
        <div className="end-on">
          <div className="title">GOAL MET ON</div>
          <div className="detail">{goalCompleteDate}</div>
        </div>
      );

    case ACTIVE:
    case ONGOING:
    case SCHEDULED:
      return (
        <div className="day-left flex align-center">
          <div className="detail">{daysLeftText}</div>
        </div>
      );

    case FAILED:
      return (
        <div className="day-left flex align-center">
          <div className="detail failed">{daysLeftText}</div>
        </div>
      );

    default:
      return null;
  }
};