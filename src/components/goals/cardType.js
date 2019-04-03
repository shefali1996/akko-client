import React from 'react';
import {CARD_TYPE} from './constant';

const {ARCHIVED,FAILED,ACTIVE,SCHEDULED} = CARD_TYPE;

export default({ goalStatusText, percentage }) => {
  switch (goalStatusText) {
    case ARCHIVED:
      return (
        <div className="">
          <div className="t-a-center archieved percentage-text f21">{percentage}</div>
          <div className="card-type archieved">{goalStatusText}</div>
        </div>
      );

    case FAILED:
      return (
        <div className="">
          <div className="t-a-center failed percentage-text f21">{percentage}</div>
          <div className="card-type failed">{goalStatusText}</div>
        </div>
      );

    case ACTIVE:
      return (
        <div className="">
          <div className="t-a-center success percentage-text f21">{percentage}</div>
          <div className="card-type success">{goalStatusText}</div>
        </div>
      );

    case SCHEDULED:
      return (
        <div className="">
          <div className="t-a-center scheduled percentage-text f21">{percentage}</div>
          <div className="card-type scheduled">{goalStatusText}</div>
        </div>
      );
    default:
      return (
        <div className="">
          <div className="t-a-center percentage-text f21">{percentage}</div>
          <div className="card-type">{goalStatusText}</div>
        </div>
      );
  }
};