import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Grid, Row,} from "react-bootstrap";
import isEmpty from "lodash/isEmpty";
import { Route, Switch } from "react-router";
import "antd/lib/input/style";
import "antd/lib/select/style";
import "antd/lib/checkbox/style";
import * as dashboardActions from "../redux/dashboard/actions";
import accountIcon from "../assets/images/Account.svg";
import companyIcon from "../assets/images/Company.svg";
import costOfGoodIcon from "../assets/images/CostOfGoods.svg";
import Company from "../components/settingComponent/Company";
import Account from "../components/settingComponent/Account";
import CostOfGoods from "../components/settingComponent/CostOfGoods";
import {userDataFormatter} from "../helpers/userDataFormatter"
import isEqual from "lodash/isEqual"

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ""
    };
  }
  componentWillReceiveProps(props) {    
    if (props.userData.data && props.userData.data.firstName && !isEqual(this.props.userData.data,props.userData.data)) {
      this.setState({ user: props.userData.data,...this.state.user });
    }
  }

  componentDidMount() {  
    document.title = "Settings | Akko";
    if (isEmpty(this.props.productCount.data)) {
      this.props.getCount();
    }
    if (this.props.userData.data && this.props.userData.data.firstName ) {
      this.setState({ user: this.props.userData.data,...this.state.user });
    }
   
  }

  goDashboard = () => {
    this.props.history.push("/dashboard");
  };

  onUpdateUser = () => {
    const userData=userDataFormatter(this.state.user)
    this.props.updateUser(userData)
  };

  tabClick = status => {
    this.setState({
      tabStatus: status
    });
    switch (status) {
      case 1:
        this.props.history.push("/settings/account");
        break;
      case 2:
        this.props.history.push("/settings/company");
        break;
      case 3:
        this.props.history.push("/settings/cogs");
        break;
    }
  };

  handleChange = (e, elementName) => {
    const name = e.target ? e.target.name : elementName;
    const value = e.target ? e.target.value : e;
    let userState = { ...this.state.user, [name]: value };    
    this.setState({
      user: userState
    });
  };
  render() {        
    const {
      location: { pathname },
      userData:{data}
    } = this.props;
    return (
      <div>
        <Grid className="login-layout">
          <Row className="setting-container">
            <div className="tab-container">
              <div
                className={
                  this.state.tabStatus === 1 || pathname === "/settings/account"
                    ? "tab-background"
                    : "tabs"
                }
                onClick={() => this.tabClick(1)}
              >
                <img src={accountIcon} />
                <div className="tab-text">ACCOUNT</div>
              </div>
              <div
                className={
                  this.state.tabStatus === 2 || pathname === "/settings/company"
                    ? "tab-background"
                    : "tabs"
                }
                onClick={() => this.tabClick(2)}
              >
                <img src={companyIcon} />
                <div className="tab-text">
                  COMPANY {}
                  <span
                    className={
                      data.userPlan === "PLUS"
                        ? "menu-plan-plus"
                        : data.userPlan === "LITE"
                        ? "menu-plan-lite"
                        : ""
                    }
                  >
                    {data.userPlan}
                  </span>{" "}
                </div>
              </div>
              <div
                className={
                  this.state.tabStatus === 3 ||
                  pathname === "/settings/cogs"
                    ? "tab-background"
                    : "tabs"
                }
                onClick={() => this.tabClick(3)}
              >
                <img src={costOfGoodIcon} />
                <div className="tab-text"> COST OF GOODS</div>
              </div>
            </div>
            <div className="setting-page-container">
              <Switch>
                <Route
                  path="/settings/account"
                  render={props => (
                    <Account
                      {...this.props}
                      user={this.state.user}
                      handleChange={this.handleChange}
                      onUpdateUser={this.onUpdateUser}
                    />
                  )}
                />
                <Route
                  path="/settings/company"
                  render={props => (
                    <Company
                      {...this.props}
                      user={this.state.user}
                      handleChange={this.handleChange}
                      onUpdateUser={this.onUpdateUser}
                    />
                  )}
                />
                <Route
                  path="/settings/cogs"
                  render={props => (
                    <CostOfGoods data={this.props.productCount} {...props} />
                  )}
                />
              </Switch>
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    productCount: state.dashboard.productCount,
    userData: state.dashboard.userData,
    timeZone: state.dashboard.timeZone.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCount: () => {
      return dispatch(dashboardActions.getCount());
    },
    getUser: () => {
      return dispatch(dashboardActions.getUser());
    },
    updateUser: (user) => {
      return dispatch(dashboardActions.updateUser(user));
    },
    getTimeZone: () => {
      return dispatch(dashboardActions.getTimeZone());
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Setting)
);
