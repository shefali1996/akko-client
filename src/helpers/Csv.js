import {remove, isEmpty, indexOf, findIndex, isEqual} from 'lodash';
import toastr from 'toastr';
import { invokeApig } from '../libs/awsLib';
import {tipBoxMsg} from '../components/TipBox';
import {CsvTableHeaderRow, businessType, getCogsFromMarginDoller, getCogsFromMarginPercent, getMarginPercentFromCogs, getMarginDollerFromCogs, defaultCogsRange, VARIANT } from '../constants';

function beautifyUploadedCsvData(data, tableData) {
  const allCsvData = [];
  const updatedCogsCsv = [];
  const error = {schema: false, noMatchingRows: true, unchangedFile: true};
  data.forEach((row, index) => {
    if (index === 0) {
      error.schema = !isEqual(row, CsvTableHeaderRow) && 'Invalid table data format';
    } else {
      const rowData = {
        id:      row[0],
        title:   row[1],
        variant: row[2],
        sku:     row[3],
        price:   row[4],
        cogs:    row[5],
      };
      const rowIndex = tableData.findIndex((r) => { return r.id === rowData.id; });
      if (rowIndex !== -1) {
        error.noMatchingRows = false;
        const row = tableData[rowIndex];
        const cogs = row.cogs ? row.cogs : row.variant.cogs;
        if (!isEqual(Number(cogs), Number(rowData.cogs))) {
          error.unchangedFile = false;
          updatedCogsCsv.push(rowData);
        }
      }
      allCsvData.push(rowData);
    }
  });
  return {
    csvData: allCsvData,
    updatedCogsCsv,
    error
  };
}

function validateCogsValue(cogs, price) {
  let ret = 'Empty COGS';
  if (cogs.toString().length === 0 || cogs.toString() === 'null') {
    ret = 'Empty COGS';  
  } else {
    cogs = Number(cogs);
    price = Number(price);
    if (cogs > 0) {
      if (cogs <= price) {
        ret = true;
      }
      if (cogs > price) {
        ret = 'COGS > Price and this will lead to loss on sales';
      }
    } else {
      ret = 'Invalid entry';
    }
  }
  return ret;
}

function updatedCogsValue(cogs, product, products) {
  const cogsValidateStatus = validateCogsValue(cogs, product.variant.price);
  const index = findIndex(products, {id: product.id});
  if (index > -1) {
    const p = products[index];
    if (cogsValidateStatus === true) {
      p.cogs = cogs;
      p.variant.cogs = cogs;
    }
  }
  return products;
}

function beautifyDataForCogsApiCall(data) {
  const variants = [];
  const tData = [];
  let numInvalidCogs = 0;
  data.forEach((row, index) => {
    if (row.rowType === VARIANT) {
      const cogs = row.variant.cogs;
      row.cogs = cogs;
      const isValid = validateCogsValue(cogs, row.variant.price);
      if (isValid === true) {
        const newRow = {
          variantId: row.variant.variantId,
          productId: row.productId,
          cogs,
          startDate: defaultCogsRange.start,
          endDate:   defaultCogsRange.end
        };
        variants.push(newRow);
      } else {
        numInvalidCogs += 1;
      }
    }
    tData.push(row);
  });
  return {
    variants,
    numInvalidCogs,
    tData
  };
}

function sortByCogs(data) {
  return data.sort((itemA, itemB) => {

    if (itemA.variant_details.cogs !== null && itemA.variant_details.cogs !== 'null' && itemA.variant_details.cogs !== 'invalid') {
      return 1;
    }
    if (itemB.variant_details.cogs !== null && itemB.variant_details.cogs !== 'null' && itemB.variant_details.cogs !== 'invalid') {
      return -1;
    }
    return 0;
  });
}

const hasClass = function (elem, className) {
  return new RegExp(` ${className} `).test(` ${elem.className} `);
};

function getProduct(update) {
  return new Promise((resolve, reject) => {
    if (localStorage.getItem('productInfo')) {
      resolve(JSON.parse(localStorage.getItem('productInfo')));
    } else {
      invokeApig({ path: '/products' }).then((results) => {
        localStorage.setItem('productInfo', JSON.stringify(results));
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    }
  });
}
function parseVariants(variants) {
  let list = [];
  variants.map((val, i) => {
    list = list.concat(val.variants);
  });
  return list;
}

function getTipBoxMessage(type) {
  let tipMessage = '';
  if (type === businessType.dropshipper) {
    tipMessage = tipBoxMsg.dropshipper;
  } else if (type === businessType.reseller) {
    tipMessage = tipBoxMsg.reseller;
  } else if (type === businessType.manufacture) {
    tipMessage = tipBoxMsg.manufacture;
  } else if (type === businessType.other) {
    tipMessage = tipBoxMsg.default;
  }
  return tipMessage;
}

function isCogsPending(variants) {
  if (variants && !isEmpty(variants)) {
    const v = _.find(variants, (o) => { return isEmpty(o.variant_details.cogs) || o.variant_details.cogs === 'null' || o.variant_details.cogs === null || o.variant_details.cogs === 'invalid'; });
    if (v) {
      return true;
    }
    return false;
  }
  return 'undefined';
}

const updateProgress = (cogs, row, progress) => {
  let {total, pending, completed} = progress;
  const oldCogs = validateCogsValue(row.variant.cogs, row.variant.price);
  const newCogs = validateCogsValue(cogs, row.variant.price);
  let i = 0;
  if (oldCogs !== true && newCogs === true) {
    i = 1;
  } else if (oldCogs === true && newCogs !== true) {
    i = -1;
  }
  completed += i;
  pending = total - completed;
  return {total, pending, completed};
};

const updateMarginDoller = (markup, row, tableData, progress) => {
  const rowIndex = findIndex(tableData, { id: row.id });
  let isValid = true;
  if (row.variant && rowIndex !== -1) {
    let previousMargin = 0;
    const cogsValue = row.variant.cogs;
    const priceValue = row.variant.price;

    if (validateCogsValue(cogsValue, priceValue) === true) {
      previousMargin = getMarginDollerFromCogs(priceValue, cogsValue);
    }
    if (previousMargin !== Number(markup)) {
      const cogs = getCogsFromMarginDoller(priceValue, markup);
      const marginPercent = getMarginPercentFromCogs(priceValue, cogs);
      progress = updateProgress(cogs, row, progress);
      tableData[rowIndex].marginPercent = marginPercent;
      tableData[rowIndex].cogs = cogs;
      tableData[rowIndex].variant.cogs = cogs;
      if (validateCogsValue(cogs, priceValue) !== true) {
        isValid = false;
      }
    }
    tableData[rowIndex].marginDoller = markup;
  }
  return {tableData, progress, isValid};
};
const updateMarginPercent = (markup, row, tableData, progress) => {
  const rowIndex = findIndex(tableData, { id: row.id });
  let isValid = true;
  if (row.variant && rowIndex !== -1) {
    let previousMargin = 0;
    const cogsValue = row.variant.cogs;
    const priceValue = row.variant.price;
    if (validateCogsValue(cogsValue, priceValue) === true) {
      previousMargin = getMarginPercentFromCogs(priceValue, cogsValue);
    }
    if (previousMargin !== Number(markup)) {
      const cogs = getCogsFromMarginPercent(priceValue, markup);
      const marginDoller = getMarginDollerFromCogs(priceValue, cogs);
      progress = updateProgress(cogs, row, progress);
      tableData[rowIndex].marginDoller = marginDoller;
      tableData[rowIndex].cogs = cogs;
      tableData[rowIndex].variant.cogs = cogs;
      if (validateCogsValue(cogs, priceValue) !== true) {
        isValid = false;
      }
    }
    tableData[rowIndex].marginPercent = markup;
  }
  return {tableData, progress, isValid};
};
const updateCogs = (cogs, row, tableData, progress) => {
  let isValid = true;
  const rowIndex = findIndex(tableData, { id: row.id });
  const cogsValue = row.variant.cogs;
  const priceValue = row.variant.price;
  if (cogsValue !== cogs && rowIndex !== -1) {
    const marginDoller = getMarginDollerFromCogs(priceValue, cogs);
    const marginPercent = getMarginPercentFromCogs(priceValue, cogs);
    progress = updateProgress(cogs, row, progress);
    
    if (validateCogsValue(cogs, priceValue) !== true) {
      isValid = false;
    }
    if(isValid){
      tableData[rowIndex].marginDoller = marginDoller;
      tableData[rowIndex].marginPercent = marginPercent;
      tableData[rowIndex].cogs = cogs;
      tableData[rowIndex].variant.cogs = cogs;
    } else{
      tableData[rowIndex].marginDoller = marginDoller;
      tableData[rowIndex].marginPercent = marginPercent;
      tableData[rowIndex].cogs = -1;
      tableData[rowIndex].variant.cogs = -1;
    }
    
  }
  return {tableData, progress, isValid};
};

export {
  beautifyUploadedCsvData,
  validateCogsValue,
  beautifyDataForCogsApiCall,
  sortByCogs,
  hasClass,
  getProduct,
  parseVariants,
  getTipBoxMessage,
  isCogsPending,
  updatedCogsValue,
  updateProgress,
  updateMarginDoller,
  updateMarginPercent,
  updateCogs
};
