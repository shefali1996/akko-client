import {remove, isEmpty, indexOf} from 'lodash';

function beautifyUploadedCsvData(data) {
  const emptyCogsData = [];
  const nonEmptyCogsData = [];
  const finalCsvData = [];
  data.forEach((row, index) => {
    if (index !== 0) {
      const rowData = {
        id: row[0],
        variant: row[1],
        title: row[2],
        sku: row[3],
        price: row[4],
        cogs: row[5],
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
  const cogsValidateStatus = validateCogsValue(cogs, product.productDetail.price);
  products.forEach((p) => {
    if (product.id === p.id) {
      p.cogs = '';
      p.productDetail.cogs = '';
      if (cogsValidateStatus === true) {
        p.cogs = cogs;
        p.productDetail.cogs = cogs;
      }
      p.cogsValidateStatus = cogsValidateStatus;
    }
    updatedProducts.push(p);
  });
  return updatedProducts;
}

function updateLocalInventoryInfo(products) {
  localStorage.setItem('inventoryInfo', JSON.stringify(products));
}

function beautifyDataForCogsApiCall(data) {
  const variants = [];
  data.forEach((row, index) => {
    const newRow = {
      variantId: row.id,
      cogs: row.cogs
    };
    variants.push(newRow);
  });
  return {
    variants
  };
}

function moveAcceptedToBottom(data, row) {
  const updatedRow = data.splice(indexOf(data, row), 1)[0];
  if (row && !isEmpty(row.cogs)) {
    data.push(updatedRow);
  } else if (row && isEmpty(row.cogs)) {
    data.unshift(updatedRow);
  }
  return data;
}

function sortByCogs(data) {
  return data.sort((itemA, itemB) => {
    if (itemA.cogsValidateStatus === true) {
      return 1;
    }
    if (itemB.cogsValidateStatus === true) {
      return -1;
    }
    return 0;
  });
}

export {
  beautifyUploadedCsvData,
  validateCogsValue,
  checkAndUpdateProductCogsValue,
  updateLocalInventoryInfo,
  beautifyDataForCogsApiCall,
  moveAcceptedToBottom,
  sortByCogs
};
