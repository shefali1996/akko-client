import React from 'react';
import upArrow from '../assets/upArrow.svg';
import downArrow from '../assets/downArrow.svg';

class PriceBox extends React.Component {
  render() {
    const {title, currency, value, raisePercentage, period, raise} = this.props;
    return (
      <div>
        <div className="first-price">
          <div className="half-height">
            <span className="price-title">{title}</span>
          </div>
          <div className="half-height">
            <span className="price-value">{currency}{value}</span>
          </div>
        </div>
        <div className="second-price">
          <div>
            {raise ?
              <div className="align-center">
                <img src={upArrow} className="arrow-icon" alt="icon" />
                <span className="price-percent">{raisePercentage}%</span>
              </div>
              :
              <div className="align-center">
                <img src={downArrow} className="arrow-icon" alt="icon" />
                <span className="price-percent-down">{raisePercentage}%</span>
              </div>
            }
          </div>
          <div>
            <span className="price-period">{period}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PriceBox;