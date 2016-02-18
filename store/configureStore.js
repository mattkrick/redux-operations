import { createStore, compose } from 'redux'
import applyMiddleware from './monkeyApplyMiddleware'
import thunk from 'redux-thunk'
import {reduxQLMiddleware, reduxQLReducer} from './reduxQL';

import reducer from '../reducers'
const finalReducer = reduxQLReducer(reducer);

const createStoreWithMiddleware = compose(applyMiddleware(
  reduxQLMiddleware
), window.devToolsExtension ? window.devToolsExtension() : f => f)(createStore)

export default function configureStore(initialState) {
  return createStoreWithMiddleware(finalReducer, initialState)
}

