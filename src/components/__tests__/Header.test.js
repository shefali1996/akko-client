import React from 'react';
import ReactDOM from 'react-dom';
import { Row } from 'react-bootstrap';
import Header from '../Header';

it('renders without crashing', () => {
  ReactDOM.render(<Header />, Row);
});
