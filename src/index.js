import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import './styles/index.css';
import App from './containers/App';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'font-awesome/css/font-awesome.min.css';
import 'sweetalert/dist/sweetalert.css';
import App from './containers/App';
import './styles/app.scss';

render(
  <AppContainer warnings={false}>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);
