import React from 'react';
import { FormControl } from 'react-bootstrap';
import {findIndex, indexOf} from 'lodash';
import Checkbox from '../Checkbox';
import styles from '../../constants/styles';
import {isCogsInvalid} from '../../constants';

const customMultiSelect = (props) => {
  const { type, checked, disabled, onChange, rowIndex, rowData, selectedRows, tableData} = props;
  if (rowIndex === 'Header') {
    return (
      <div className="checkbox-personalized">
        <Checkbox
          {...props}
          onChange={(e) => onChange(e.target.checked, tableData)}
          checked={selectedRows.length > 0 && selectedRows.length !== tableData.length ? 'indeterminate' : checked}
          />
        <label htmlFor={`checkbox${rowIndex}`}>
          <div className="check" />
        </label>
      </div>
    );
  }
  return (
    <div className="checkbox-personalized">
      <input
        type="checkbox"
        name={`checkbox${rowIndex}`}
        id={`checkbox${rowIndex}`}
        checked={indexOf(selectedRows, rowData.id) > -1}
        disabled={disabled}
        onChange={e => onChange(e.target.checked, rowData)}
        ref={input => {
          if (input) {
            input.indeterminate = props.indeterminate;
          }
        }}
      />
      <label htmlFor={`checkbox${rowIndex}`}>
        <div className="check" />
      </label>
    </div>
  );

};

export default customMultiSelect;
