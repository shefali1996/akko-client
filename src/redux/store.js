import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from './reducer';

const middleWare = [];

middleWare.push(thunk);

const loggerMiddleware = createLogger({
  predicate: () => process.env.NODE_ENV === 'development',
});

middleWare.push(loggerMiddleware);


const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(...middleWare),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

export default store;
