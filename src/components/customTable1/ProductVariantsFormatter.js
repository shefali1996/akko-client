import React from 'react';


export default ({cellData, rowData}) => {
  if (!cellData) {
    return null;
  }
  return (
    <div className="flex-center w-100">
      <div className="currency-view">
        <div>
          <span className="product-variant-cogs">
            {cellData && cellData.variantTitle}
          </span>
        </div>
      </div>
    </div>
  );
};
