import { createStore, compose } from 'redux'
//import applyMiddleware from './monkeyApplyMiddleware'
import thunk from 'redux-thunk'
import {reduxQLMiddleware, reduxQLReducer} from './reduxQL';
import reduxOperations from './reduxOperations';

import reducer from '../reducers'
//const finalReducer = reduxQLReducer(reducer);

export default function configureStore(initialState) {
  return reduxOperations()(reducer, initialState, createStore)
}

