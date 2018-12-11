import React, { Component } from 'react';
import { Button, Row, Col, Label, FormControl, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Spin } from 'antd';
import toastr from 'toastr';
import {isEmpty, find, cloneDeep, filter, findIndex} from 'lodash';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import $ from 'jquery';
import {isNumeric, getProductValue, exportCSVFile, headers, PRODUCT, VARIANT, getCogsFromMarginDoller, getCogsFromMarginPercent, getMarginPercentFromCogs, getMarginDollerFromCogs} from '../constants';
import giveMoney from '../assets/images/give-money.svg';
import csvIconWhite from '../assets/images/csv-file-format-extension.svg';
import downloadIcon from '../assets/images/downloadIcon.svg';
import uploadIcon from '../assets/images/uploadicon.svg';
import MaterialIcon from '../assets/images/MaterialIcon.svg';
import {validateCogsValue, updateProgress, updateMarginDoller, updateMarginPercent, updateCogs, beautifyUploadedCsvData} from '../helpers/Csv';
import styles from '../constants/styles';

const moment = require('moment');

const marginPercent = 'marginPercent';
const marginDoller = 'marginDoller';

class MarkupAndCsv extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      tableData:           [],
      selectedRows:        [],
      numSelectedVariants: 0,
      selectedOption:      marginPercent,
      markup:              '',
      progress:            {total: 0, pending: 0, completed: 0},
      setMarkupInProgress: false,
      uploadCsvInProgress: false
    };
    this.openMarkup = this.openMarkup.bind(this);
    this.closeMarkup = this.closeMarkup.bind(this);
    this.openCsvUpload = this.openCsvUpload.bind(this);
    this.closeCsvUpload = this.closeCsvUpload.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }
  componentWillReceiveProps(props) {
    const {selectedRows, tableData, numSelectedVariants, progress} = props;
    this.setState({
      selectedRows,
      tableData,
      numSelectedVariants,
      progress
    });
  }
  componentDidMount() {
    $(window).resize(() => {
      const w = screen.width;
      const r = w < 768 ? 200 : 233;
      let right = r + (w - 600);
      if (right < 0) {
        right = 0;
      } else if (right > r) {
        right = r;
      }
      $('.set-markup').css('right', right);
    });
  }
  openMarkup() {
    this.closeCsvUpload();
    this.setState({
      openSetMarkup: true
    });
  }
  closeMarkup() {
    this.refs.markupError.hide();
    this.setState({
      openSetMarkup: false
    });
  }
  openCsvUpload() {
    this.closeMarkup();
    this.setState({
      openCsvUpload: true
    });
  }
  closeCsvUpload() {
    this.setState({
      openCsvUpload: false
    });
  }
  handleOptionChange(e) {
    this.setState({
      selectedOption: e.target.value
    });
  }
  onSetMarkup = () => {
    this.setState({setMarkupInProgress: true})
    const {markup, selectedRows, numSelectedVariants, selectedOption} = this.state;
    let {tableData, progress} = this.state;
    let error = false;
    if (isEmpty(markup)) {
      error = 'Empty value';
    } else if (!isNumeric(markup)) {
      error = 'Invalid value for Markup';
    } else if (markup < 0) {
      error = 'Markup cannot be negative';
    } else if (numSelectedVariants <= 0) {
      error = 'Select one or more products before setting markup';
    }
    let selfProps = this.props;
    let numInvalidCogs = 0;
    const t = this;
    setTimeout(function(){
      if (error === false) {
        selectedRows.forEach((id) => {
          const rowIndex = findIndex(tableData, { id });
          const row = cloneDeep(tableData[rowIndex]);
          if (row.rowType === VARIANT) {
            let newData = {};
            if (selectedOption === marginPercent) {
              newData = updateMarginPercent(markup, row, tableData, progress);
            } else {
              newData = updateMarginDoller(markup, row, tableData, progress);
            }
            if (!newData.isValid) {
              numInvalidCogs += 1;
            }
            progress = newData.progress;
            tableData = newData.tableData;
          }
        }) 
        selfProps.setMarkup(tableData);
          selfProps.updateprogress(progress);
          if (numInvalidCogs > 0) {
            toastr.error(`${numInvalidCogs} of your COGS entries are invalid. Those rows are marked in red.`);
          } else {
            t.setState({markup: '', setMarkupInProgress: false});
            selfProps.deSelectAllRows();
            t.closeMarkup();
          }
      } else {
        t.setState({markupError: error, setMarkupInProgress: false});
        t.refs.markupError.show();
    }}, 50)
  }
  csvButtonClicked = () => {
    exportCSVFile(headers, getProductValue(this.props.tableData), `variants_${moment().format('DD-MM-YYYY_HH:mm:ss')}`);
  }
  onDrop(files) {
    const $this = this;
    $this.setState({
      importedCSV,
      uploadCsvInProgress: true
    });
    const importedCSV = files[0];
    let {tableData, progress} = this.state;
    if (importedCSV) {
      Papa.parse(importedCSV, {
        complete(results) {
          setTimeout(()=>{
          let invalidCogsCount = 0;
          let cogsUpdatedCount = 0;
          const beautyData = beautifyUploadedCsvData(results.data, tableData);
          if (beautyData.error.schema) {
            $this.setState({uploadCsvInProgress: false});
            toastr.error('CSV data schema doesn\'t match. Please update COGS in the downloaded CSV without changing the other columns');
          } else if (beautyData.error.noMatchingRows || beautyData.error.unchangedFile) {
            $this.setState({uploadCsvInProgress: false});
            toastr.info('Couldn\'t find any new information from this file.');
          } else {
            beautyData.updatedCogsCsv.forEach((csvProduct) => {
              let newData = {};
              const rowIndex = findIndex(tableData, { id: csvProduct.id });
              if (rowIndex !== -1) {
                newData = updateCogs(csvProduct.cogs, tableData[rowIndex], tableData, progress);
                if (!newData.isValid) {
                  invalidCogsCount += 1;
                } else {
                  cogsUpdatedCount += 1;
                }
                progress = newData.progress;
                tableData = newData.tableData;
              }
            });
            if (cogsUpdatedCount > 0) {
              toastr.success(`COGS updated for ${cogsUpdatedCount} variants`);
            }
            if (invalidCogsCount > 0) {
              toastr.error(`${invalidCogsCount} COGS entries are invalid. Those rows are marked in red.`);
            }
            $this.props.setMarkup(tableData);
            $this.props.updateprogress(progress);
            $this.closeCsvUpload();
            $this.setState({uploadCsvInProgress: false});
          }
          },100)
        }
      });

    } else {
      this.setState({uploadCsvInProgress: false});
      toastr.error('Unexpected File Format. Only CSV is allowed');
    }
  }
  render() {
    const {selectedOption, openCsvUpload, numSelectedVariants, uploadCsvInProgress} = this.state;  
    return (
      <div style={{paddingTop: '10px', display: 'flow-root'}}>
        <div style={{float: 'right'}}>
          <Button className="cogs-page-button" onClick={this.openCsvUpload}>
            <div className="btn-icon">
              <Image src={csvIconWhite} />
            </div>
            BULK IMPORT FROM CSV
          </Button>
          <div className="csv-upload" style={{display: this.state.openCsvUpload ? 'block' : 'none'}}>
            <Col className="middle-box pull-left">
              <div className="product-cogs-text" style={{margin: '35px auto', width: '285px'}}>
            We have pre-filled this CSV file with your SKUs. Just download the file, enter the COGS values and upload it.
              </div>
            </Col>
            <Col className="right-box pull-right text-right">
              <div className="top-row">
                <Button className="close-button" onClick={this.closeCsvUpload} />
              </div>

              <div className="margin-t-25">
                <div className="cursor-pointer">
                  <Button className="login-button downloadCsv" onClick={this.csvButtonClicked}>
                    DOWNLOAD
                    <div style={{marginLeft: "27%", display: this.props.loading ? 'inline-block' : 'none'}}>
                      <Spin size="small" />
                    </div>
                    <div style={{marginLeft: "15%", display: this.props.loading === false ? 'inline-block' : 'none'}}>
                     <img style={{width:'20px', height:'20px'}} src={downloadIcon} />
                    </div>
                  </Button>
                </div>
                <Dropzone
                  accept="text/csv"
                  onDrop={this.onDrop.bind(this)} 
                  className="cursor-pointer"
                >
                  <Button className="login-button uploadCsv">
                    UPLOAD   
                    <div style={{ marginLeft: "27%",display: this.state.uploadCsvInProgress ? 'inline-block' : 'none'}}>
                      <Spin size="small" />
                    </div>

                    <div style={{marginLeft: "27%", display: this.state.uploadCsvInProgress === false ? 'inline-block' : 'none'}}>
                      <img style={{width:'20px', height:'20px'}} src={uploadIcon} />
                    </div>
                  </Button>
                </Dropzone>
              </div>
            </Col>
          </div>
        </div>
        <div style={{float: 'right', marginRight: 10}}>
          <Button className="cogs-page-button" onClick={this.openMarkup}>
            <div className="btn-icon">
              <Image src={giveMoney} />
            </div>
            SET MARKUP
          </Button>
          <div className="set-markup" style={{display: this.state.openSetMarkup ? 'block' : 'none'}}>
            <div className="top-row">
              <span className="select-style-comment-small">{numSelectedVariants ? `${numSelectedVariants} variants selected` : 'No variants selected'} </span>
              <Button className="close-button" onClick={this.closeMarkup} />
            </div>
            <div>
              <Col className="col-4 pull-left">
                <div className="flex-center padding-t-40 product-cogs-text">
                  <span style={{width: '10px'}}>{selectedOption === marginDoller ? '$' : ''}</span>
                  <OverlayTrigger
                    placement="left"
                    trigger="manual"
                    ref="markupError"
                    overlay={
                      <Tooltip id="tooltip"><img src={MaterialIcon} alt="icon" />{this.state.markupError}</Tooltip>
                      }>
                    <FormControl
                      type="number"
                      className="product-cogs-text"
                      style={styles.markupInputStyle}
                      value={this.state.markup}
                      onChange={(e) => this.setState({ markup: e.target.value })}
                      onFocus={() => this.refs.markupError.hide()}
                />
                  </OverlayTrigger>
                  <span style={{width: '10px'}}>{selectedOption === marginPercent ? '%' : ''}</span>
                </div>
              </Col>
              <Col className="col-4 pull-left">
                <div className="radio-wrapper">
                  <div className="radio">
                    <label className="select-style-comment-small">
                      <input type="radio" value={marginPercent} checked={selectedOption === marginPercent} onChange={this.handleOptionChange} />
                          Percentage
                    </label>
                  </div>
                  <div className="radio">
                    <label className="select-style-comment-small">
                      <input type="radio" value={marginDoller} checked={selectedOption === marginDoller} onChange={this.handleOptionChange} />
                      Fixed Markup
                    </label>
                  </div>
                </div>
              </Col>
              <Col className="col-4 pull-right text-right margin-t-25">
                <Button className="login-button" onClick={this.onSetMarkup}>
                  CONFIRM
                  <div style={{marginLeft: 10, display: this.state.setMarkupInProgress ? 'inline-block' : 'none'}}>
                    <Spin size="small" />
                  </div>
                </Button> 
              </Col>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarkupAndCsv;
