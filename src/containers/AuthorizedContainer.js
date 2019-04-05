import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import Dashboard from './Dashboard';
import SetCogs from './SetCogs';
import Settings from './Settings';
import ConnectShopify from './ConnectShopify';
import FetchStatus from './FetchStatus'
import user from '../auth/user';
import Explore from './Explore/Explore'
import {routeConstants} from '../constants';;
import Goals from './Goals';
import AddGoals from './AddGoalPage'
import Navigationbar from '../components/Navigationbar';

class AuthorizedContainer extends Component {
  componentWillMount() {
    if (user.isAuthenticated === null) {    
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
   const {pathname}=this.props.location   
    return (
      <div>{ (pathname !="/set-cogs" && pathname!="/connect-shopify" && pathname !== routeConstants.addGoals) && <Navigationbar/>} 
      <Switch>
        <Route exact path={routeConstants.dashboard} component={Dashboard} />
        <Route exact path={routeConstants.setCogs} component={SetCogs} />
        <Route  path={routeConstants.settings} component={Settings} />
        <Route exact path={routeConstants.fetchStatus} component={FetchStatus} />
        <Route exact path={routeConstants.connectShopify} component={ConnectShopify} />
        <Route exact path={routeConstants.goals} component={Goals}/>
        <Route exact path={routeConstants.addGoals} component={AddGoals}/>
        <Route path={routeConstants.explore} component={Explore}/>
      </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AuthorizedContainer);
