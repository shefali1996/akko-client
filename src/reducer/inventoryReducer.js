import update from 'immutability-helper';
import {
  DATASET_INDEX_STARTED,
  DATASET_INDEX_SUCCESS,
  DATASET_INDEX_FAILURE
} from '../Actions/types';


const INITIAL_STATE = {
  dataset: [],
  isLoading: true,
  hasErrored: false,

  data: null,
  loading: false,
  loaded: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DATASET_INDEX_STARTED:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
        data: null
      };
    case DATASET_INDEX_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.data
      };
    case DATASET_INDEX_FAILURE:
      return {
        loading: false,
        loaded: false,
        error: action.error,
        data: null
      };
    default:
      return state
  }
};
