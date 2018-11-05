import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import MetricExplore from '../../containers/Explore/MetricExplore';
import {routeExplore} from '../../constants';

class Explore extends Component {

    render() {
      return (
        <Switch>
          <Route exact path={this.props.match.path + routeExplore.total_sales} component={MetricExplore}/>
          <Route exact path={this.props.match.path + routeExplore.avg_margin} component={MetricExplore}/>
          <Route exact path={this.props.match.path + routeExplore.gross_profit} component={MetricExplore}/>
          <Route exact path={this.props.match.path + routeExplore.number_of_orders} component={MetricExplore}/>
          <Route exact path={this.props.match.path + routeExplore.avg_order_value} component={MetricExplore}/>
        </Switch>
      );
    }
  }

  export default Explore;
