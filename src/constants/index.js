import Radium from 'radium';
import { headShake } from 'react-animations';
import { validateCogsValue } from '../helpers/Csv';

// static constants
export const testMode = false;
export const pollingInterval = 30 * 1000; // seconds 30s
export const KEYS_TO_FILTERS = ['productDetail.title', 'stockOnHandUnits', 'stockOnHandValue.value', 'committedUnits', 'committedValue.value', 'availableForSaleUnits', 'availableForSaleValue.value'];
export const KEYS_TO_METRICES = ['title', 'description', 'prefix', 'value', 'trend', 'trendValue', 'trendPeriod'];
export const KEYS_TO_FILTERS_VARIANTS = ['variant_details.title', 'variant_details.variant', 'variant_details.sku'];
export const plotByOptions = {time: 'Time', product: 'Product', customer: 'Customer'};
export const businessType = {dropshipper: 'one', reseller: 'two', manufacture: 'three', other: 'four'};
// static functions
export const validateEmail = (email) => {
  // eslint-disable-next-line max-len, no-useless-escape
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

export const numberFormatter = (number) => {
  if (number > 999) {
    return `${(number / 1000).toFixed(1)} K`;
  } else if (number > 999999) {
    return `${(number / 1000000).toFixed(1)} M`;
  } else if (number > 999999999) {
    return `${(number / 1000000000).toFixed(1)} B`;
  }
  return parseFloat(Math.round(number * 100) / 100).toFixed(2);
};

export const convertInventoryJSONToObject = (inventoryJSON) => {
  const products = [];
  for (let i = 0; i < inventoryJSON.length; i++) {
    const currProduct = inventoryJSON[i];
    const productEntry = {
      id:               currProduct.id,
      productDetail:    currProduct.product_details,
      stockOnHandUnits: currProduct.inventory_details.in_stock_units,
      stockOnHandValue: {
        value:    currProduct.inventory_details.in_stock_value,
        currency: currProduct.currency
      },
      committedUnits: currProduct.inventory_details.committed_units,
      committedValue: {
        value:    currProduct.inventory_details.committed_value,
        currency: currProduct.currency
      },
      availableForSaleUnits: currProduct.inventory_details.available_units,
      availableForSaleValue: {
        value:    currProduct.inventory_details.available_value,
        currency: currProduct.currency
      },
      title:              currProduct.product_details.title,
      variant:            currProduct.product_details.variant,
      sku:                currProduct.product_details.sku,
      price:              currProduct.product_details.price,
      cogs:               currProduct.product_details.cogs !== 'null' ? currProduct.product_details.cogs : '',
      cogsValidateStatus: validateCogsValue(currProduct.product_details.cogs, currProduct.product_details.price)
    };
    products.push(productEntry);
  }
  return products;
};

export const getProductValue = (inventoryJSON) => {
  const products = [];
  for (let i = 0; i < inventoryJSON.length; i++) {
    const currProduct = inventoryJSON[i];
    const productEntry = {
      id:      currProduct.id,
      title:   currProduct.variant_details.title,
      variant: currProduct.variant_details.variant,
      sku:     currProduct.variant_details.sku,
      price:   currProduct.variant_details.price,
      cogs:    currProduct.variant_details.cogs
    };
    products.push(productEntry);
  }
  return products;
};

export const headers = {
  id:      'ID',
  title:   'Title',
  variant: 'Variant',
  sku:     'SKU',
  price:   'Price',
  cogs:    'COGS'
};

export const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (const index in array[i]) {
      if (line !== '') line += ',';
      line += array[i][index];
    }

    if (i < array.length - 1) line += '\r\n';
    str += line;
  }

  return str;
};

export const exportCSVFile = (headers, items, fileTitle) => {
  if (headers) {
    items.unshift(headers);
  }
  // Convert Object to JSON
  const jsonObject = JSON.stringify(items);
  const csv = convertToCSV(jsonObject);
  const exportedFilenmae = `${fileTitle}.csv` || 'export.csv';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export const getCogsValue = (objArray) => {
  let cogsCount = 0;
  for (let i = 0; i < objArray.length; i++) {
    if (objArray[i].cogs !== undefined) {
      if (objArray[i].cogs.toString().length > 0) {
        cogsCount++;
      }
    }
  }
  return cogsCount;
};

export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
