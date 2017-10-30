export const KEYS_TO_FILTERS = ['productDetail.title', 'stockOnHand.units', 'stockOnHand.values', 'committed.units', 'committed.values', 'availableForSale.units', 'availableForSale.values']

export const validateEmail = (email) => {
    // eslint-disable-next-line max-len, no-useless-escape
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };
