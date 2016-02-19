import { combineReducers } from 'redux'
import {counter} from '../ducks/counter'

const rootReducer = combineReducers({
  counter,
  //clickCounter,
  //multiplyAll
});


export default rootReducer
