import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Progress from 'antd/lib/progress';
import 'antd/lib/progress/style'
import isEmpty from "lodash/isEmpty"
import Navigationbar from './Navigationbar';

class FetchStatus extends Component {
  constructor(props) {
    super(props);
  }
  goToSetCogs = () => {
    this.props.history.push('/set-cogs');
  }
  progressText = (percent) => {
    const status = this.props.dataLoadStatus.data;
    let estimatedTimeLeft = '';
    let pageFetching = '';
    if (status.estimated_time_left && !isEmpty(status.estimated_time_left)) {
      estimatedTimeLeft = <div className="sub-title-bold margin-t-10">about {status.estimated_time_left} left</div>;
    }

    if (status.num_products && status.num_products_pages_fetched < status.num_products_pages) {
      pageFetching = <div className="sub-title margin-t-10">Fetching {status.num_products} products..</div>;
    } else if (status.num_customers && status.num_customers_pages_fetched < status.num_customers_pages) {
      pageFetching = <div className="sub-title margin-t-10">Fetching {status.num_customers} customers..</div>;
    } else if (status.num_orders && status.num_orders_pages_fetched < status.num_orders_pages) {
      pageFetching = <div className="sub-title margin-t-10">Fetching {status.num_orders} orders..</div>;
    } else if (status.num_total_pages && status.num_total_pages_fetched === status.num_total_pages) {
      pageFetching = <div className="sub-title margin-t-10">All data fetched</div>;
    }
    return (<div className="progress-text">
      <div className="title">{percent}%</div>
      {estimatedTimeLeft}
      {pageFetching}
    </div>);
  }
  displaySetCogs = () => {
    const status = this.props.dataLoadStatus.data;
    let displayCogsButton = false;
    let cogsStyle = {};
    let cogsText = '';

    if (status.num_orders && status.num_orders_pages_fetched === status.num_orders_pages) {
      displayCogsButton = true;
      cogsStyle = {margin: '0px auto', width: '400px'};
      cogsText = 'We have fetched all your Shopify data. Please set cogs for your products so we can calculate your profits and margins.';
    } else if (status.num_products && status.num_products_pages_fetched === status.num_products_pages) {
      displayCogsButton = true;
      cogsStyle = {margin: '0px auto', width: '512px'};
      cogsText = 'We have fetched all your product listings from Shopify. You can go ahead and set COGS for the products while we fetch your orders. We will use these COGS estimates to calculate your profits and margins.';
    }
    if (displayCogsButton) {
      return (<div>
        <div className="text-center margin-t-60">
          <div className="sub-title-text" style={cogsStyle}>{cogsText}</div>
        </div>
        <div className="text-center margin-t-20">
          <Button className="set-cogs-loading-btn" onClick={this.goToSetCogs}>SET COGS</Button>
        </div>
      </div>);
    }
    return '';
  }
  render() {
    const status = this.props.dataLoadStatus.data;
    const percent = isNaN(this.props.percent) ? 0 : this.props.percent;
    return (
      <div>
        <Navigationbar history={this.props.history} companyName={this.props.userData.data.company} />
        <Grid className="login-layout fetch-status">
          <Row>
            <Col md={6} mdOffset={3}>
              <div className="text-center margin-t-60">
                <div className="title-text">Fetching your data from Shopify</div>
              </div>
              <div className="text-center margin-t-5">
                <div className="sub-title-text">Closing the app or logging out will not affect the fetch. Feel free to go about your</div>
                <div className="sub-title-text">business while we fetch your data and calculate your performance metrics.</div>
              </div>
              <div className="flex-center margin-t-60">
                <span className="select-style-comment">
                  <Progress type="circle" percent={percent} width={300} strokeWidth={2} format={percent => this.progressText(percent)} />
                </span>
              </div>
              {this.displaySetCogs()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default FetchStatus;
