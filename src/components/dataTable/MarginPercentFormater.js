import React from 'react';
import isUndefined from "lodash/isUndefined"
import findIndex from "lodash/findIndex"
import { FormControl } from 'react-bootstrap';
import styles from '../../constants/styles';
import {validateCogsValue} from '../../helpers/Csv';

export default ({cell, row, rowIndex, tableData, onFocus, onChange, onBlur}) => {
  let margin = 0;
  if (!row.variant) {
    return null;
  } else {
    if (!rowIndex && tableData) {
      rowIndex = findIndex(tableData, {id: row.id});
    }
    const {cogs, price} = row.variant;
    if (!isUndefined(row.marginPercent)) {
      margin = row.marginPercent;
    } else if (validateCogsValue(cogs, price) === true) {
      margin = ((price - cogs) * 100 / price).toFixed(2);
    }
  }
  return (
    <div className="flex-center w-100">
      <div className="currency-view">
        <div className="table-input-field">
          <FormControl
            type="number"
            className="product-cogs-text setcogs-input table-input-field"
            value={margin}
            placeholder="NOT SET"
            // onFocus={(e) => onFocus(e)}
            onChange={(e) => onChange(e, row, rowIndex)}
            onBlur={(e) => onBlur(e, row, rowIndex)}
        />
        {" "}
          <span className="product-cogs-text"> %</span>
        </div>
      </div>
    </div>
  );
};
