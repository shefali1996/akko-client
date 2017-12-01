import React from 'react';
import { Row, Col } from 'react-bootstrap';
import tipIcon from '../assets/images/tip_icon.svg';

class TipBox extends React.Component {
  render() {
    return(
      <div className="description-view margin-t-40 text-center">
        <Row>
        	<Col md={1}>
        		<img src={tipIcon} className="tip-icon" alt="icon" />
          </Col>
          <Col md={10}>
  	         <span className="select-style-comment tipbox-text">
  	          <b><u>Tip:</u></b> COGS is the cost of buying one unit of the product from your vendor.
  	        </span>
          </Col>
        </Row>
      </div>
    )
  }
}

export default TipBox;
