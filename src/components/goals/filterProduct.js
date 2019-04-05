import React, { Component } from "react";
import { createFilter } from "react-search-input";
import toastr from "toastr";
import { Column, Table, AutoSizer } from "react-virtualized";
import swal from "sweetalert2";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style";
import $ from "jquery";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import {
  KEYS_TO_FILTERS_VARIANTS,
  INVALID_COGS,
  getTableConstants
} from "../../constants";

import {customMultiSelect,ProductTitleFormatter,ProductSkuFormatterCogs } from '../../components/dataTable';
// import ProductTitleFormatter from "./filterDataTable/ProductTitleFormatter";

import map from "lodash/map";

const PRODUCT = "product";
const VARIANT = "variant";

const swalert = () => {
  return swal({
    title: "Error!",
    type: "error",
    text: this.state.errorText.toString(),
    allowOutsideClick: false,
    focusConfirm: false
  });
};

class GoalsProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      tableData: [],
      selectedRows: [],
      numSelectedVariants: 0,
      searchTerm: "",
      currentPage: 1,
      totalPage: 0,
      rowsPerPage: 50,
      showError: false,
      errorText: ""
    };
  }

  componentDidMount(){
    const { selectedRows, numSelectedVariants, progress } = this.props;
    this.setState({
      selectedRows,
      numSelectedVariants,
      progress
    });
  }

  componentWillReceiveProps(props) {

    const prevProps = cloneDeep(this.props);
    if(!isEqual(props,prevProps)){
      const { selectedRows, numSelectedVariants, progress } = props;
    this.setState({
      selectedRows,
      numSelectedVariants,
      progress
    });
    }
  }

  onRowSelect = (row, isSelected) => {    
    let {selectedRows, numSelectedVariants, data} = this.state;
    console.log("on row select",row,isSelected);
    let selection = {};
    if (isSelected) {
      selectedRows.push(row.id);
      if (row.rowType === PRODUCT) {
        row.variants.map((val) => {
          if (selectedRows.indexOf(val.variantId) === -1) {
            selectedRows.push(val.variantId);
            numSelectedVariants += 1;
          }
        });
      } else if (row.rowType === VARIANT) {
        numSelectedVariants += 1;
        
        // const p = find(data.products, {
        //   productId: row.productId
        // });
        // if (p) {
          if (selectedRows.indexOf(row.productId) === -1) {
            selectedRows.push(row.productId);
          }
        // }
      }
      selection = {
        selectedRows,
        numSelectedVariants,
        inProgressSetCogs: true
      };
    } else {
      const i = selectedRows.indexOf(row.id);
      if (i !== -1) {
        selectedRows.splice(i, 1);
      }
      if (row.rowType === PRODUCT) {
        row.variants.map((val, i) => {
          if (selectedRows.includes(val.variantId)) {
            selectedRows.splice(selectedRows.indexOf(val.variantId), 1);
            numSelectedVariants -= 1;
          }
        });
      } else if (row.rowType === VARIANT) {
        numSelectedVariants -= 1;
        const p = find(data.products, {
          productId: row.productId
        });
        if (p) {
          p.variants.map((val) => {
            if (!selectedRows.includes(val.variantId) && selectedRows.includes(row.productId)) {
              selectedRows.splice(selectedRows.indexOf(row.productId), 1);
            }
          });
        }
      }
      selection = {
        selectedRows,
        numSelectedVariants,
        inProgressSetCogs: !!selectedRows.length
      };
    }
    this.setState(selection);
    this.props.updateParentState(selection);
  }

  onSelectAll = (isSelected, rows) => {
    let selection = {};
    const selectedRows = [];
    let numSelectedVariants = 0;
    const inProgressSetCogs = false;
    if (isSelected) {
      map(rows, row => {
        if (row.rowType === PRODUCT) {
          selectedRows.push(row.id);
          map(row.variants, val => {
            selectedRows.push(val.variantId);
            numSelectedVariants += 1;
          });
        }
      });
      selection = {
        selectedRows,
        numSelectedVariants,
        inProgressSetCogs: true
      };
    } else {
      selection = {
        selectedRows: [],
        numSelectedVariants: 0,
        inProgressSetCogs: false
      };
    }
    this.setState(selection);
    this.props.updateParentState(selection);
  };

  onFocus = () =>
    this.setState({
      change: false
    });

 
  getRowClass = (row, rowIndex) => {
    if (row) {
      var rowClass = row && row.rowType === PRODUCT ? "product-row" : "variant-row";
    }
    return `vt-table-row ${rowClass}`;
  };

  onRowMouseOver = row => {
    const {tableData} = this.props;
    const rowIndex = findIndex(tableData, { id: row.id });
    if (rowIndex !== -1) {
      tableData[rowIndex].hover = true;
    }
    this.props.updateParentState({ tableData });
  };
  onRowMouseOut = row => {
    const {tableData} = this.props;
    const rowIndex = findIndex(tableData, { id: row.id });
    if (rowIndex !== -1) {
      tableData[rowIndex].hover = false;
    }
    this.props.updateParentState({ tableData });
  };
  rowHeight = dataTable => {
    const dynamicHeight =
      this.filteredData[dataTable.index].rowType == PRODUCT ? 70 : 45;
    return dynamicHeight;
  };
  render() {
    const {
      data,
      selectedRows,
      currentPage,
      rowsPerPage,
    } = this.state;
    const {tableData} = this.props;

    const { hideCompleted, searchTerm, loading } = this.props;
    const tableConstants = getTableConstants();
    const expandedRows = [];
    let filteredData = tableData.filter((rowData, rowIndex) => {
      if (hideCompleted) {
        let cogsValid = false;
        if (rowData.rowType === PRODUCT) {
          let invalidRow = false;
          for (let i = 1; i <= rowData.variants.length; i++) {
            const varRow = tableData[rowIndex + i];
            if (
              varRow.variant &&
              validateCogsValue(varRow.variant.cogs, varRow.variant.price) !==
                true
            ) {
              invalidRow = true;
            }
          }
          if (invalidRow) {
            cogsValid = true;
          }
        } else if (rowData.rowType === VARIANT) {
          cogsValid =
            validateCogsValue(rowData.variant.cogs, rowData.variant.price) !==
            true;
        }
        return !rowData.hidden && cogsValid;
      }
      return !rowData.hidden;
    });

    filteredData = filteredData.filter(
      createFilter(searchTerm, KEYS_TO_FILTERS_VARIANTS)
    );
    filteredData = (!loading && !isEmpty(filteredData) && filteredData) || [];
    this.filteredData = filteredData;
    const listItem = $("ul.pagination > li");
    listItem.hover(e => {
      listItem.removeAttr("title");
    });
    return (
      <div className="set-cogs-table" style={{ height: 390 }}>
        <AutoSizer>
          {({ height, width }) => {
            width = width < 500 ? 500 : width;
            const w = width - tableConstants.select;
            return (
              <Table
                width={width}
                height={height}
                disableHeader={true}
                headerHeight={tableConstants.rowHeight}
                rowHeight={({ index, rowData }) =>
                  this.rowHeight({ index, rowData })
                }
                computeRowHeight={({ rowData }) => this.compute({ rowData })}
                rowClassName={({ index, rowData }) =>this.getRowClass(filteredData[index], index, rowData)
                }
                rowCount={filteredData.length}
                noRowsRenderer={() => (
                  <div className="no-data-text">
                    {loading ? <Spin /> : "No data found"}
                  </div>
                )}
                rowGetter={({ index }) => filteredData[index]}
              >
                <Column
                  className="vt-cell"
                  dataKey="id"
                  width={20}
                  width={tableConstants.select}
                  cellRenderer={({ rowIndex, rowData }) =>
                    customMultiSelect({
                      rowIndex,
                      selectedRows,
                      tableData,
                      rowData,
                      onChange: (isSelected, row) =>
                        this.onRowSelect(row, isSelected)
                    })
                  }
                />
                
                <Column
                  width={w * tableConstants.title}
                  className="vt-cell p-title border-left"
                  disableSort
                  cellRenderer={({ cellData, rowData }) => (
                    <ProductTitleFormatter
                      cellData={cellData}
                      rowData={rowData}
                      tableData={tableData}
                    />
                  )}
                  dataKey="productTitle"
                />
{/* 
                <Column
                    width={w * tableConstants.sku}
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData}) => 
                    <ProductSkuFormatterCogs cellData={cellData} rowData={rowData} />}
                    dataKey="variant"
                /> */}

              </Table>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}

export default GoalsProductTable;
