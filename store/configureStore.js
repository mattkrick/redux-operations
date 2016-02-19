import { createStore, compose } from 'redux'
import reduxOperations from './reduxOperations';
import reducer from '../reducers'

export default function configureStore(initialState) {
  return reduxOperations()(createStore)(reducer, initialState)
}

