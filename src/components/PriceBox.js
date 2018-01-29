import React from 'react';
import { numberFormatter } from '../constants';
import upArrow from '../assets/images/upArrow.svg';
import downArrow from '../assets/images/downArrow.svg';

class PriceBox extends React.Component {
  render() {
    const {analyze, customer} = this.props;
    let {title, description, prefix, postfix, value, trend_value, trend_period, trend} = this.props.value;
    let infix = '';
    if (prefix === '$') {
      infix = numberFormatter(Math.round(value * 100) / 100);
    } else {
      infix = value;
    }
    if (trend_value === 'invalid') {
      trend_value = '';
    } else if (trend_value !== null) {
      const i = trend_value[trend_value.length - 1];
      const tmp = trend_value.slice(0, trend_value.length - 1);
      trend_value = Math.round(parseInt(tmp)) + i;
    }
    if (infix === 'invalid') {
      prefix = '';
      infix = '';
      postfix = '';
    }
    const tmpVal = parseFloat(infix);
    if (!isNaN(tmpVal) && postfix !== 'days') {
      infix = tmpVal.toFixed(2);
    }
    if (customer) {
      return (
        <div className="price-view">
          <div className="first-price first-price-customer">
            <div className="half-height">
              <span className="price-title">{title}</span>
            </div>
            <div className="half-height margin-t-10">
              <span className="price-description">{description}</span>
            </div>
          </div>
          <div className="second-price pull-right">
            <span className="price-value" style={analyze ? {fontSize: '30px'} : {}}>{prefix}{infix}{postfix}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="price-view">
        <div className="first-price">
          <div className="half-height">
            <span className="price-title">{title}</span>
          </div>
          <div className="half-height margin-t-10">
            <span className="price-description">{description}</span>
          </div>
        </div>
        <div className="second-price">
          <span className="price-value" style={analyze ? {fontSize: '30px'} : {}}>{prefix}{infix}{postfix}</span>
        </div>
        <div className="third-price">
          <div>
            {(() => {
						if (trend === '+') {
						return (
  <div className="align-center">
    <img src={upArrow} className="arrow-icon" alt="icon" />
    <span className="price-percent">{trend_value}</span>
  </div>);
						} else if (trend === '-') {
						return (
  <div className="align-center">
    <img src={downArrow} className="arrow-icon" alt="icon" />
    <span className="price-percent-down">{trend_value}</span>
  </div>);
						} else {
						return (
  <div className="align-center">
    <span className="price-percent-neutral">{trend_value}</span>
  </div>);
						}
			})()}
          </div>
          <div>
            <span className="price-period">{trend_period}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PriceBox;
