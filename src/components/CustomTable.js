import React from 'react';
import { Image, Label } from 'react-bootstrap';
import Checkbox from '../components/Checkbox';

import sort from '../assets/sort.svg'
import inversesort from '../assets/inversesort.svg'
import plus from '../assets/plus.svg'
import merge from '../assets/merge.svg'
import deleteIcon from '../assets/delete.svg'
import '../styles/App.css';
import '../styles/react-search-input.css'
import '../styles/react-bootstrap-table.min.css'
import '../styles/customMultiSelect.css'

export const getCaret = (direction) => {
	if (direction === 'asc') {
	  return <Image src={sort} className="sort-icon" />;
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

export const customMultiSelect = (props) => {
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

export const createCustomInsertButton = (openModal) => {
    return (
        <div className="add-button" onClick={openModal}>
            <Image src={plus} className="plus-icon" />
            <Label className="button-text">
                ADD NEW
            </Label>
        </div>
    );
}

export const createCustomDeleteButton = (openModal) => {
    return (
        <div className="delete-button" onClick={openModal}>
            <Image src={deleteIcon} className="plus-icon" />
            <Label className="button-text">
                DELETE
            </Label>
        </div>
    );
}

export const createCustomExportCSVButton = (openModal) => {
    return (
        <div className="merge-button" onClick={openModal}>
            <Image src={merge} className="plus-icon" />
            <Label className="button-text">
                MERGE
            </Label>
        </div>
    );
}