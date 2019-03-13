import React from "react";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import { isCogsInvalid, PRODUCT } from "../../constants";
import { validateCogsValue } from "../../helpers/Csv";
import LinesEllipsis from "react-lines-ellipsis";

export default ({ cellData, rowData, tableData }) => {
  const titleData=(rowData)=>{
    if(rowData.rowType === PRODUCT){
      return cellData
    }
    else{
      return rowData.variant.variantTitle
    }
  }
  return (
    <div className={`product-data-cell  w-100 `}>
      <div className="productImage">
        {rowData.rowType === PRODUCT ? (
            rowData.variant &&
            rowData.variant.imageUrl ||
            rowData.variants &&
            rowData.variants.length > 0 &&
            rowData.variants[0].imageUrl ?
            <img src={
                rowData.variant &&
                rowData.variant.imageUrl ||
                rowData.variants &&
                rowData.variants.length > 0 &&
                rowData.variants[0].imageUrl ||
                 productImgPlaceholder} alt="Product Image" />
             : <div className="first-text">{cellData[0]}</div>
        ) : (
          
          <div className="invariant-margin" />
        )}
      </div>
      <div className="product-custom-title">
        <div>
          <span className="cogs-product-title" title={cellData}>
            <LinesEllipsis
              text={titleData(rowData)}
              maxLine="2"
              ellipsis=" ..."
              trimRight
              basedOn="letters"
            />
           
          </span>
        </div>
      </div>
    </div>
  );
};
