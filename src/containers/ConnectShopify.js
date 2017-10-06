import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ConnectShopify.css";
const queryString = require('query-string');
import { invokeApig } from "../libs/awsLib";

class ConnectShopify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      shop: "",
      authToken: null
    };
  }

  validateForm() {
    return (
      this.state.shop.length > 0
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const results = await invokeApig({
        path: "/connect-shopify",
        method: "POST",
        body: {
          shopId: this.state.shop
        }
      });

      const uri = results.uri;
      alert("Url: " + uri);
      window.location = uri;
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  renderSuccessPage() {
    try{
      alert("QueryParams: " + this.props.location.search);
      // const results = invokeApig({
      // path: "/connect-shopify",
      // method: "PUT",
      // body: {
      //   shopId: this.state.shop,
      //   queryParams: this.props.location.search
      // }});
      //
      // console.log("results: " + results);
    }catch(e){
      alert(e);
    }

    // if(parsedParams.state !== this.props.shopifyNonce)
    // {
    //   alert("Parsed Nonce : " + parsedParams.state);
    //   alert("Saved Nonce : " + this.props.shopifyNonce);
    //   return(
    //     <div className="ConnectionSuccess">
    //       <h3> Nonce Check Failed!</h3>
    //     </div>
    //   );
    // }
    // if(!shopifyToken.verifyHmac(parsedParams))
    // {
    //   return(
    //     <div className="ConnectionSuccess">
    //       <h3> HMAC Verification Failed!</h3>
    //     </div>
    //   );
    // }
    // const token = shopifyToken.getAccessToken(parsedParams.shop, parsedParams.code);
    // return (
    //   <div className="ConnectionSuccess">
    //     <h3> Connection Successful!</h3>
    //     <h2> Token : {token} </h2>
    //   </div>
    // );
  }

renderForm() {
  return (
    <form onSubmit={this.handleSubmit}>
    <FormGroup controlId="shop" bsSize="large">
    <ControlLabel>Shop Name</ControlLabel>
    <FormControl
    autoFocus
    type="string"
    value={this.state.shop}
    onChange={this.handleChange}
    />
    </FormGroup>
    <LoaderButton
    block
    bsSize="large"
    disabled={!this.validateForm()}
    type="submit"
    isLoading={this.state.isLoading}
    text="Authenticate"
    loadingText="Authenticating…"
    />
    </form>
  );
}

render() {
  const parsedParams = queryString.parse(this.props.location.search);
  return (
    <div className="ConnectShopify">
    {!Object.keys(parsedParams).length
      ? this.renderForm()
      : this.renderSuccessPage()}
      </div>
    );
  }
}

export default withRouter(ConnectShopify);
