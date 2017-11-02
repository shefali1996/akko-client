import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
import Main from './Main';
import Landing from './Landing';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ConnectShopify from './ConnectShopify';
import AuthorizedContainer from './AuthorizedContainer'
import createHistory from 'history/createBrowserHistory'
import configureStore from '../store'
import NotFound from "./NotFound";
import '../styles/App.css';

const store = configureStore();
const history = createHistory();

class App extends Component {
    render() {
        return (
            <Provider store={store} key="provider">
                <Router history={history}>
                    <Switch>
                        <Main>
                            <Route exact path="/" component={Landing}/>
                            <Route exact path="/signin" component={SignIn}/>
                            <Route exact path="/signup" component={SignUp}/>
                            <Route exact path="/connect-shopify" component={ConnectShopify}/>
                            <Route path="/" name="Authorized Sections" component={AuthorizedContainer} />
                        </Main>
                        <Route path="*" component={NotFound} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default App;
