import React from 'react';
import {isEmpty, isUndefined, findIndex} from 'lodash';
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
    if (!isUndefined(row.marginDoller)) {
      margin = row.marginDoller;
    } else if (validateCogsValue(cogs, price) === true) {
      margin = (price - cogs).toFixed(2);
    }
  }
  return (
    <div className="flex-center w-100">
      <div className="currency-view">
        <div className="table-input-field">
          <span className="product-cogs-text">$</span>
          <FormControl
            type="number"
            className="product-cogs-text table-input-field"
            value={margin}
            // onFocus={(e) => onFocus(e)}
            onChange={(e) => onChange(e, row, rowIndex)}
            onBlur={(e) => onBlur(e, row, rowIndex)}
          />
        </div>
      </div>
    </div>
  );
};
