import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import PriceBox from '../components/PriceBox';
import statistics from '../assets/statistics.png';

class PriceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };
  
  render() {
    const {value} = this.props;
    return (
      <div>
        <Card 
          expanded={this.state.expanded} 
          onExpandChange={this.handleExpandChange}
          className={value.trend === '+' ? "price-card-style" : "price-card-style-border"}
        >
          <CardHeader
            actAsExpander={true}
            showExpandableButton={true}
            className="card-header-style"
          >
            <PriceBox value={value} />
          </CardHeader>
          <CardText expandable>
            <img src={statistics} className="statistics-icon" alt="statistics"/>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default PriceCard;
