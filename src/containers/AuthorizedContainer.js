import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import Channels from './Channels';
import Inventory from './Inventory';
import Orders from './Orders';
import user from '../auth/user';

class AuthorizedContainer extends Component {
    componentWillMount() {
        if(!user.isAuthenticated) {
            this.props.history.push(`/login`);
            return
        }
    }

    componentWillReceiveProps (nextProps) {
        // if (nextProps.profile.error && nextProps.profile.error.message === 'Unauthorized') {
        //     user.logout();
        //     this.props.history.push(`/signin`);
        // }
    }

    render () {
        return (
            <Switch>
                <Route exact path="/channels" component={Channels}/>
                <Route exact path="/inventory" component={Inventory}/>
                <Route exact path="/orders" component={Orders}/>
            </Switch>
        )
    }
};

const mapStateToProps = (state) => ({
    // profile: state.user,
    // dataset: state.dataset
})

export default connect(mapStateToProps)(AuthorizedContainer);
