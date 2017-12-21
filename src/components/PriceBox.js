import React from 'react';
import { numberFormatter } from '../constants';
import upArrow from '../assets/images/upArrow.svg';
import downArrow from '../assets/images/downArrow.svg';

class PriceBox extends React.Component {
  render() {
    const {analyze, customer} = this.props;
    console.log('qqqqqqqqqqqqqqqqqqqq', this.props);
    let {title, description, prefix, postfix, value, trend_value, trend_period, trend} = this.props.value;
    let infix = '';
    if (prefix === '$') {
      infix = numberFormatter(Math.round(value * 100) / 100);
    } else {
      infix = value;
    }
    if (trend_value === 'invalid') {
      trend_value = '';
    } else {
      trend_value = Math.round(value);
    }
    if (infix === 'invalid') {
      prefix = '';
      infix = '';
      postfix = '';
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
            {trend === '+' ?
              <div className="align-center">
                <img src={upArrow} className="arrow-icon" alt="icon" />
                <span className="price-percent">{trend_value}</span>
              </div>
              :
              <div className="align-center">
                <img src={downArrow} className="arrow-icon" alt="icon" />
                <span className="price-percent-down">{trend_value}</span>
              </div>
            }
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
