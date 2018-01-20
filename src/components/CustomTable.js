import React from 'react';
import { Image, Label } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap-table';
import Checkbox from '../components/Checkbox';
import { numberFormatter } from '../constants';

import sort from '../assets/images/sort.svg';
import inversesort from '../assets/images/inversesort.svg';
import plus from '../assets/images/plus.svg';
import merge from '../assets/images/merge.svg';
import deleteIcon from '../assets/images/delete.svg';
import rightArrow from '../assets/images/rightArrow.svg';
import productImgPlaceholder from '../assets/images/productImgPlaceholder.svg';
import styles from '../constants/styles';

export const getCaret = (direction) => {
  if (direction === 'asc') {
    return <Image src={sort} className="sort-icon" />;
  }
  if (direction === 'desc') {
    return (
      <Image src={inversesort} className="sort-icon" />
    );
  }
  return (
    <Image src={sort} className="sort-icon" />
  );
};

export const customMultiSelect = (props) => {
  const { type, checked, disabled, onChange, rowIndex } = props;
  if (rowIndex === 'Header') {
    return (
      <div className="checkbox-personalized">
        <Checkbox {...props} />
        <label htmlFor={`checkbox${rowIndex}`}>
          <div className="check" />
        </label>
      </div>
    );
  }

  return (
    <div className="checkbox-personalized">
      <input
        type={type}
        name={`checkbox${rowIndex}`}
        id={`checkbox${rowIndex}`}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e, rowIndex)}
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

export const createCustomInsertButton = (openModal) => (
  <div className="add-button" onClick={openModal}>
    <Image src={plus} className="plus-icon" />
    <Label className="button-text">
      ADD NEW
    </Label>
  </div>
);

export const createCustomDeleteButton = (openModal) => (
  <div className="delete-button" onClick={openModal}>
    <Image src={deleteIcon} className="plus-icon" />
    <Label className="button-text">
      DELETE
    </Label>
  </div>
);

export const createCustomExportCSVButton = (openModal) => (
  <div className="merge-button" onClick={openModal}>
    <Image src={merge} className="plus-icon" />
    <Label className="button-text">
      MERGE
    </Label>
  </div>
);

export const renderSizePerPageDropDown = (props) => (
  <div className="btn-group">
    {
      [10, 25, 30].map((n, idx) => {
        const isActive = (n === props.currSizePerPage) ? 'active' : null;
        return (
          <button key={idx} type="button" className={`btn btn-info ${isActive}`} onClick={() => props.changeSizePerPage(n)}>{n}</button>
        );
      })
    }
  </div>
);

export const renderPaginationPanel = (props) => (
  <div className="pageList-style">
    {props.components.pageList}
  </div>
);

export const renderSetTablePaginationPanel = (props) => (
  <div className="setTablePageList-style">
    {props.components.pageList}
  </div>
);

export const createCustomButtonGroup = (props) => (
  <ButtonGroup className="button-group-custom-class" sizeClass="btn-group-md">
    <div className="left-button-view">
      {props.insertBtn}
    </div>
    <div className="right-button-view">
      {props.exportCSVBtn}
      {props.deleteBtn}
    </div>
  </ButtonGroup>
);

export const createCustomToolBar = (props) => (
  <div style={{ margin: '15px' }}>
    {props.components.btnGroup}
  </div>
);

export const productCellFormatter = (cell, row) => (
  <div className="product-data-cell">
    <div className="productImage">
      <img style={{ width: 70 }} src={cell.image} alt="thumb" />
    </div>
    <div className="product-custom-title">
      <span className="productName">{cell.title}</span>
      <span className="variantTitle">{cell.variant}</span>
      <span className="channelNumberText">SKU : {cell.sku}</span>
    </div>
  </div>
);

export const productDetailFormatter = (cell, row) => {
  let productImage = cell.image;
  if (productImage === null || productImage === 'null') {
    productImage = productImgPlaceholder;
  }
  return (
    <div className="product-data-cell">
      <div className="productImage">
        <img style={{ width: 70 }} src={productImage} alt="Product Image" />
      </div>
      <div className="product-custom-title">
        <div>
          <span className="productName">{cell.title}</span>
        </div>
        <div>
          <span className="variantTitle">{cell.variant}</span>
        </div>
        <div className="sku-view">
          <div className="half-width">
            <span className="channelNumberText">SKU : {cell.sku}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export const productDetailOnHover = (productInfo, variant) => {
  let productImage = variant && variant.variants.length && variant.variants[0].variant_details.image;
  if (productImage === null || productImage === 'null') {
    productImage = productImgPlaceholder;
  }
  return (
    <div className="product-data-cell">
      <div className="productImage" style={{ maxWidth: '20%' }}>
        <img style={{ width: '100%', maxWidth: '60px' }} src={productImage} alt="Product Image" />
      </div>
      <div className="product-custom-title" style={{ maxWidth: '80%' }} >
        <div>
          <span className="productName" style={styles.showDetailOnHoverTitleBox}>{productInfo.title}</span>
        </div>
        <div className="sku-view">
          <span className="channelNumberText">Variants : {productInfo.numVariants}</span>
        </div>
        <div className="sku-view">
          <span className="channelNumberText" style={{fontStyle: 'italic'}}>{productInfo.deleted ? 'Deleted product' : ''}</span>
        </div>
      </div>
    </div>
  );
};
export const customerDetailOnHover = (customer) => {
  const avgOrderValue = customer.avgOrderValue;
  const frequency = customer.reOrderFrequency;
  let avg = false;
  let fre = false;
  if (avgOrderValue && avgOrderValue.value !== 'invalid') {
    avg = `${avgOrderValue.prefix}${avgOrderValue.value}${avgOrderValue.postfix}`;
  }
  if (frequency && frequency.value !== 'invalid') {
    fre = `${frequency.prefix}${frequency.value}${frequency.postfix}`;
  }
  return (
    <div className="product-data-cell">
      <div className="product-custom-title">
        <div>
          <span className="productName">{customer.name}</span>
        </div>
        <div className="sku-view">
          <span className="channelNumberText">{customer.email}</span>
        </div>
        <div className="sku-view">
          {avg ? <div>
            <span className="channelNumberText">Avg Order Value : {avg}</span>
          </div> : null}
          {fre || false ? <div>
            <span className="channelNumberText">Order frequency : {fre}</span>
          </div> : null}
        </div>
      </div>
    </div>
  );
};
export const productPriceFormatter = (cell, row) => (
  <div className="flex-center padding-t-20">
    <div className="currency-view">
      <span className="product-listed-price">
        ${cell.price}
      </span>
    </div>
  </div>
);

export const customerFormater = (cell, row) => {
  return (
    <div className="product-data-cell">
      <div className="product-custom-title">
        <div>
          <span className="productName">{row.name}</span>
        </div>
        <div>
          <span className="variantTitle">{row.email}</span>
        </div>
      </div>
    </div>
  );
};

export const avgOrderValueFormater = (cell, row) => (
  <div className="flex-center padding-t-20">
    <div className="currency-view">
      <span className="product-listed-price">
        ${cell}
      </span>
    </div>
  </div>
);
export const orderEveryFormatter = (cell, row) => (
  <div className="flex-center padding-t-20">
    <div className="currency-view">
      <span className="product-listed-price">
        {cell}
      </span>
    </div>
  </div>
);

export const cellUnitFormatter = (cell, row) => (
  <div className="stock-on-hand-cell">
    {cell}
  </div>
);

export const cellValueFormatter = (cell, row) => (
  <div className="stock-on-hand-cell">
    {cell.currency}{numberFormatter(Math.round(cell.value * 100) / 100)}
  </div>
);

export const arrowFormatter = (cell, row) => (
  <div className="stock-on-hand-cell">
    <Image src={rightArrow} className="rightArrow" />
  </div>
);

export const sortByTitle = (a, b, order) => {
  const ascVal = a.productDetail.title.localeCompare(b.productDetail.title);
  return order === 'asc' ? ascVal : -ascVal;
};

export const sortByCogsValue = (a, b, order) => {
  const aVal = a.productDetail.cogs;
  const bVal = b.productDetail.cogs;
  const ax = [];
  const bx = [];
  aVal.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push([$1 || Infinity, $2 || '']); });
  bVal.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push([$1 || Infinity, $2 || '']); });
  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }
  return order === 'desc' ? ax.length - bx.length : bx.length - ax.length;
};

export const sortByStockValue = (a, b, order) => {
  if (order === 'desc') {
    return a.stockOnHandValue.value - b.stockOnHandValue.value;
  }
  return b.stockOnHandValue.value - a.stockOnHandValue.value;

};

export const sortByCommitValue = (a, b, order) => {
  if (order === 'desc') {
    return a.committedValue.value - b.committedValue.value;
  }
  return b.committedValue.value - a.committedValue.value;

};

export const sortBySaleValue = (a, b, order) => {
  if (order === 'desc') {
    return a.availableForSaleValue.value - b.availableForSaleValue.value;
  }
  return b.availableForSaleValue.value - a.availableForSaleValue.value;

};


export const sortByProductPrice = (a, b, order) => {
  if (order === 'desc') {
    return a.productDetail.price - b.productDetail.price;
  }
  return b.productDetail.price - a.productDetail.price;

};
