import React from "react";
import ReactDOM from "react-dom";
import './styles/index.css';
import App from './containers/App';
import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter as Router } from "react-router-dom"; // \todo: required?
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
