import { createStore, compose } from 'redux'
import {reduxOperations} from 'redux-operations';
import reducer from '../reducers'
import DevTools from '../DevTools';


const enhancer = compose(
    reduxOperations(),
    DevTools.instrument()
);

export default function configureStore(initialState) {
  return createStore(reducer, initialState, enhancer);
}
