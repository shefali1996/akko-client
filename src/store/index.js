import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducers';

import { createLogger } from 'redux-logger';
const logger = createLogger();

// Redux and sagas setup and store configuration
export default function configureStore(initialState) {
    const middlewares = [logger];
    const enhancer = applyMiddleware(...middlewares);
    const store = createStore(reducer, initialState, enhancer);
    if (module.hot) {
        module.hot.accept(() => {
            store.replaceReducer(require('../reducers').default);
        });
    }
    return store;
}
