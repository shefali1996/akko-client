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