import swal from 'sweetalert2';
import { invokeApig } from '../libs/awsLib';
import * as api from '../redux/api';

const moment = require('moment');

const swalert = (status, response, data = {}) => {
  const errCode = response.status || '';
  const log = {
    message: `${data.path}:${data.method || 'GET'} - ${status ? response.text() : response}`,
    log:     `Error occured in ${data.path} on ${moment().format()} at window location ${window.location.href}`
  };
  swal({
    type:              'error',
    title:             `API Error ${errCode}`,
    html:              "Something unexpected has happened. Refreshing the page or trying again later should usually fix it. For further assistance, write to us at " + ' <a href="mailto:help@akko.io"> help@akko.io</a>',
    allowOutsideClick: false,
    confirmButtonText: 'OK',
    focusConfirm:      false,
    onOpen:            () => invokeApigWithoutErrorReport({
      path:   api.bugReport,
      method: 'POST',
      body:   log
    })
  });
};

const swalertWithoutReport = (status, response, data ={}) => {
  const errCode = response.status || '';  
  swal({
    type:              'error',
    title:             `API Error ${errCode}`,
    html:              "Uh oh! An error has occured. If you need any help in the meantime, please write to us at " + ' <a href="mailto:help@akko.io"> help@akko.io</a>',
    allowOutsideClick: false,
    confirmButtonText: 'OK',
    focusConfirm:      false
  })
}

export const invokeApigWithErrorReport = (params) => {  
  return invokeApig(params)
    .then((results) => {      
      if (results.status >= 500) {
        swalert(true, results, params);
        throw new Error(results.text());
      } else if(results.status !== 200 && results.status !== 404 && results.status !== 202){
        swalertWithoutReport(true, results, params);
      }
      if(params.method==="PUT"){
        return results
      }
      return results.json();
    }).catch((err) => {    
        swalert(false, err, params);
        throw new Error("some thing went wrong!");
    });
};

export const invokeApigWithoutErrorReport = (params) => {
  return invokeApig(params)
    .then(async (results) => {
      if (results.status !== 200 && results.status !== 404 && results.status !== 202) {
        const a = await results.json();
        throw new Error(a.originalMessage || 'Error');
      }
      return results.json();
    });
};
