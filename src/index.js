import React from "react";
import ReactDOM from "react-dom";
import App from './containers/App';
import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import 'sweetalert/dist/sweetalert.css';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
