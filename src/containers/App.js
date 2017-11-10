import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
import Main from './Main';
import Landing from './Landing';
import createHistory from 'history/createBrowserHistory'
import store from '../store'
import NotFound from "./NotFound";
import '../styles/App.css';

const history = createHistory();

class App extends Component {
    render() {
        return (
            <Provider store={store} key="provider">
                <Router history={history}>
                    <Switch>
                        <Main>
                            <Route exact path="/" component={Landing} />
                        </Main>
                        <Route path="*" component={NotFound} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default App;
