import React from 'react';
import findIndex from "lodash/findIndex"
import openDownIcon from '../../assets/images/openDownIcon.svg';
import openUpIcon from '../../assets/images/openUpIcon.svg';
import openDownIconHover from '../../assets/images/down_arrow_emphasis.svg';
import openUpIconHover from '../../assets/images/up_arrow_emphasis.svg';


export default ({cell, row, rowIndex, tableData, toggleVariantsRows}) => {
  if (cell >= 1) {
    if (!rowIndex && tableData) {
      rowIndex = findIndex(tableData, {id: row.id});
    }
    const up = row.hover ? openUpIconHover : openUpIcon;
    const down = row.hover ? openDownIconHover : openDownIcon;
    const imgClass = row.hover ? 'expand-arrow-hover' : 'expand-arrow';
    return (
      <div className="flex-center w-100">
        <div className="product-data-cell">
        {/* onClick={() => toggleVariantsRows(cell, row, rowIndex)}
           onclick handler is removed if needed in future use above code */}
          <div className="product-custom-title " >
            <div>
              <span className="variantTitle" style={{fontStyle: 'italic'}}>{`${cell} variants`}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
