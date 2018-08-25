import React from 'react';
import { Row, Col } from 'react-bootstrap';
import tipIcon from '../assets/images/tip_icon.svg';


class TipBox extends React.Component {
  render() {
    return (
      <div className="description-view margin-t-40 text-center" style={this.props.style}>
        <Row>
          <Col xs={1}>
            <img src={tipIcon} className="tip-icon" alt="icon" />
          </Col>
          <Col xs={10}>
            <span className="select-style-comment tipbox-text">
              <b><u>Tip:</u></b> {this.props.message}
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TipBox;

export const tipBoxMsg = {
  dropshipper: 'COGS is the cost of buying one unit of the product from your vendor.',
  reseller:    'COGS is the cost of buying one unit of the product from your vendor.',
  manufacture: 'COGS is the cost of raw materials + cost of manufacturing and warehousing one unit of the product',
  cogsValue:   'COGS is the cost of buying one unit of the product from your vendor',
  default:     'COGS is the cost of buying one unit of the product from your vendor.'
};
