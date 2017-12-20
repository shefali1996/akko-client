import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import Dashboard from './Dashboard';
import Inventory from './Inventory';
import CustomerInsights from './CustomerInsights';
import FinancialInsights from './FinancialInsights';
import NewDashboard from './NewDashboard';
import user from '../auth/user';

class AuthorizedContainer extends Component {
  componentWillMount() {
    if (user.isAuthenticated === null) {
      this.props.history.push('/');
    }
    this.props.history.push('/');
    // this.props.history.push('/financial_insights');
    // this.props.history.push('/dashboard');
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    // <Route exact path="/financial_insights" component={FinancialInsights} />
    // <Route exact path="/customer_insights" component={CustomerInsights} />
    return (
      <Switch>
        <Route exact path="/dashboard" component={NewDashboard} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AuthorizedContainer);
