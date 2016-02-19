import { combineReducers } from 'redux'
import {counter} from '../ducks/counter'
import {clickCounter} from '../ducks/clickCounter'
import {multiplyAll} from '../ducks/multiplyAll'

const rootReducer = combineReducers({
  counter,
  clickCounter,
  multiplyAll
});


export default rootReducer
