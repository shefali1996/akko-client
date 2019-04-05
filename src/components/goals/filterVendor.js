import React, { Component } from "react";
import { Table, Button } from 'antd';

import "antd/lib/table/style";

const columns = [
  {
    title:'img',
    key: 'img',
    dataIndex:'img',
    width: '10%'
  },
  {
  title: 'Name',
  key: 'Name',
  dataIndex: 'title',
  width: '90%'
  }
];
const data = [];

export default class FilterVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      vendors:[],
    };
  }

  render() {
    const {selectedVendors,setSelectedVendors } = this.props;
    const {vendors = []} = this.props;
    const dataSource = vendors.map(val=>{
      const firstChar = val.title.charAt(0);
      return {
        key:val.id,
        title:val.title,
        img: <div className="square-green">{firstChar}</div>
      };
    })
    const rowSelection = {selectedRowKeys:selectedVendors,onChange: setSelectedVendors};
    return (
      <div>
        <Table showHeader ={false}
        scroll={{y:390}} 
        rowSelection={rowSelection} 
        columns={columns} 
        pagination={false} 
        dataSource={dataSource} />
      </div>
    )
  }
}