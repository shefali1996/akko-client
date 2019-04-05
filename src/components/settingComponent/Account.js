import React, { Component } from "react";
import Select from "antd/lib/select";
import "antd/lib/select/style";
import Input from "antd/lib/input";
import "antd/lib/input/style";
import { Button, FormControl } from "react-bootstrap";
import downArrow from "../../assets/images/solidDownArrow.svg";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style";
import timeZone from"./timeZone"
export default class Account extends Component {
  onHandleChange=(e,name)=>{
    this.props.handleChange(e,name)
  }
  handleUpdate=()=>{
    this.props.onUpdateUser()
  }
  render() {
    const { user,userData} = this.props;        
    return (
      <div className="account-container">
        <div className="label-section">Your Name</div>
        <div>
          <FormControl
            type="text"
            className="your-name field"
            value={user.user_name}
            onChange={(e)=>{this.onHandleChange(e)}}
            placeholder="your name"
            name="user_name"
          />
        </div>
        <div className="label-section">Time Zone</div>
        <div className="drowdon-wrapper">
          <Select
            value={user.user_timezone}
            placeholder="Select Time Zone"
            className="field time-zone"
            showSearch
            filterOption={(input, option) =>{              
            return  option.props.children[0]
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            }
            onChange={(e)=>{this.onHandleChange(e,'user_timezone')}}
          >          
            {
              timeZone.map(res => {
                return (
                  <Select.Option value={res.timezone} key={res.timezone}>
                    {res.timezone}<span className="gmt">{res.display}</span>
                  </Select.Option>
                );
              })
              }
          </Select>
        </div>
        <div className="label-section"></div>
        <Button className="save-button pull-left" onClick={()=>{this.handleUpdate()}} >
          SAVE {userData.isLoading && <Spin />}
        </Button>

        <div />
      </div>
    );
  }
}
