import React from 'react';
import { Image } from 'react-bootstrap';
import Checkbox from '../components/Checkbox';

import sort from '../assets/sort.svg'
import inversesort from '../assets/inversesort.svg'

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