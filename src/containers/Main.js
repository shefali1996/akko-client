import React, { Component } from 'react';

import '../styles/App.css';

export class Main extends Component {

  render() {
    return (
      <div className="main-container">
        {this.props.children}
      </div>
    );
  }
}

export default Main;
