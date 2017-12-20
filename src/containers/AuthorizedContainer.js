import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import Dashboard from './NewDashboard';
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
    return (
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AuthorizedContainer);
