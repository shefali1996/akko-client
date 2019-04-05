import React from "react";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import { isCogsInvalid, PRODUCT } from "../../constants";
import LinesEllipsis from "react-lines-ellipsis";

export default ({cellData, rowData}) => {
  if (!cellData) {
    return null;
  }
  return (
    <div className="flex-left w-100 sku-variant">
      <div className="currency-view">
        <div>
          <span className="product-sku-text" >
            something
          </span>
        </div>
      </div>
    </div>
  );
};

{/* <div className={`product-data-cell  w-100 `}>
    //   <div className="productImage">
    //     {rowData.rowType === PRODUCT ? ( */}
    //         rowData.variant &&
    //         rowData.variant.imageUrl ||
    //         rowData.variants &&
    //         rowData.variants.length > 0 &&
    //         rowData.variants[0].imageUrl ?
    //         <img src={
    //             rowData.variant &&
    //             rowData.variant.imageUrl ||
    //             rowData.variants &&
    //             rowData.variants.length > 0 &&
    //             rowData.variants[0].imageUrl ||
    //              productImgPlaceholder} alt="Product Image" />
    //          : <div className="first-text">{cellData[0]}</div>
    //     ) : (
          
    //       <div className="invariant-margin" />
    //     )}
    //   </div>
    //   <div className="product-custom-title">
    //     <div>
    //       <span className="cogs-product-title" title={cellData}>
    //         <LinesEllipsis
    //           text={titleData(rowData)}
    //           maxLine="2"
    //           ellipsis=" ..."
    //           trimRight
    //           basedOn="letters"
    //         />
           
    //       </span>
    //     </div>
    //   </div>
    // </div></div>