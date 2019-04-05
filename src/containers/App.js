import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Switch } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LocaleProvider from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale-provider/en_US';
import asyncComponent from './AsyncComponent';
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import {routeConstants} from '../constants';
import Main from './Main';
import store from '../redux/store';

const AuthorizedContainer = asyncComponent(() =>
    import('./AuthorizedContainer').then(module => module.default)
);
const NotFound = asyncComponent(() =>
    import('./NotFound').then(module => module.default)
);
const ForgotPassword = asyncComponent(() =>
    import('./ForgotPassword').then(module => module.default)
);

const history = createHistory();

class App extends Component {
  render() {    
    return (
      <Provider store={store} key="provider">
        <MuiThemeProvider>
          <LocaleProvider locale={enUS}>
            <Router history={history}>
              <Main>
                <Switch>
                  <Route exact path={routeConstants.signin} component={SignIn} />
                   <Route exact path={routeConstants.signup} component={SignUp} />
                 <Route exact path={routeConstants.forgotPassword} component={ForgotPassword} />
                  <Route path={routeConstants.landing} name="Authorized Sections" component={AuthorizedContainer} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </Main>
            </Router>
          </LocaleProvider>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
