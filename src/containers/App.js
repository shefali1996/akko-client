import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Switch } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Main from './Main';
import Landing from './Landing';
<<<<<<< HEAD
import SignIn from './SignIn';
import SignUp from './SignUp';
import ConnectShopify from './ConnectShopify';
import BusinessType from './BusinessType';
import SetCogs from './SetCogs';
import SetCsv from './SetCsv';
import SetTable from './SetTable';
import AuthorizedContainer from './AuthorizedContainer';
import store from '../store';
import NotFound from './NotFound';
import '../styles/App.css';
=======
import store from '../store';
import NotFound from './NotFound';
>>>>>>> landingpage

const history = createHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store} key="provider">
<<<<<<< HEAD
        <MuiThemeProvider>
          <Router history={history}>
            <Switch>
              <Main>
                <Route exact path="/" component={Landing} />
                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/connect-shopify" component={ConnectShopify} />
                <Route exact path="/business-type" component={BusinessType} />
                <Route exact path="/set-cogs" component={SetCogs} />
                <Route exact path="/set-csv" component={SetCsv} />
                <Route exact path="/set-table" component={SetTable} />
                <Route path="/" name="Authorized Sections" component={AuthorizedContainer} />
              </Main>
              <Route path="*" component={NotFound} />
            </Switch>
          </Router>
        </MuiThemeProvider>
=======
        <Router history={history}>
          <Switch>
            <Main>
              <Route exact path="/" component={Landing} />
            </Main>
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
>>>>>>> landingpage
      </Provider>
    );
  }
}

export default App;
