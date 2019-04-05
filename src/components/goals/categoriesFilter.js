import React, { Component } from "react";
import { Table, Button } from 'antd';
import "antd/lib/table/style";

const columns = [
{
  title: 'Image',
  key: 'img',
  dataIndex: 'img',
  width: '10%'
},
{
  title: 'Name',
  dataIndex: 'title',
  key: 'title',
  width: '90%'
}];

class FilterCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      categories:[],
    };
  }

  onSelectChange = (selectedRowKeys) => {
    var tableHead = selectedRowKeys.map((e) => {
      return this.state.categories[e];
    });
    this.props.setTableHead(tableHead);
    this.setState({selectedRowKeys})
  }

  render() {
    const {categories,selectedCategories,setSelectedCategories} = this.props;
    console.log("in categories filter",categories);
    const dataSource = categories.map(val=>{
      const firstChar = val.title.charAt(0);
      return {
        key:val.id,
        title:val.title,
        img: <div className="square-green">{firstChar}</div>
      }
    })
    const rowSelection = {selectedRowKeys:selectedCategories,onChange: setSelectedCategories};
    return (
      <div>
        <Table showHeader ={false}
        scroll={{y:300}} 
        rowSelection={rowSelection} 
        columns={columns} 
        pagination={false} 
        dataSource={dataSource} />
      </div>
    )
  }
}
export default FilterCategories;