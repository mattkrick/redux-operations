//import { INCREMENT_COUNTER, DECREMENT_COUNTER, INCREMENT_COUNTER2, DECREMENT_COUNTER2, increment } from '../actions/counter';
//import {INIT_REDUX_OPERATIONS} from 'redux-operations';
//
//

//
//export const multiplyCounters = (state = {c1: undefined, c2: undefined, res: 0}, action) => {
//  if (action.type === INIT_REDUX_OPERATIONS) {
//    return {
//      INCREMENT_COUNTER: {
//        priority: 10,
//        resolve: (state = {c1: undefined, c2: undefined, res: 0}, action)=> {
//          let {c1,c2} = state;
//          if (action.meta.operationResults && action.meta.operationResults.counter && action.meta.operationResults.counter.oldState == c1)
//            c1 = action.meta.operationResults.counter.state;
//          else
//            c2 = action.meta.operationResults.counter.state;
//          return {c1, c2, res: c1 * c2};
//        }
//      },
//      signature: '@@reduxOperations'
//    }
//  }
//  return state;
//}
