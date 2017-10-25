import React, { Component } from 'react'

import '../styles/App.css';

export class Main extends Component {

	render(){
        return(
			<div>
				<div className="main-container">
					{this.props.children}
				</div>
			</div>
        );
    }
}

export default Main;
