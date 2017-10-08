import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { invokeApig } from '../libs/awsLib';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      products: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const results = await this.products();
      this.setState({ products: results });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  products() {
    return invokeApig({ path: "/inventory" });
  }

  renderProductsList(products) {
  return [{}].concat(products).map(
    (product, i) =>
      i !== 0
        ? <ListGroupItem
            key={product.productId}
            href={`/inventory/${product.productId}`}
            onClick={this.handleProductClick}
            header={product.productTitle.trim()/*.split("\n")[0]*/}
          >
            {"Last updated: " + product.lastUpdated}
          </ListGroupItem>
        : <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> No products found.
            </h4>
          </ListGroupItem>
  );
}

handleProductClick = event => {
  event.preventDefault();
  this.props.history.push(event.currentTarget.getAttribute("href"));
}

  renderLander() {
    return (
      <div className="lander">
      <h1>akko</h1>
      <p>Realtime inventory sync for multi-channel eCommerce</p>
      </div>
    );
  }

  renderInventory() {
    return (
      <div className="welcome">
      <PageHeader align="center">Welcome to Akko!</PageHeader>
      <ListGroup>
      {!this.state.isLoading && this.renderProductsList(this.state.products)}
      </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
      {this.props.isAuthenticated ? this.renderInventory() : this.renderLander()}
      </div>
    );
  }
}
