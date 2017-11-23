import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'sweetalert/dist/sweetalert.css';
import App from './containers/App';
import './styles/app.scss';
// import './styles/App.css';

render(
  <AppContainer warnings={false}>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);
