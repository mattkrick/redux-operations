import { combineReducers } from 'redux'
import {counter, clickCounter} from './counter'

const rootReducer = combineReducers({
  counter,
  clickCounter
});


export default rootReducer
