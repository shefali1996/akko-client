import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'font-awesome/css/font-awesome.min.css';
import 'sweetalert/dist/sweetalert.css';
import App from './containers/App';
import './styles/app.scss';

console.log('aaa');
render(
  <AppContainer warnings={false}>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);
