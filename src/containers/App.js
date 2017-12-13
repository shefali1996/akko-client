import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Switch } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import Main from './Main';
import Landing from './Landing';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ConnectShopify from './ConnectShopify';
import BusinessType from './BusinessType';
import SetCogs from './SetCogs';
import SetCsv from './SetCsv';
import SetTable from './SetTable';
import Settings from './Settings';
import AuthorizedContainer from './AuthorizedContainer';
import store from '../redux/store';
import NotFound from './NotFound';

const history = createHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store} key="provider">
        <MuiThemeProvider>
          <LocaleProvider locale={enUS}>
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
                  <Route exact path="/settings" component={Settings} />
                  <Route path="/" name="Authorized Sections" component={AuthorizedContainer} />
                </Main>
                <Route path="*" component={NotFound} />
              </Switch>
            </Router>
          </LocaleProvider>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
