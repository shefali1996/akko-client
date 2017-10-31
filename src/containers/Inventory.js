import React, { Component } from 'react';
import {Grid, Row, Col, Tabs, Tab, Image, Label} from 'react-bootstrap';
import {connect} from 'react-redux';
import SearchInput, {createFilter} from 'react-search-input'
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import _ from 'underscore';
import Navigationbar from '../components/Navigationbar';
import Footer from '../components/Footer';
import Checkbox from '../components/Checkbox';
import {KEYS_TO_FILTERS} from '../constants';
import { invokeApig } from '../libs/awsLib';

import '../styles/App.css';
import '../styles/react-search-input.css'
import '../styles/react-bootstrap-table.min.css'
import '../styles/customMultiSelect.css'
import plus from '../assets/plus.svg'
import merge from '../assets/merge.svg'
import deleteIcon from '../assets/delete.svg'
import sort from '../assets/sort.svg'
import inversesort from '../assets/inversesort.svg'

function getCaret(direction) {
	if (direction === 'asc') {
	  return (
		<Image src={sort} className="sort-icon" />
	  );
	}
	if (direction === 'desc') {
	  return (
		<Image src={inversesort} className="sort-icon" />
	  );
	}
	return (
	  <Image src={sort} className="sort-icon" />
	);
}

function convertInventoryJSONToObject(inventoryJSON){
	var products = [];
	for(let i = 0; i < inventoryJSON.length; i++)
	{
        const currProduct = inventoryJSON[i];
		const productEntry = {
			id: currProduct.id,
			productDetail: currProduct.product_details,
			stockOnHandUnits: currProduct.inventory_details.in_stock_units,
            stockOnHandValue: currProduct.inventory_details.in_stock_value,
            committedUnits: currProduct.inventory_details.committed_units,
            committedValue: currProduct.inventory_details.committed_value,
            availableForSaleUnits: currProduct.inventory_details.available_units,
            availableForSaleValue: currProduct.inventory_details.available_value,
		}
		products.push(productEntry);
	}
	return products;
}

class Inventory extends Component {
	constructor(props) {
		super(props);
		this.state = {
            data: [],
            searchTerm: ''
		};
		this.handleSelect = this.handleSelect.bind(this);
		this.searchUpdated = this.searchUpdated.bind(this);
        this.onFocus = this.onFocus.bind(this);
	}

    componentWillMount() {
		
    }
    
	async componentDidMount() {
		try {
            if(localStorage.getItem('inventoryInfo') === null ) {
                const results = await this.products();
                var products = convertInventoryJSONToObject(results);
                this.setState({ data: products });
                localStorage.setItem('inventoryInfo', JSON.stringify(products));
            }else {
                var existingProducts = JSON.parse(localStorage.getItem('inventoryInfo'));
                this.setState({ data: existingProducts });
            }
		} catch (e) {
            console.log(e)
		}
	}

	products() {
		return invokeApig({ path: "/inventory" });
	}

	handleSelect(key) {
		if(key === 1){
			this.props.history.push('/channels');
		}else if(key === 2){
			this.props.history.push('/inventory');
		}else{
			this.props.history.push('/orders');
		}
	}

	searchUpdated(term) {
        this.setState({
            searchTerm: term
        })
	}

	onFocus() {

	}

	customMultiSelect(props) {
        const { type, checked, disabled, onChange, rowIndex } = props;
		if (rowIndex === 'Header') {
		  return (
			<div className='checkbox-personalized'>
                <Checkbox {...props}/>
                <label htmlFor={ 'checkbox' + rowIndex }>
                    <div className='check'></div>
                </label>
			</div>);
		} else {
		    return (
                <div className='checkbox-personalized'>
                    <input
                        type={ type }
                        name={ 'checkbox' + rowIndex }
                        id={ 'checkbox' + rowIndex }
                        checked={ checked }
                        disabled={ disabled }
                        onChange={ e=> onChange(e, rowIndex) }
                        ref={ input => {
                            if (input) {
                                input.indeterminate = props.indeterminate;
                            }
                        } }
                    />
                    <label htmlFor={ 'checkbox' + rowIndex }>
                        <div className='check'></div>
                    </label>
                </div>
            );
		}
	}

	createCustomInsertButton(openModal) {
		return (
			<div className="add-button" onClick={openModal}>
				<Image src={plus} className="plus-icon" />
				<Label className="button-text">
					ADD NEW
				</Label>
			</div>
		);
	}

	createCustomDeleteButton(openModal) {
		return (
			<div className="delete-button" onClick={openModal}>
				<Image src={deleteIcon} className="plus-icon" />
				<Label className="button-text">
					DELETE
				</Label>
			</div>
		);
	}

	createCustomExportCSVButton(openModal) {
		return (
			<div className="merge-button" onClick={openModal}>
				<Image src={merge} className="plus-icon" />
				<Label className="button-text">
					MERGE
				</Label>
			</div>
		);
	}

	renderSizePerPageDropDown(props) {
		return (
		  <div className='btn-group'>
			{
                [ 10, 25, 30 ].map((n, idx) => {
                    const isActive = (n === props.currSizePerPage) ? 'active' : null;
                    return (
                        <button key={ idx } type='button' className={ `btn btn-info ${isActive}` } onClick={ () => props.changeSizePerPage(n) }>{ n }</button>
                    );
                })
			}
		  </div>
		);
	}

	renderPaginationPanel(props) {
		return (
			<div className="pageList-style">
				{ props.components.pageList }
			</div>
		);
	}

	createCustomButtonGroup(props) {
		return (
		  <ButtonGroup className='button-group-custom-class' sizeClass='btn-group-md'>
				<div className='left-button-view'>
					{ props.insertBtn }
				</div>
				<div className='right-button-view'>
					{ props.exportCSVBtn }
					{ props.deleteBtn }
				</div>
		  </ButtonGroup>
		);
	}

	createCustomToolBar(props) {
		return (
            <div style={ { margin: '15px' } }>
                { props.components.btnGroup }
            </div>
		);
    }
    
    productCellFormatter(cell, row) {
        return (
            <div className="product-data-cell">
                <div className="productImage">
                    <img style={{width:70}} src={cell.image} alt="thumb"/>
                </div>
                <div className="product-custom-title">
                    <span className="productName">{cell.title}</span>
                    <span className="variantTitle">{cell.variant}</span>
                    <span className="channelNumberText"></span>
                </div>
            </div>
        )
    }
    
    cellUnitFormatter(cell, row) {
        return (
            <div className="stock-on-hand-cell">
                { cell}
            </div>
        )
    }
    
    cellValueFormatter(cell, row) {
        return (
            <div className="stock-on-hand-cell">
                ${ Math.round(cell * 100) / 100 }
            </div>
        )
    }

    sortByTitle(a, b, order) {   // order is desc or asc
        let ascVal = a.productDetail.title.localeCompare(b.productDetail.title);
        return order === 'asc' ? ascVal : -ascVal;
    }

    sortByStockUnit(a, b, order) {   // order is desc or asc
        if (order === 'desc') {
            return a.stockOnHand.units - b.stockOnHand.units;
        } else {
            return b.stockOnHand.units - a.stockOnHand.units;
        }
    }

    sortByCommitUnit(a, b, order) {
        if (order === 'desc') {
            return a.committed.units - b.committed.units;
        } else {
            return b.committed.units - a.committed.units;
        }
    }

    sortBySaleUnit(a, b, order) {
        if (order === 'desc') {
            return a.availableForSale.units - b.availableForSale.units;
        } else {
            return b.availableForSale.units - a.availableForSale.units;
        }
    }

    renderStockUnitsHeader() {
        return(
            <div className="text-right">
                Stock on
            </div>
        );
    }

    renderStockValueHeader() {
        return(
            <div className="text-left">
                Hand
            </div>
        );
    }   

    renderCommitUnitsHeader() {
        return(
            <div className="text-right">
                Commi
            </div>
        );
    }

    renderCommitValueHeader() {
        return(
            <div className="text-left">
                tted
            </div>
        );
    }

    renderSaleUnitsHeader() {
        return(
            <div className="text-right">
                Available
            </div>
        );
    }

    renderSaleValueHeader() {
        return(
            <div className="text-left">
                for Sale
            </div>
        );
    }

	render() {
        let {data, searchTerm} = this.state
        const filteredData = data.filter(createFilter(searchTerm, KEYS_TO_FILTERS))
		const selectRowProp = {
			mode: 'checkbox',
            customComponent: this.customMultiSelect,
            clickToSelect: true
		};
		const options = {
			insertBtn: this.createCustomInsertButton,
			deleteBtn: this.createCustomDeleteButton,
			exportCSVBtn: this.createCustomExportCSVButton,
			sizePerPageDropDown: this.renderSizePerPageDropDown,
			paginationPanel: this.renderPaginationPanel,
			btnGroup: this.createCustomButtonGroup,
			toolBar: this.createCustomToolBar,
			paginationSize: 7,
			prePage: '«   Previous',
			nextPage: 'Next   »',
            withFirstAndLast: false,
            sortIndicator: false
        };
		return (
			<div>
				<Navigationbar history={this.props.history}/>
				<Grid className="inventory-container no-padding">
					<Row className="no-margin min-height custom-shadow">
						<Tabs defaultActiveKey={2} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
							<Tab eventKey={1} title="Channels">
							</Tab>
							<Tab eventKey={2} title="Inventory">
								<div className="padding-left-right-100">
									<Row className="padding-50">
										<Col md={3} className="no-left-padding">
											<div className="white-view">
											</div>
										</Col>
										<Col md={3} className="no-left-padding">
											<div className="white-view">
											</div>
										</Col>
										<Col md={3} className="no-left-padding">
											<div className="white-view">
											</div>
										</Col>
										<Col md={3} className="no-right-padding no-left-padding">
											<div className="white-view">
											</div>
										</Col>
									</Row>
									<Row className="padding-left-right-50">
										<Col md={6} mdOffset={3}>
											<SearchInput
												className="search-input"
												placeholder="Search all your inventory"
												onChange={this.searchUpdated}
												onFocus={this.onFocus}
											/>
										</Col>
									</Row>
									<Row className="padding-50">
										<BootstrapTable
											data={ filteredData }
											options={ options }
											insertRow={ true }
											deleteRow={ true }
											exportCSV={ true }
											bordered={ false }
											selectRow={ selectRowProp }
											pagination
											trClassName="custom-table"
										>
                                            <TableHeaderColumn
												isKey
												dataField='id'
												dataAlign="center"
												dataSort
												className="custom-table-header"
												caretRender={ getCaret }
                                                hidden={true}
											>
												ID
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField='productDetail'
												dataAlign="center"
												dataSort
												className="custom-table-header"
												caretRender={ getCaret }
                                                dataFormat={ this.productCellFormatter }
                                                sortFunc={ this.sortByTitle }
                                                width='40%'
											>
												Product
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField='stockOnHandUnits'
												dataAlign="center"
                                                dataSort
												className="custom-table-header"
                                                caretRender={ getCaret }
                                                dataFormat={ this.cellUnitFormatter }
											>
                                                {this.renderStockUnitsHeader()}
                                                Units
											</TableHeaderColumn>
                                            <TableHeaderColumn
												dataField='stockOnHandValue'
												dataAlign="center"
                                                dataSort
												className="custom-table-header"
                                                caretRender={ getCaret }
                                                dataFormat={ this.cellValueFormatter }
											>
                                                {this.renderStockValueHeader()}
                                                $
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField='committedUnits'
												dataAlign="center"
                                                dataSort
												className="custom-table-header"
                                                caretRender={ getCaret }
                                                dataFormat={ this.cellUnitFormatter }
											>
                                                {this.renderCommitUnitsHeader()}
                                                Units
											</TableHeaderColumn>
                                            <TableHeaderColumn
												dataField='committedValue'
												dataAlign="center"
                                                dataSort
												className="custom-table-header"
                                                caretRender={ getCaret }
                                                dataFormat={ this.cellValueFormatter }
											>
                                                {this.renderCommitValueHeader()}
                                                $
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField='availableForSaleUnits'
												dataAlign="center"
                                                dataSort
												className="custom-table-header"
                                                caretRender={ getCaret }
                                                dataFormat={ this.cellUnitFormatter }
											>
                                                {this.renderSaleUnitsHeader()}
                                                Units
											</TableHeaderColumn>
                                            <TableHeaderColumn
												dataField='availableForSaleValue'
												dataAlign="center"
                                                dataSort
												className="custom-table-header"
                                                caretRender={ getCaret }
                                                dataFormat={ this.cellValueFormatter }
											>
                                                {this.renderSaleValueHeader()}
                                                $
											</TableHeaderColumn>
										</BootstrapTable>
									</Row>
								</div>
							</Tab>
							<Tab eventKey={3} title="Orders">
							</Tab>
						</Tabs>
					</Row>
				</Grid>
                <Footer/>
			</div>
		);
	}
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(Inventory);
