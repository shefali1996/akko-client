import React, { Component } from 'react';
import {Grid, Row, Col, Tabs, Tab, Image, Label} from 'react-bootstrap';
import {connect} from 'react-redux';
import SearchInput, {createFilter} from 'react-search-input'
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
// import { makeData } from "../components/Utils";
import Navigationbar from '../components/Navigationbar';
import Footer from '../components/Footer';
import Checkbox from '../components/Checkbox';
import {KEYS_TO_FILTERS} from '../constants';
import '../styles/App.css';
import '../styles/react-search-input.css'
import '../styles/react-bootstrap-table.min.css'
import '../styles/customMultiSelect.css'
import plus from '../assets/plus.svg'
import merge from '../assets/merge.svg'
import deleteIcon from '../assets/delete.svg'
import sort from '../assets/sort.svg'
import inversesort from '../assets/inversesort.svg'
import { invokeApig } from '../libs/awsLib';

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
			id: currProduct.productId,
			productTitle: currProduct.productTitle,
			stockOnHand: currProduct.stock,
			committed: currProduct.committed,
			availableForSale: currProduct.available_for_sale,
			shopId: currProduct.shopId,
			variantTitle: currProduct.variantTitle
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

	async componentDidMount() {
		try {
			const results = await this.products();
			var products = convertInventoryJSONToObject(results);
			this.setState({ data: products });
		} catch (e) {
			alert(e);
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
				} }/>
			  <label htmlFor={ 'checkbox' + rowIndex }>
				<div className='check'></div>
			  </label>
			</div>);
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

	render() {
        let {data, searchTerm} = this.state
        const filteredData = data.filter(createFilter(searchTerm, KEYS_TO_FILTERS))
		const selectRowProp = {
			mode: 'checkbox',
			customComponent: this.customMultiSelect
		};
		const options = {
			defaultSortName: 'productTitle',
			defaultSortOrder: 'desc',
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
			withFirstAndLast: false
		};
		return (
			<div>
				<Navigationbar history={this.props.history}/>
				<Grid className="inventory-container">
					<Row className="no-margin white-bg min-height custom-shadow">
						<Tabs defaultActiveKey={2} id="uncontrolled-tab-example" className="inventory-tab" onSelect={this.handleSelect}>
							<Tab eventKey={1} title="Channels">
							</Tab>
							<Tab eventKey={2} title="Inventory">
								<div className="padding-50">
									<Row className="margin-t-30">
										<Col md={3}>
											<div className="gray-view">
											</div>
										</Col>
										<Col md={3}>
											<div className="gray-view">
											</div>
										</Col>
										<Col md={3}>
											<div className="gray-view">
											</div>
										</Col>
										<Col md={3}>
											<div className="gray-view">
											</div>
										</Col>
									</Row>
									<Row className="margin-t-30">
										<Col md={3}>
										</Col>
										<Col md={6}>
											<SearchInput
												className="search-input"
												placeholder="Search all your inventory"
												onChange={this.searchUpdated}
												onFocus={this.onFocus}
											/>
										</Col>
										<Col md={3}>
										</Col>
									</Row>
									<Row className="margin-t-30">
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
												dataField='productTitle'
												dataAlign="center"
												dataSort
												className="custom-table-header"
												caretRender={ getCaret }
											>
												Product
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField='stockOnHand'
												dataAlign="center"
												dataSort
												className="custom-table-header"
												caretRender={ getCaret }
											>
												Stock on Hand
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField='committed'
												dataAlign="center"
												dataSort
												className="custom-table-header"
												caretRender={ getCaret }
											>
												Committed
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField='availableForSale'
												dataAlign="center"
												dataSort
												className="custom-table-header"
												caretRender={ getCaret }
											>
												Available for Sale
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
