import React, { Component } from 'react';
import { Grid, Row, Col, Button, Label, FormControl, Tooltip, OverlayTrigger, Image } from 'react-bootstrap';
import SearchInput, { createFilter } from 'react-search-input';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import toastr from 'toastr';
import { Column, Table, AutoSizer, InfiniteLoader } from 'react-virtualized';
import swal from 'sweetalert2';
import { Switch, Progress, Spin } from 'antd';
import $ from 'jquery';
import { isEmpty, isNull, isEqual, cloneDeep, clone, find, isUndefined, findIndex, map, remove, property } from 'lodash';
import { renderSizePerPageDropDown, renderSetTablePaginationPanel, productDetailFormatter, sortByTitle, getCaret, sortByCogsValue, productPriceFormatter, sortByProductPrice, getHeaderText} from '../components/CustomTable';
import { KEYS_TO_FILTERS_VARIANTS, INVALID_COGS, isNumeric, numberFormatter, pollingInterval, getTableConstants } from '../constants';
import { validateCogsValue, updatedCogsValue, updateProgress, updateMarginDoller, updateMarginPercent, updateCogs } from '../helpers/Csv';
import styles from '../constants/styles';
import { CogsValueFormatter, MarginDollerFormater, MarginPercentFormater, ProductTitleFormatter, ProductVariantsFormatter, ProductSkuFormatterCogs, ProductPriceFormatterCogs, ExpendVariantsFormatter, RenderProgressBar, customMultiSelect} from '../components/customTable1';

const PRODUCT = 'product';
const VARIANT = 'variant';
const list = [];

const swalert = () => {
  return swal({
    title:             'Error!',
    type:              'error',
    text:              this.state.errorText.toString(),
    allowOutsideClick: false,
    focusConfirm:      false,
  });
};

class SetCogsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:                {},
      tableData:           [],
      selectedRows:        [],
      numSelectedVariants: 0,
      searchTerm:          '',
      inProgressSetCogs:   false,
      pendingRequest:      false,
      currentPage:         1,
      totalPage:           0,
      rowsPerPage:         50,
      progress:            {
        total:     0,
        pending:   0,
        completed: 0
      },
      showError: false,
      errorText: ''
    };
  }

  componentWillReceiveProps(props) {
    const {tableData, selectedRows, numSelectedVariants, progress} = props;
    this.setState({
      tableData,
      selectedRows,
      numSelectedVariants,
      progress,
    });
  }
  componentDidMount() {

  }
  onRowSelect = (row, isSelected) => {
    let {selectedRows, numSelectedVariants, data} = this.state;
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
        const p = find(data.products, {
          productId: row.productId
        });
        if (p) {
          let i = true;
          p.variants.map((val) => {
            if (selectedRows.indexOf(val.variantId) === -1) {
              i = false;
            }
          });
          if (i) {
            selectedRows.push(row.productId);
          }
        }
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
      map(rows, (row) => {
        if (row.rowType === PRODUCT) {
          selectedRows.push(row.id);
          map(row.variants, (val) => {
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
        selectedRows:        [],
        numSelectedVariants: 0,
        inProgressSetCogs:   false
      };
    }
    this.setState(selection);
    this.props.updateParentState(selection);
  }
    toggleVariantsRows = (cell, row, rowIndex) => {
      const {tableData, data, rowsPerPage} = cloneDeep(this.state);
      for (let i = 1; i <= tableData[rowIndex].variants.length; i++) {
        const r = tableData[rowIndex + i];
        if (r.rowType === VARIANT && r.productId === row.productId) {
          r.hidden = !!row.expanded;
        }
      }
      tableData[rowIndex].expanded = !row.expanded;
      this.setState({
        tableData
      });
      this.props.updateParentState({
        tableData
      });
    }
    onCogsChange = (e, row, rowIndex) => {
      const {tableData} = this.state;
      if (rowIndex && rowIndex !== -1) {
        let value = e.target.value;        
        if (isEmpty(value)) {
          value = INVALID_COGS;
        }
        tableData[rowIndex].cogs = value;
      }
      this.props.cogsChange();
      this.props.updateParentState({
        tableData
      });
    }
    onCogsBlur = (e, row) => {
      const {tableData, progress} = this.state;
      const cogs =e.target.value? Number(e.target.value):undefined;      
      const newData = updateCogs(cogs, row, tableData, progress);
      const changeState = {
        tableData:         newData.tableData,
        inProgressSetCogs: true,
        progress:          newData.progress
      };
      if (!newData.isValid) {
        toastr.error('COGS invalid');
      }
      this.props.updateParentState(changeState);
    }
    onMarginDollerChange = (e, row, rowIndex) => {
      const {tableData} = this.state;
      if (rowIndex && rowIndex !== -1) {
        const markup = e.target.value;
        tableData[rowIndex].marginDoller = markup;
      }
      this.props.updateParentState({
        tableData
      });
    }

    onMarginDollerBlur = (e, row, rowIndex) => {
      const {tableData, progress} = this.state;
      let markup = e.target.value;
      if (isEmpty(markup)) {
        markup = 0;
      }
      const newData = updateMarginDoller(markup, row, tableData, progress);
      const changeState = {
        tableData:         newData.tableData,
        progress:          newData.progress,
        inProgressSetCogs: true,
      };
      if (!newData.isValid) {
        toastr.error('COGS invalid');
      }
      this.props.updateParentState(changeState);
    }
    onFocus = () => this.setState({
      change: false
    });
    onMarginPercentChange = (e, row, rowIndex) => {
      const {tableData} = this.state;
      if (rowIndex) {
        const markup = e.target.value;
        tableData[rowIndex].marginPercent = markup;
      }
      this.props.updateParentState({
        tableData
      });
    }
    onMarginPercentBlur = (e, row, rowIndex) => {
      const {tableData, progress} = this.state;
      let markup = e.target.value;
      if (isEmpty(markup)) {
        markup = 0;
      }
      const newData = updateMarginPercent(markup, row, tableData, progress);
      const changeState = {
        tableData:         newData.tableData,
        progress:          newData.progress,
        inProgressSetCogs: true
      };
      if (!newData.isValid) {
        toastr.error('COGS invalid');
      }
      this.props.updateParentState(changeState);
    }
    getRowClass = (row, rowIndex) => {
      if (rowIndex === -1) {
        return 'vt-table-header';
      } else if (row && row.rowType === VARIANT) {
        const cogs = row.cogs || row.variant.cogs;
        if (!row.cogs && row.variant.cogs === -1) {
          return 'vt-table-row';
        } else if (validateCogsValue(cogs, row.variant.price) !== true) {
          return 'vt-table-row error';
        }
      }
      return 'vt-table-row';

    }
    onRowMouseOver = (row) => {
      const {tableData} = this.state;
      const rowIndex = findIndex(tableData, {id: row.id});
      if (rowIndex !== -1) {
        tableData[rowIndex].hover = true;
      }
      this.props.updateParentState({tableData});
    }
    onRowMouseOut = (row) => {
      const {tableData} = this.state;
      const rowIndex = findIndex(tableData, {id: row.id});
      if (rowIndex !== -1) {
        tableData[rowIndex].hover = false;
      }
      this.props.updateParentState({tableData});
    }

    render() {
      const {data, selectedRows, currentPage, rowsPerPage, tableData} = this.state;
      const {hideCompleted, searchTerm, loading} = this.props;
      const tableConstants = getTableConstants();
      const expandedRows = [];
      let filteredData = tableData.filter((rowData, rowIndex) => {
        if (hideCompleted) {
          let cogsValid = false;
          if (rowData.rowType === PRODUCT) {
            let invalidRow = false;
            for (let i = 1; i <= rowData.variants.length; i++) {
              const varRow = tableData[rowIndex + i];
              if (varRow.variant && validateCogsValue(varRow.variant.cogs, varRow.variant.price) !== true) {
                invalidRow = true;
              }
            }
            if (invalidRow) {
              cogsValid = true;
            }
          } else if (rowData.rowType === VARIANT) {
            cogsValid = validateCogsValue(rowData.variant.cogs, rowData.variant.price) !== true;
          }
          return !rowData.hidden && cogsValid;
        }
        return !rowData.hidden;
      });
      filteredData = filteredData.filter(createFilter(searchTerm, KEYS_TO_FILTERS_VARIANTS));
      filteredData = (!loading && !isEmpty(filteredData) && filteredData) || [];
      const listItem = $('ul.pagination > li');
      listItem.hover((e) => {
        listItem.removeAttr('title');
      });
      return (
        <div className="set-cogs-table" style={{ height: 'calc(94vh - 270px)' }}>
          <AutoSizer>
            {({ height, width }) => {
              width = width < 500 ? 500 : width;
              const w = width - tableConstants.select;
              return (
                <Table
                  width={width}
                  height={height}
                  headerHeight={tableConstants.rowHeight}
                  rowHeight={tableConstants.rowHeight}
                  onRowMouseOver={({rowData}) => this.onRowMouseOver(rowData)}
                  onRowMouseOut={({rowData}) => this.onRowMouseOut(rowData)}
                  rowClassName={({index}) => this.getRowClass(filteredData[index], index)}
                  headerClassName="set-cogs-header"
                  rowCount={filteredData.length}
                  noRowsRenderer={() => <div className="no-data-text">{loading ? <Spin /> : 'No data found'}</div>}
                  rowGetter={({ index }) => filteredData[index]}
                >
                  <Column
                    className="vt-cell"
                    dataKey="id"
                    width={tableConstants.select}
                    headerRenderer={() => customMultiSelect({rowIndex: 'Header', selectedRows, tableData, onChange: (isSelected, rows) => this.onSelectAll(isSelected, rows)})}
                    cellRenderer={({rowIndex, rowData}) => customMultiSelect({rowIndex, selectedRows, tableData, rowData, onChange: (isSelected, row) => this.onRowSelect(row, isSelected)})}
                />
                  <Column
                    width={w * tableConstants.title}
                    headerRenderer={() => getHeaderText('PRODUCT TITLE')}
                    className="vt-cell p-title border-left"
                    disableSort
                    cellRenderer={({cellData, rowData}) => <ProductTitleFormatter cellData={cellData} rowData={rowData} tableData={tableData} />}
                    dataKey="productTitle"
                />
                  <Column
                    width={w * tableConstants.variant}
                    headerRenderer={() => getHeaderText('VARIANT')}
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData}) => <ProductVariantsFormatter cellData={cellData} rowData={rowData} />}
                    dataKey="variant"
                />
                  <Column
                    width={w * tableConstants.sku}
                    headerRenderer={() => getHeaderText('SKU')}
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData}) => <ProductSkuFormatterCogs cellData={cellData} rowData={rowData} />}
                    dataKey="variant"
                />
                  <Column
                    width={w * tableConstants.price}
                    headerRenderer={() => getHeaderText('Price')}
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData}) => <ProductPriceFormatterCogs cellData={cellData} rowData={rowData} />}
                    dataKey="variant"
                />
                  <Column
                    width={w * tableConstants.cogs}
                    headerRenderer={() => getHeaderText('COGS')}
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData, rowIndex}) => <CogsValueFormatter cell={cellData} row={rowData} tableData={tableData} onChange={this.onCogsChange} onBlur={this.onCogsBlur} />}
                    dataKey="variant"
                />
                  <Column
                    width={w * tableConstants.marginDoller}
                    headerRenderer={() => getHeaderText('MARKUP($)')}
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData, rowIndex}) => <MarginDollerFormater cell={cellData} row={rowData} tableData={tableData} onFocus={this.onFocus} onChange={this.onMarginDollerChange} onBlur={this.onMarginDollerBlur} />}
                    dataKey="variant"
                />
                  <Column
                    width={w * tableConstants.marginPercent}
                    headerRenderer={() => getHeaderText('MARKUP(%)')}
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData, rowIndex}) => <MarginPercentFormater cell={cellData} row={rowData} tableData={tableData} onFocus={this.onFocus} onChange={this.onMarginPercentChange} onBlur={this.onMarginPercentBlur} />}
                    dataKey="variant border-left"
                />
                  <Column
                    width={w * tableConstants.expand}
                    label=""
                    className="vt-cell border-left"
                    cellRenderer={({cellData, rowData, rowIndex}) => <ExpendVariantsFormatter cell={cellData} row={rowData} tableData={tableData} toggleVariantsRows={this.toggleVariantsRows} />}
                    dataKey="numVariants"
                />
                </Table>
              );
}}
          </AutoSizer>
        </div>
      );
    }
}


export default SetCogsTable;
