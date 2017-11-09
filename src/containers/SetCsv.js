import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, Label, Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import SweetAlert from 'sweetalert-react';
import Papa from 'papaparse';
import { getProductValue, exportCSVFile, headers, getCogsValue } from '../constants';
import { invokeApig } from '../libs/awsLib';
import '../styles/App.css';
import cogs2 from '../assets/cogs2.svg'

class SetCsv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopName: '',
            data: [],
            importedCSV: null,
            alertShow: false,
            cogsValueShow: false,
            totalProductCount: 0,
            selectedCogsValue: 0
        };
        this.goLanding = this.goLanding.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onSkip = this.onSkip.bind(this);
        this.csvButtonClicked = this.csvButtonClicked.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCogsConfirm = this.onCogsConfirm.bind(this);

    }

    componentDidMount() {
        if (localStorage.getItem('productInfo') === null) {
            this.products().then((results) => {
                var products = getProductValue(results);
                this.setState({ data: products });
                console.log(products);
                localStorage.setItem('productInfo', JSON.stringify(products));
            })
                .catch(error => {
                    console.log("get inventory error", error);
                });;
        } else {
            var existingProducts = JSON.parse(localStorage.getItem('productInfo'));
            this.setState({ data: existingProducts });
            console.log(existingProducts);
        }
    }

    componentWillMount() {

    }

    products() {
        return invokeApig({ path: "/inventory" });
    }

    goLanding() {
        this.props.history.push('/');
    }

    csvButtonClicked() {
        let { data } = this.state;
        exportCSVFile(headers, data, "inventory");
    }

    onDrop(files) {
        this.setState({
            importedCSV: files[0]
        });
    }

    onSkip() {
        this.setState({ alertShow: true });
    }

    onConfirm() {
        this.setState({ alertShow: false });
        this.props.history.push('/inventory');
    }

    onCogsConfirm() {
        this.setState({ cogsValueShow: false });
        this.props.history.push('/set-table');
    }

    onConnect() {
        let $this = this;
        let { importedCSV } = this.state;
        if (importedCSV !== null) {
            // this.props.history.push('/set-table');
            Papa.parse(importedCSV, {
                complete: function (results) {
                    let parsedData = results.data;
                    let updatedProducts = []
                    for (var i = 1; i < parsedData.length; i++) {
                        let oneProduct = {
                            title: parsedData[i][0],
                            variant: parsedData[i][1],
                            sku: parsedData[i][2],
                            price: parsedData[i][3],
                            cogs: parsedData[i][4],
                            image: parsedData[i][5],
                        }
                        updatedProducts.push(oneProduct);
                    }
                    localStorage.setItem('productInfo', JSON.stringify(updatedProducts));
                    let cogsCount = getCogsValue(updatedProducts);
                    $this.setState({
                        totalProductCount: parsedData.length - 1,
                        selectedCogsValue: cogsCount,
                        cogsValueShow: true
                    });

                }
            });
        }
    }

    render() {
        let { totalProductCount, selectedCogsValue } = this.state;
        let restProduct = totalProductCount - selectedCogsValue
        return (
            <div>
                <Grid className="login-layout">
                    <Row>
                        <Col md={12}>
                            <Col md={6} className="text-left padding-t-20">
                                <Label className="login-title">
                                    akko
                                </Label>
                            </Col>
                            <Col md={6} className="text-right padding-t-20">
                                <Button className="logout-button" onClick={this.goLanding} />
                            </Col>
                        </Col>
                    </Row>
                    <Row className="account-setup-header">
                        <span className="account-comment">
                            Account Setup
                        </span>
                    </Row>
                    <Row>
                        <Col md={6} mdOffset={3} className="center-view">
                            <div className="text-center margin-t-40">
                                <span className="select-style-text">
                                    Set COGS for your products
                                </span>
                            </div>
                            <div className="text-center margin-t-5">
                                <span className="select-style-comment">
                                    We will use these Cost of Goods Sold (COGS) estimates to calculate your gross profit
                                </span>
                            </div>
                            <div className="text-center margin-t-5">
                                <span className="select-style-comment-small">
                                    ( you can update these anytime from the Settings menu )
                                </span>
                            </div>
                            <div className="content-center margin-t-40">
                                <Col md={7} className="no-padding">
                                    <div>
                                        <div className="step-one-view">
                                            <span className="step-title">
                                                STEP 1:
                                            </span>
                                            <span className="step-content">
                                                &nbsp;Download CSV
                                            </span>
                                        </div>
                                        <div className="margin-t-20 text-center">
                                            <span className="step-content">
                                                We have pre-filled this CSV file with your SKUs. Just download the file, enter the COGS values and upload it.
                                            </span>
                                        </div>
                                        <div className="step-one-view margin-t-30">
                                            <span className="step-title">
                                                STEP 2:
                                            </span>
                                            <span className="step-content">
                                                &nbsp;Fill COGS values
                                            </span>
                                        </div>
                                        <div className="step-one-view margin-t-30">
                                            <span className="step-title">
                                                STEP 3:
                                            </span>
                                            <span className="step-content">
                                                &nbsp;Upload the finished CSV file
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={5} className="flex-right no-padding">
                                    <div className="style-icon-view">
                                        <Image src={cogs2} className="business-icon cursor-pointer" onClick={this.csvButtonClicked} />
                                    </div>
                                </Col>
                            </div>
                            <div className="margin-t-20">
                                <Dropzone
                                    accept="text/csv"
                                    onDrop={this.onDrop.bind(this)}
                                    className="drag-view"
                                >
                                    <span className="drag-text">
                                        drag and drop your finished CSV file here
                                    </span>
                                </Dropzone>
                            </div>
                            <div className="flex-center margin-t-20">
                                <span className="step-content">
                                    (or)
                                </span>
                            </div>
                            <div className="flex-center margin-t-20">
                                <Dropzone
                                    accept="text/csv"
                                    onDrop={this.onDrop.bind(this)}
                                    className="upload-csv-button"
                                >
                                    UPLOAD CSV
                                </Dropzone>

                            </div>
                            <div className="content-center margin-t-40">
                                <Col md={6} className="text-left no-padding">
                                    <Button className="skip-button" onClick={this.onSkip}>
                                        SKIP FOR NOW
                                    </Button>
                                </Col>
                                <Col md={6} className="text-right no-padding">
                                    <Button className="login-button" onClick={this.onConnect}>
                                        SUBMIT
                                    </Button>
                                </Col>
                            </div>
                        </Col>
                        <Col md={3} className="center-view">
                            <div className="description-view margin-t-40 text-center">
                                <span className="select-style-comment">
                                    COGS is the cost of buying one unit of the product from your vendor.
                                </span>
                            </div>
                            <div className="description-view margin-t-10 text-center">
                                <span className="select-style-comment">
                                    Do not include costs incurred when selling the product, like Shipping, Tax or Discounts.
                                </span>
                            </div>
                        </Col>
                    </Row>
                    <SweetAlert
                        show={this.state.alertShow}
                        showConfirmButton
                        showCancelButton
                        type="warning"
                        title="Confirm"
                        text="We cannot calculate Gross Profit figures without COGS information. You can also set/update these figures later from the Settings menu"
                        onConfirm={this.onConfirm}
                        onCancel={() => {
                            this.setState({ alertShow: false });
                        }}
                    />
                    <SweetAlert
                        show={this.state.cogsValueShow}
                        showConfirmButton
                        showCancelButton
                        type="success"
                        title="Confirm"
                        // text={"COGS set for ``99/110 products. 11 products are still missing COGS"}
                        text={"COGS set for" + selectedCogsValue + "/" + totalProductCount + " products." + restProduct + " products are still missing COGS"}
                        onConfirm={this.onCogsConfirm}
                        onCancel={() => {
                            this.setState({ cogsValueShow: false });
                        }}
                    />
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(SetCsv);