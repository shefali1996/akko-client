import React, { Component } from "react";
import { Button, FormControl } from "react-bootstrap";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style";
import style from '../../styles/global/variables.scss'

export default class Company extends Component {
  onHandleChange=(e,name)=>{
    this.props.handleChange(e,name)
  }
  handleUpdate=()=>{
    this.props.onUpdateUser()
  }
  render() {
    const { user ,userData} = this.props;
    return (
      <div className="company-container">
        <div className="label-section">Company</div>
        <div>
          <FormControl
            type="text"
            className="company field"
            value={user.company}
            onChange={(e)=>{this.onHandleChange(e)}}
            placeholder="Company Name"
            name="company"
          />
        </div>
        <div className="label-section">Website</div>
        <div>
          <FormControl
            type="text"
            className="website field"
            value={user.company_website}
            onChange={(e)=>{this.onHandleChange(e)}}
            placeholder="www.your_website.com"
            name="company_website"
          />
        </div>
        <div className="label-section">Location</div>
        <div className="address-section">
          <FormControl
            type="text"
            className="country address"
            value={user.loc_country}
            onChange={(e)=>{this.onHandleChange(e)}}
            placeholder="Country"
            name="loc_country"
          />
          <FormControl
            type="text"
            className="state address"
            value={user.loc_state}
            onChange={(e)=>{this.onHandleChange(e)}}
            placeholder="State"
            name="loc_state"
          />
          <FormControl
            type="text"
            className="city address"
            value={user.loc_city}
            onChange={(e)=>{this.onHandleChange(e)}}
            placeholder="City"
            name="loc_city"
          />
        </div>
        <div className="label-section plan">Plan</div>
        <div className="plan-section">
        <div className="plan-div" >
          <div className="current-plan">{ user.userPlan && user.userPlan == 'LITE' && `YOUR CURRENT PLAN`}</div>
          <div className={"lite-section"} style={{border:`${user.userPlan &&  user.userPlan=='LITE'?`2px solid ${`${style['mainBlueColor']}`}`:""}`}}>
            <span>LITE</span>
            {
                user.userPlan&& user.userPlan !== 'LITE' &&
              <Button
                className="downgrade-button"
                onClick={ (e)=>{this.onHandleChange('LITE','userPlan')}}
                >
                DOWNGRADE
              </Button>
            }

          </div>
          </div>

          <div className="plan-div">
          <div className="current-plan"> {user.userPlan &&  user.userPlan == 'PLUS' && `YOUR CURRENT PLAN`} </div>
          <div className="plus-section" style={{border:`${user.userPlan &&  user.userPlan=='PLUS'?`2px solid ${`${style['mainBlueColor']}`}`:""}`}}>
            <span>PLUS</span>
            {
               user.userPlan && user.userPlan !== 'PLUS' &&
              <div>
                <div id="trial">FREE TRIAL ENDS IN 23 DAYS</div>
                <Button
                className="upgrade-button"
                onClick={ (e)=>{this.onHandleChange('PLUS','userPlan')}}
                >
                  UPGRADE
                </Button>
              </div>
          }
          </div>
        </div>
        </div>
        <div className="label-section"></div>
        <Button className="save-button pull-left" onClick={()=>{this.handleUpdate()}}>
          SAVE {userData.isLoading && <Spin />}
        </Button>
      </div>
    );
  }
}
