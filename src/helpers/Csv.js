import {remove, isEmpty, indexOf} from 'lodash';
import { invokeApig } from '../libs/awsLib';

function beautifyUploadedCsvData(data) {
  const emptyCogsData = [];
  const nonEmptyCogsData = [];
  const finalCsvData = [];
  data.forEach((row, index) => {
    if (index !== 0) {
      const rowData = {
        id:      row[0],
        variant: row[1],
        title:   row[2],
        sku:     row[3],
        price:   row[4],
        cogs:    row[5],
      };
      if (rowData.cogs !== '') {
        nonEmptyCogsData.push(rowData);
      } else {
        emptyCogsData.push(rowData);
      }
      finalCsvData.push(rowData);
    }
  });
  return {
    csvData: finalCsvData,
    emptyCogsData,
    nonEmptyCogsData
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

function checkAndUpdateProductCogsValue(cogs, product, products) {
  const updatedProducts = [];
  const cogsValidateStatus = validateCogsValue(cogs, product.variant_details.price);
  products.forEach((p) => {
    if (product.id === p.id) {
      p.cogs = '';
      p.variant_details.cogs = '';
      if (cogsValidateStatus === true) {
        p.cogs = cogs;
        p.variant_details.cogs = cogs;
      }
      p.cogsValidateStatus = cogsValidateStatus;
    }
    updatedProducts.push(p);
  });
  return updatedProducts;
}

function beautifyDataForCogsApiCall(data) {
  const variants = [];
  data.forEach((row, index) => {
    if (row.cogsValidateStatus === true) {
      const newRow = {
        variantId: row.id,
        cogs:      row.cogs
      };
      variants.push(newRow);
    }
  });
  return {
    variants
  };
}

function moveAcceptedToBottom(data, row) {
  const updatedRow = data.splice(indexOf(data, row), 1)[0];
  if (row && !isEmpty(row.variant_details.cogs)) {
    data.push(updatedRow);
  } else if (row && isEmpty(row.variant_details.cogs)) {
    data.unshift(updatedRow);
  }
  return data;
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

function isCogsPending() {
  const variants = JSON.parse(localStorage.getItem('variantsInfo'));
  if (variants) {
    const variantsList = parseVariants(variants);
    const v = _.find(variantsList, (o) => { return isEmpty(o.variant_details.cogs) || o.variant_details.cogs === 'null' || o.variant_details.cogs === null || o.variant_details.cogs === 'invalid'; });
    if (v) {
      return true;
    }
    return false;
  }
  return 'undefined';
}

export {
  beautifyUploadedCsvData,
  validateCogsValue,
  checkAndUpdateProductCogsValue,
  beautifyDataForCogsApiCall,
  moveAcceptedToBottom,
  sortByCogs,
  hasClass,
  getProduct,
  parseVariants,
  isCogsPending
};
