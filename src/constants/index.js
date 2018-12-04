import Radium from 'radium';
import {isEmpty, find, isNull} from 'lodash';
import { validateCogsValue } from '../helpers/Csv';

// static constants
export const testMode = false;
export const pollingInterval = {lastUpdated: 30 * 1000, fetchStatusInterval: 5 * 1000, cogsStatus: 5 * 1000}; // seconds 30s
export const routeConstants = { signin: '/', signup: '/signup', forgotPassword: '/forgot-password', connectShopify: '/connect-shopify', setCogs: '/set-cogs', settings: '/settings', fetchStatus: '/fetch-status', dashboard: '/dashboard',explore: '/explore'};

export const routeExplore = {
  total_sales:'/total-sales',
  gross_profit:'/gross-profit',
  avg_margin:'/average-margin',
  number_of_orders:'/orders',
  avg_order_value: '/average-order-value'
};

export const exploreCard= {
  'total-sales':'total_sales',
  'gross-profit':'gross_profit',
  'average-margin':'avg_margin',
  'orders':'number_of_orders',
  'average-order-value':'avg_order_value'
}

export const exploreCardPathPattern = '^.*[/](.*)$'

export const KEYS_TO_FILTERS = ['productDetail.title', 'stockOnHandUnits', 'stockOnHandValue.value', 'committedUnits', 'committedValue.value', 'availableForSaleUnits', 'availableForSaleValue.value'];
export const KEYS_TO_METRICES = ['title', 'description', 'prefix', 'value', 'trend', 'trendValue', 'trendPeriod'];
export const plotByOptions = {time: 'Time', product: 'Product', categories: 'Categories', vendors: 'Vendors'};
export const KEYS_TO_FILTERS_VARIANTS = ['productTitle', 'variant.variantTitle', 'variant.variant', 'variant.variantSku'];
export const INVALID_COGS = 'invalid';
export const PRODUCT = 'product';
export const VARIANT = 'variant';
export const businessType = {dropshipper: 'one', reseller: 'two', manufacture: 'three', other: 'four'};
export const categoryOptions = {categories: 'Category', product: 'Product', variant: 'Variant', time: 'Time'};
export const vendorOptions = {vendors: 'Vendors', time: 'Time'}
export const fetchRoutes = [routeConstants.setCogs, routeConstants.dashboard, routeConstants.settings];
export const fetchStatusInterval = 10 * 1000;
export const METRICS_CARD = 'metrics_card';
export const bandwidthSize = 1.1;
export const maxBandWidth = 55;
export const Y_AXIS_LABEL_SPACE = 20;
export const dashboardGrid = {maxColumn: 4, maxColWidth: 320};
export const CsvTableHeaderRow = ['ID', 'Title', 'Variant', 'SKU', 'Price', 'COGS'];
export const defaultCogsRange = {start: '01-01-1800', end: '01-01-2200'};
export const RESPONSE_TEXT_MATRICS="Setting COGS is not completed for this store"
export const HAND_ON_TEXT="Hang on. We are importing your data and calculating all your metrics";
export const UPDATED_COGS_TEXT="We've updated your COGS and calculating your metrics";
//= ====================Set cogs column width ===================

export const getTableConstants = () => {
  const w_500 = {rowHeight: 25, select: 20, title: 0.25, variant: 0.13, sku: 0.13, price: 0.08, cogs: 0.09, marginPercent: 0.11, marginDoller: 0.11, expand: 0.10};
  const w_600 = {rowHeight: 35, select: 20, title: 0.25, variant: 0.13, sku: 0.13, price: 0.08, cogs: 0.09, marginPercent: 0.11, marginDoller: 0.11, expand: 0.10};
  const w_767 = {rowHeight: 35, select: 25, title: 0.25, variant: 0.13, sku: 0.13, price: 0.08, cogs: 0.09, marginPercent: 0.11, marginDoller: 0.11, expand: 0.10};
  const w_991 = {rowHeight: 40, select: 35, title: 0.22, variant: 0.12, sku: 0.12, price: 0.09, cogs: 0.10, marginDoller: 0.13, marginPercent: 0.13, expand: 0.10};
  const w_1100 = {rowHeight: 45, select: 35, title: 0.22, variant: 0.13, sku: 0.13, price: 0.09, ogs: 0.09, marginDoller: 0.12, marginPercent: 0.12, expand: 0.10};
  const w_1300 = {rowHeight: 45, select: 35, title: 0.22, variant: 0.13, sku: 0.13, price: 0.09, cogs: 0.09, marginDoller: 0.11, marginPercent: 0.11, expand: 0.10};
  let colWidth = {rowHeight: 45, select: 35, title: 0.25, variant: 0.13, sku: 0.13, price: 0.09, cogs: 0.09, marginPercent: 0.11, marginDoller: 0.11, expand: 0.09};

  if (screen.width <= 500) {
    colWidth = w_500;
  } else if (screen.width <= 600) {
    colWidth = w_600;
  } else if (screen.width <= 767) {
    colWidth = w_767;
  } else if (screen.width <= 991) {
    colWidth = w_991;
  } else if (screen.width <= 1100) {
    colWidth = w_1100;
  } else if (screen.width <= 1300) {
    colWidth = w_1300;
  }
  return colWidth;
};
// ====================COGS calcutating formulas===============
export const getCogsFromMarginDoller = (price, marginDoller) => (price - marginDoller).toFixed(2);
export const getCogsFromMarginPercent = (price, marginPercent) => (price / (1 + (marginPercent / 100))).toFixed(2);
export const getMarginPercentFromCogs = (price, cogs) => ((price - cogs) * 100 / cogs).toFixed(2);
export const getMarginDollerFromCogs = (price, cogs) => (price - cogs).toFixed(2);

// static functions


export const numberFormatter = (number) => {
  if (number > 999999999) {
    return `${(number / 1000000000).toFixed(1)}B`;
  }
  else if (number > 999999) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  else if (number > 999) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  else {
    return number;
  }
};

export const getProductValue = (productsJSON) => {
  const products = [];
  for (let i = 0; i < productsJSON.length; i++) {
    const currProduct = productsJSON[i];
    if (currProduct.rowType === VARIANT) {
      const productEntry = {
        id:      currProduct.id || null,
        title:   currProduct.productTitle || null,
        variant: currProduct.variant.variantTitle || null,
        sku:     currProduct.variant.variantSku || null,
        price:   currProduct.variant.price || null,
        cogs:    currProduct.cogs || currProduct.variant.cogs || null
      };
      products.push(productEntry);
    }
  }
  return products;
};

export const headers = {
  id:      CsvTableHeaderRow[0],
  title:   CsvTableHeaderRow[1],
  variant: CsvTableHeaderRow[2],
  sku:     CsvTableHeaderRow[3],
  price:   CsvTableHeaderRow[4],
  cogs:    CsvTableHeaderRow[5]
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
export const isCogsInvalid = (cogs) => {
  return isEmpty(cogs) || isNull(cogs) || cogs === INVALID_COGS || cogs <= 0;
};
