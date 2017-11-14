import React from 'react';
import { Image, Label, FormControl } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap-table';
import Checkbox from '../components/Checkbox';
import { numberFormatter } from '../constants';

import sort from '../assets/sort.svg';
import inversesort from '../assets/inversesort.svg';
import plus from '../assets/plus.svg';
import merge from '../assets/merge.svg';
import deleteIcon from '../assets/delete.svg';
import rightArrow from '../assets/rightArrow.svg';

import '../styles/App.css';
import '../styles/react-search-input.css';
import '../styles/react-bootstrap-table.min.css';
import '../styles/customMultiSelect.css';

function onCogsChange(e) {

}

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

export const productDetailFormatter = (cell, row) => (
  <div className="product-data-cell">
    <div className="productImage">
      <img style={{ width: 70 }} src={row.image} alt="thumb" />
    </div>
    <div className="product-custom-title">
      <div>
        <span className="productName">{row.title}</span>
      </div>
      <div>
        <span className="variantTitle">{row.variant}</span>
      </div>
      <div className="sku-view">
        <div className="half-width">
          <span className="channelNumberText">SKU : {row.sku}</span>
        </div>
        <div className="half-width">
          <span className="variantTitle margin-l-20">Selling for:  <strong>${parseFloat(Math.round(row.price * 100) / 100).toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  </div>
);

export const cogsValueFormatter = (cell, row) => (
  <div className="flex-center padding-t-20">
    <div className="currency-view">
      <span className="product-currency">
        $
      </span>
      <span className="product-currency-text">
        COGS
      </span>
    </div>
    <FormControl
      type="text"
      className="product-input"
      value={cell}
      onChange={onCogsChange}
    />
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
