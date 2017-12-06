import React, { Component } from 'react';
import { Row, Col, Label, Button, Image } from 'react-bootstrap';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import SearchInput, { createFilter } from 'react-search-input';
import {
  customMultiSelect,
  renderSizePerPageDropDown,
  renderSetTablePaginationPanel,
  productDetailFormatter,
  sortByTitle,
  getCaret,
  sortByCogsValue,
  productPriceFormatter,
  sortByProductPrice
} from '../components/CustomTable';
import { KEYS_TO_FILTERS } from '../constants';

const styles = {
  chartsHeaderTitle: {
    fontSize: '16px',
    color: '#666666',
    fontWeight: 'bold',
    textDecoration: 'none solid rgb(102, 102, 102)',
  },
  chartHeader: {
    width: '100%',
    padding: '0px'
  }
};

class FilterDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchTerm: '',
      selectedRows: []
    };
    this.searchUpdated = this.searchUpdated.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
  }
  searchUpdated(term) {
    this.setState({
      searchTerm: term
    });
  }
  onFocus() {

  }
  onRowSelect(row, isSelected) {
    const {selectedRows} = this.state;
    if (isSelected) {
      selectedRows.push(row.id);
      this.setState({selectedRows});
    } else {
      const i = selectedRows.indexOf(row.id);
      if (i !== -1) {
        selectedRows.splice(i, 1);
      }
      this.setState({selectedRows});
    }
  }

  onSelectAll(isSelected, rows) {
    const idArray = [];
    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        idArray.push(rows[i].id);
      }
      this.setState({selectedRows: idArray});
    } else {
      this.setState({selectedRows: []});
    }
    return true;
  }
  render() {
    const {filterModal} = this.props;
    const {searchTerm, data, selectedRows} = this.state;
    const filteredData = data.filter(createFilter(searchTerm, KEYS_TO_FILTERS));
    const selectRowProp = {
      mode: 'checkbox',
      customComponent: customMultiSelect,
      onSelect: this.onRowSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this)
    };
    const options = {
      sizePerPageDropDown: renderSizePerPageDropDown,
      paginationPanel: renderSetTablePaginationPanel,
      paginationSize: 7,
      prePage: '«   Previous',
      nextPage: 'Next   »',
      withFirstAndLast: false,
      sortIndicator: false,
      sizePerPage: 100
    };

    let filterTitle = '';
    if (filterModal === 'product') {
      filterTitle = 'Filter By Product';
    } else if (filterModal === 'customer') {
      filterTitle = 'Filter By Customer';
    } else if (filterModal === 'metrics') {
      filterTitle = 'Filter By Metrics';
    }
    return (
      <Row className="filter-dialog">
        <Col md={10} mdOffset={1}>
          <Card className="charts-card-style">
            <CardHeader
              textStyle={styles.chartHeader}
              title={<div>
                <span>{filterTitle}</span>
                <span className="pull-right close-btn">
                  <Button className="close-button pull-right" onClick={this.props.closeFilter} />
                </span>
              </div>}
              titleStyle={styles.chartsHeaderTitle}
          />
            <CardText>
              <Row>
                <Col md={8}>
                  <Row>
                    <Col md={12} className="filterSearch">
                      <SearchInput
                        className="search-input"
                        placeholder="Search all your inventory"
                        onChange={this.searchUpdated}
                        onFocus={this.onFocus}
                    />
                    </Col>
                    <Col md={12}>
                      <BootstrapTable
                        ref={(table) => { this.table = table; }}
                        data={filteredData}
                        options={options}
                        bordered={false}
                        selectRow={selectRowProp}
                        pagination
                        trClassName="custom-table"
                  >
                        <TableHeaderColumn
                          isKey
                          dataField="id"
                          dataAlign="center"
                          dataSort
                          className="custom-table-header"
                          hidden
                    >
                      ID
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="productDetail"
                          dataAlign="center"
                          dataSort
                          className="set-table-header"
                          dataFormat={productDetailFormatter}
                          sortFunc={sortByTitle}
                          caretRender={getCaret}
                          width="40%"
                    >
                      Product
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="productDetail"
                          dataAlign="center"
                          className="set-table-header"
                          dataFormat={productPriceFormatter}
                          dataSort
                          caretRender={getCaret}
                          sortFunc={sortByProductPrice}
                          width="20%"
                    >
                      Listed Price
                        </TableHeaderColumn>
                      </BootstrapTable>
                    </Col>
                  </Row>
                </Col>
                <Col md={4} className="text-center">
                  <Col className="selected-text">
                    Selected Products: {selectedRows.length} / {data.length}
                  </Col>
                </Col>
              </Row>
            </CardText>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default FilterDialog;
