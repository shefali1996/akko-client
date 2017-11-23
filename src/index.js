import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'sweetalert/dist/sweetalert.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/App.css';
// import './styles/app.scss';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
