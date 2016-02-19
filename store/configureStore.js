import { createStore, compose } from 'redux'
import reduxOperations from './reduxOperations';
import reducer from '../reducers'


export default function configureStore(initialState) {
  //return compose(reduxOperations(), window.devToolsExtension())(createStore)(reducer, initialState);
  //const reduxOpSCreateStore = reduxOperations()(createStore);
  debugger
  const store = window.devToolsExtension()(reduxOperations()(createStore))(reducer, initialState);
  return store
  //const store = createStore(reducer, initialState)
  //const reduxOpSCreateStore = reduxOperations()(createStore);
  //return window.devToolsExtension()(reduxOpSCreateStore)(reducer,initialState);
}

