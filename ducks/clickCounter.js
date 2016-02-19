import {INIT_REDUX_OPERATIONS} from 'redux-operations';
import {INCREMENT_COUNTER} from './counter';

export const clickCounter = (state = 0, action) => {
  if (action.type !== INIT_REDUX_OPERATIONS) return state;
  return {
    INCREMENT_COUNTER: {
      resolve: (state = 0, action)=> {
        return state + 1;
      },
      description: 'Number of times all counters were incremented'
    },
    signature: '@@reduxOperations'
  }
}
