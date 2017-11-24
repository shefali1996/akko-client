import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import PriceBox from '../components/PriceBox';
import SalesChart from '../components/SalesChart';
import openUp from '../assets/images/openUpIcon.svg';
import openDown from '../assets/images/openDownIcon.svg';

class PriceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.onCloseCard = this.onCloseCard.bind(this);
  }

  handleExpandChange(expanded) {
    this.setState({expanded});
  }

  onCloseCard() {
    this.setState({expanded: false});
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
                <SalesChart />
                <button className="analyze-button">
                  ANALYZE
                </button>
              </div>
              <div className="flex-right">
                <IconButton className="expand-close-icon" onClick={this.onCloseCard}>
                  <img src={openUp} alt="down" className="close-icon" />
                </IconButton>
              </div>
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default PriceCard;
