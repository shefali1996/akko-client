import React from 'react';
import { FormControl } from 'react-bootstrap';
import findIndex from "lodash/findIndex"
import isUndefined from "lodash/isUndefined"
import styles from '../../constants/styles';
import {validateCogsValue} from '../../helpers/Csv';

export default ({cell, row, rowIndex, tableData, onChange, onBlur}) => {
  if (!cell) {
    return null;
  }
  if (!rowIndex && tableData) {
    rowIndex = findIndex(tableData, {id: row.id});
  }
  const cogsValue = isUndefined(row.cogs) ? cell.cogs : row.cogs;
  return (
    <div className="flex-center w-100" >
      <div className="currency-view">
        <div className="table-input-field">
          <span className="product-cogs-text">$</span>
          {" "}
          <FormControl
            type="number"
            className="product-cogs-text  table-input-field setcogs-input"
            value={cogsValue >=0?cogsValue:undefined}
            onChange={(e) => onChange(e, row, rowIndex)}
            placeholder="NOT SET"
            onBlur={(e) => onBlur(e, row)}
          />
        </div>
      </div>
    </div>
  );
};
