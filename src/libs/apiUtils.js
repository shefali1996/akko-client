import swal from 'sweetalert2';
import { invokeApig } from '../libs/awsLib';
import * as api from '../redux/api';

const moment = require('moment');
const swalert = (status, response, data = {}) => {
  const errCode = response.status || '';
  const log = {
    message: `GET : ${status ? response.text() : response}`,
    log: `Error occured in ${data.path} on ${moment().format()} at window location ${window.location.href}`
  }
  swal({
    type:              'error',
    title:             `API Error ${errCode}`,
    html:              "Uh oh! Looks like you've found a bug in our code. We've collected some logs and will fix this as soon as possible. If you need any help in the meantime, please write to us at "+' <a href="mailto:help@akko.io"> help@akko.io</a>',
    allowOutsideClick: false,
    confirmButtonText: 'OK',
    focusConfirm:      false,
    onOpen: () => invokeApigWithoutErrorReport({
          path:   api.bugReport,
          method: 'POST',
          body:   log
      })
    })
};

export const invokeApigWithErrorReport = (params) => {
  return invokeApig(params)
    .then((results) => {
      if (results.status !== 200 && results.status !== 404) {
        swalert(true, results, params);
        throw new Error(results.text());
      }
      console.log('results', results);
      return results.json();
    }).catch((err) => {
      swalert(false, err, params);
    });
};

export const invokeApigWithoutErrorReport = (params) => {
  return invokeApig(params)
    .then((results) => {
      if (results.status !== 200 && results.status !== 404) {
        throw new Error(results.text());
      }
      console.log('results', results);
      return results.json();
    });
};
