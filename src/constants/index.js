import Radium from 'radium';
import { headShake } from 'react-animations'

export const KEYS_TO_FILTERS = ['productDetail.title', 'stockOnHandUnits', 'stockOnHandValue.value', 'committedUnits', 'committedValue.value', 'availableForSaleUnits', 'availableForSaleValue.value']

export const validateEmail = (email) => {
    // eslint-disable-next-line max-len, no-useless-escape
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };

export const numberFormatter = (number) => {
    if(number > 999) {
        return (number/1000).toFixed(1) + 'K';
    }else if(number > 999999) {
        return (number/1000000).toFixed(1) + 'M';
    }else if (number > 999999999) {
        return (number/1000000000).toFixed(1) + 'M';
    }else {
        return number
    }
}

export const animationStyle = {
    headShake: {
      animation: 'x 1s',
      animationName: Radium.keyframes(headShake, 'headShake')
    }
}

export const convertInventoryJSONToObject = (inventoryJSON) => {
	var products = [];
	for(let i = 0; i < inventoryJSON.length; i++)
	{
        const currProduct = inventoryJSON[i];
		const productEntry = {
			id: currProduct.id,
			productDetail: currProduct.product_details,
			stockOnHandUnits: currProduct.inventory_details.in_stock_units,
            stockOnHandValue: {
                value: currProduct.inventory_details.in_stock_value,
                currency: currProduct.currency
            },
            committedUnits: currProduct.inventory_details.committed_units,
            committedValue: {
                value: currProduct.inventory_details.committed_value,
                currency: currProduct.currency
            },
            availableForSaleUnits: currProduct.inventory_details.available_units,
            availableForSaleValue: {
                value: currProduct.inventory_details.available_value,
                currency: currProduct.currency
            },
            title: currProduct.product_details.title,
            variant: currProduct.product_details.variant,
            sku: currProduct.product_details.sku,
            price: 100,
            cogs: 200
		}
		products.push(productEntry);
	}
	return products;
}

export const getProductValue = (inventoryJSON) => {
	var products = [];
	for(let i = 0; i < inventoryJSON.length; i++)
	{
        const currProduct = inventoryJSON[i];
		const productEntry = {
            title: currProduct.product_details.title,
            variant: currProduct.product_details.variant,
            sku: currProduct.product_details.sku,
            price: 100,
            cogs: "",
            image: currProduct.product_details.image,
		}
		products.push(productEntry);
	}
	return products;
}

export const headers = {
    title: "Title",
    variant: "Variant",
    sku: "SKU",
    price: "Price",
    cogs: "COGS",
    image: "Url"
};

export const convertToCSV = (objArray) => {
    var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

export const exportCSVFile = (headers, items, fileTitle) => {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export const getCogsValue = (objArray) => {
    let cogsCount = 0;
    for (var i = 0; i < objArray.length; i++) {
        console.log(objArray[i])
        if(objArray[i].cogs.toString().length > 0) {
            cogsCount++;
        }
    }
    return cogsCount;
}