import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'sweetalert/dist/sweetalert.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/app.scss';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
