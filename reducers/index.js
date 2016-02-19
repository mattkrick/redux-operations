import { combineReducers } from 'redux'
import {counter} from '../ducks/counter'
import {clickCounter} from '../ducks/clickCounter'

const rootReducer = combineReducers({
  counter,
  clickCounter
  //clickCounter,
  //multiplyAll
});


export default rootReducer
