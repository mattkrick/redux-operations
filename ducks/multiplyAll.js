import {INIT_REDUX_OPERATIONS} from 'redux-operations';
import {INCREMENT_COUNTER} from './counter';

export const multiplyAll = (state = 0, action) => {
  if (action.type !== INIT_REDUX_OPERATIONS) return state;
  return {
    INCREMENT_COUNTER: {
      //priority must be higher so it comes later than the origination click and update
      priority: 100,
      resolve: (state = 0, action)=> {
        return action.meta.operationResults.counter.state * action.meta.operationResults.clickCounter.state;
      },
      description: 'All counters clicked multiplied by value of last counter clicked'
    },
    signature: '@@reduxOperations'
  }
}
