import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Switch } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import asyncComponent from './AsyncComponent';

import Main from './Main';
// import Landing from './Landing';
// import SignIn from './SignIn';
// import SignUp from './SignUp';
// import ConnectShopify from './ConnectShopify';
// import BusinessType from './BusinessType';
// import SetCogs from './SetCogs';
// import SetCsv from './SetCsv';
// import SetTable from './SetTable';
// import Settings from './Settings';
// import AuthorizedContainer from './AuthorizedContainer';
// import NotFound from './NotFound';
import store from '../redux/store';

const Landing = asyncComponent(() =>
    import('./Landing').then(module => module.default)
);
const SignIn = asyncComponent(() =>
    import('./SignIn').then(module => module.default)
);
const SignUp = asyncComponent(() =>
    import('./SignUp').then(module => module.default)
);
const ConnectShopify = asyncComponent(() =>
    import('./ConnectShopify').then(module => module.default)
);
const BusinessType = asyncComponent(() =>
    import('./BusinessType').then(module => module.default)
);
const SetCogs = asyncComponent(() =>
    import('./SetCogs').then(module => module.default)
);
const SetCsv = asyncComponent(() =>
    import('./SetCsv').then(module => module.default)
);
const SetTable = asyncComponent(() =>
    import('./SetTable').then(module => module.default)
);
const Settings = asyncComponent(() =>
    import('./Settings').then(module => module.default)
);
const AuthorizedContainer = asyncComponent(() =>
    import('./AuthorizedContainer').then(module => module.default)
);
const NotFound = asyncComponent(() =>
    import('./NotFound').then(module => module.default)
);

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
