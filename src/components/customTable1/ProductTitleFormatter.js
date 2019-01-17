import React from 'react';
import {find, findIndex} from 'lodash';
import {isCogsInvalid, PRODUCT} from '../../constants';
import {validateCogsValue} from '../../helpers/Csv';
import productImgPlaceholder from '../../assets/images/productImgPlaceholder.svg';


export default ({cellData, rowData, tableData}) => {      
  let borderLeft = 'border-left-green';
  if (rowData.rowType === PRODUCT) {
    const invalidRow = find(rowData.variants, (o) => {
      const rowIndex = findIndex(tableData, { id: o.variantId });
      const varRow = tableData[rowIndex];
      const cogs = varRow.cogs || varRow.variant.cogs;
      if (!varRow.cogs && varRow.variant.cogs === -1) {
        borderLeft = 'border-left-gray';
        return true;
      } else if (validateCogsValue(cogs, varRow.variant.price) !== true) {
        borderLeft = 'border-left-red';
        return true;
      }
      return false;
    });
  } else {
    const cogs = rowData.cogs || rowData.variant.cogs;
    if (!rowData.cogs && rowData.variant.cogs === -1) {
      borderLeft = 'border-left-gray';
    } else if (validateCogsValue(cogs, rowData.variant.price) !== true) {
      borderLeft = 'border-left-red';
    }
  }
  return (
    <div className={`product-data-cell ${borderLeft} w-100`}>
      <div className="productImage">
        <img src={rowData.variant && rowData.variant.imageUrl ||rowData.variants && rowData.variants.length > 0 && rowData.variants[0].imageUrl || productImgPlaceholder} alt="Product Image" />
      </div>
      <div className="product-custom-title">
        <div>
          <span className="cogs-product-title" title={cellData}>{cellData}</span>
        </div>
      </div>
    </div>
  );
};
