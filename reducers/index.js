import { combineReducers } from 'redux'
import {counter1, counter2} from './counter'

const rootReducer = combineReducers({
  counter1,
  counter2
});


export default rootReducer
