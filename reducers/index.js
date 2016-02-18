import { combineReducers } from 'redux'
import {counter, clickCounter, multiplyAll} from './counter'

const rootReducer = combineReducers({
  counter,
  clickCounter,
  multiplyAll
});


export default rootReducer
