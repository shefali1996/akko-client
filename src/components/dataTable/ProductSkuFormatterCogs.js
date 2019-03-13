import React from 'react';


export default ({cellData, rowData}) => {
  if (!cellData) {
    return null;
  }
  return (
    <div className="flex-left w-100 sku-variant">
      <div className="currency-view">
        <div>
          <span className="product-sku-text" >
            {cellData && cellData.variantSku}
          </span>
        </div>
      </div>
    </div>
  );
};
