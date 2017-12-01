import React, { Component } from 'react';
import swal from 'sweetalert';
import { hasClass } from '../helpers/Csv';


export class Main extends Component {
  componentWillMount() {
    window.removeEventListener('popstate', this.handleSWAL);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handleSWAL);
  }

  handleSWAL() {
    const modal = document.querySelector('.sweet-alert');
    if (modal && hasClass(modal, 'showSweetAlert')) {
      swal.close();
    }
  }

  render() {
    return (
      <div className="main-container">
        {this.props.children}
      </div>
    );
  }
}

export default Main;
