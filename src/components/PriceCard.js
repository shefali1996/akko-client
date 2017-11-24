import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import PriceBox from '../components/PriceBox';
import statistics from '../assets/images/statistics.png';
import openUp from '../assets/images/openUpIcon.svg';
import openDown from '../assets/images/openDownIcon.svg';

class PriceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleExpandChange = this.handleExpandChange.bind(this);
  }

  handleExpandChange(expanded) {
    this.setState({expanded});
  }

  render() {
    const {value} = this.props;
    return (
      <div>
        <Card
          expanded={this.state.expanded}
          onExpandChange={this.handleExpandChange}
          className={value.trend === '+' ? 'price-card-style' : 'price-card-style-border'}
        >
          <CardHeader
            actAsExpander
            showExpandableButton
            openIcon={<img src={openUp} alt="up" className="open-icon" />}
            closeIcon={<img src={openDown} alt="down" className="close-icon" />}
            className="card-header-style"
          >
            <PriceBox value={value} />
          </CardHeader>
          <CardText
            expandable
            className="expand-content"
          >
            <div>
              <div>
                <img src={statistics} className="statistics-icon" alt="statistics" />
                <button className="analyze-button">
                  ANALYZE
                </button>
              </div>
              <div className="flex-right">
                <div className="expand-close-icon">
                  <img src={openDown} alt="down" className="close-icon" />
                </div>
              </div>
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default PriceCard;
