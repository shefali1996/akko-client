import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, FormControl, Image } from 'react-bootstrap';
import swal from 'sweetalert2';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style'
import { testMode } from '../constants';
import * as dashboardActions from '../redux/dashboard/actions';
import shopifyIcon from '../assets/images/shopify.svg';
import akkologo from "../assets/images/transparent_blue.svg"
const queryString = require('query-string');

const swalert = () => {
  return swal({
    title:             'Success!',
    type:              'success',
    text:              'Connection is successful.',
    allowOutsideClick: false,
    focusConfirm:      false,
  });
};
class ConnectShopify extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      shopName:       '',
      pendingRequest: false
    };
    this.goLanding = this.goLanding.bind(this);
    this.onShopNameChange = this.onShopNameChange.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }
  
  goLanding() {
    this.props.history.push('/');
  }

  onShopNameChange(e) {
    this.setState({
      shopName: e.target.value
    });
  }

  onConnect() {    
    this.setState({pendingRequest: true})
    if (testMode) {
      swalert().then(() => {
        this.onConfirm();
      });
    } else {
      this.props.connectShopify({shopId: this.state.shopName}).then((result) => {        
        this.setState({pendingRequest: false});
      }).catch(() => {
        this.setState({pendingRequest: false});
      })
    }
  }

  onConfirm() {
    this.props.history.push('/fetch-status');
  }

  renderSuccessPage() {    
    this.props.updateShopify({
      shopId:      this.state.shop,
      queryParams: this.props.location.search
    }).then((result) => {
      swalert().then(() => {
        this.onConfirm();
      });
    });
  }

  render() {
    const { shopName } = this.state;
    const parsedParams = queryString.parse(this.props.location.search);    
    return (
      <div>
        {!Object.keys(parsedParams).length ?
          <Grid className="login-layout connect-shopify-container">
           
               <Image src={akkologo} className="akko-logo" />
            <div id="wrapper">
               <h1 className="main-heading first-section"> Creating your new </h1>
               <h1 className="main-heading">Akko account</h1>
               <p className="info">Let's connect your Shopify store first</p>
              <Image src={shopifyIcon} className="shopify-icon" />
            <div className="shopify-input-view">
              <FormControl
                type="text"
                autoFocus
                placeholder="shop name"
                className="signup-email-input"
                value={shopName}
                onChange={this.onShopNameChange}
              />
              <span className="shopify-url-text">
                .myshopify.com
              </span>
            </div>
            </div>
          
            <div className="text-center margin-t-25">
              <Button className="login-button" onClick={this.onConnect}>
                CONNECT
                <div style={{marginLeft: 10, display: this.state.pendingRequest ? 'inline-block' : 'none'}}>
                  <Spin size="small" />
                </div>
              </Button>
            </div>
          </Grid>
              :
              this.renderSuccessPage()
          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    connectShopifyAlert: state.dashboard.connectShopifyAlert
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectShopify: (body) => {
      return dispatch(dashboardActions.connectShopify(body));
    },
    updateShopify: (body) => {
      return dispatch(dashboardActions.updateShopify(body));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ConnectShopify);
