import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'react-select/scss/default.scss';
import 'sweetalert/dev/sweetalert.scss';
import App from './containers/App';
import './styles/app.scss';

render(
  <AppContainer warnings={false}>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);
