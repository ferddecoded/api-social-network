import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const ininitalState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  ininitalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
