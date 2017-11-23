function beautifyUploadedCsvData(data){
  let emptyCogsData = [];
  let nonEmptyCogsData = [];
  let finalCsvData = []
  data.forEach((row, index) => {
    if (index !== 0) {
      let rowData = {
        "id": row[0],
        "variant": row[1],
        "title": row[2],
        "sku": row[3],
        "price": row[4],
        "cogs": row[5],
      }
      if (rowData.cogs !== "") {
        nonEmptyCogsData.push(rowData);
      } else {
        emptyCogsData.push(rowData);
      }
      finalCsvData.push(rowData)
    }
  })
  return {
    csvData: finalCsvData,
    emptyCogsData: emptyCogsData,
    nonEmptyCogsData: nonEmptyCogsData
  }
}

function validateCogsValue( cogs, price ){
  let ret = "Empty COGS"; 
  if(cogs.toString().length === 0 || cogs.toString() === 'null'){
    ret = "Empty COGS"; 
  }else{
    cogs = Number(cogs);
    price = Number(price);
    if( cogs > 0 ){
      if( cogs <= price ){
        ret = true;  
      }
      if( cogs > price ){
        ret = cogs + " - COGS > Price and this will lead to loss on sales";
      }
    }else{
      ret = "Invalid entry";
    }
  }
  return ret;
}

function checkAndUpdateProductCogsValue( cogs, product, products ){
  let updatedProducts = [];
  let cogsValidateStatus = validateCogsValue( cogs , product.productDetail.price );
  products.forEach((p)=>{
    if( product.id ===  p.id ){
      p.cogs = "";
      p.productDetail.cogs = "";
      if(cogsValidateStatus===true){
        p.cogs = cogs;
        p.productDetail.cogs = cogs;
      }
      p.cogsValidateStatus = cogsValidateStatus;
    }
    updatedProducts.push(p);
  })
  return updatedProducts
}

export{
  beautifyUploadedCsvData,
  validateCogsValue,
  checkAndUpdateProductCogsValue
}