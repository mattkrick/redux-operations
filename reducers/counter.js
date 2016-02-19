import { INCREMENT_COUNTER1, DECREMENT_COUNTER1, INCREMENT_COUNTER2, DECREMENT_COUNTER2, increment1 } from '../actions/counter';
import {INIT_REDUX_OPERATIONS} from '../store/reduxOperations';

export const clickCounter = (state = 0, action) => {
  if (action.type === INIT_REDUX_OPERATIONS) {
    return {
      INCREMENT_COUNTER1: {
        priority: 10,
        resolve: (state = 0, action)=> {
          console.log('click counter called - increment');
          return state+1;
        },
        description: 'inc counter on click counter',
        arguments: {
          newCounterVal: {type: Number, description: 'the new counter val'}
        }
      },
      INCREMENT_ASYNC: {
        priority: 10,
        resolve: (state = 0, action)=> {
          console.log('click counter called - inc async');
          return state+1;
        }
      },
      signature: '@@reduxOperations'
    }
  }
  return state;
}

export const multiplyAll = (state = 0, action) => {
  if (action.type === INIT_REDUX_OPERATIONS) {
    return {
      INCREMENT_COUNTER1: {
        priority: 100,
        resolve: (state = 0, action)=> {
          return action.meta.operationResults.counter.state*action.meta.operationResults.clickCounter.state;
        },
        description: 'inc counter on click counter MULTIPLY ALL',
        arguments: {
          newCounterValMULTALL: {type: Number, description: 'the new counter val MULTIPLY ALL'}
        }
      },
      signature: '@@reduxOperations'
    }
  }
  return state;
}

export const multiplyCounters = (state = {c1:undefined,c2:undefined,res:0}, action) => {
  if (action.type === INIT_REDUX_OPERATIONS) {
    return {
      INCREMENT_COUNTER1: {
        priority: 10,
        resolve: (state = {c1:undefined,c2:undefined,res:0}, action)=> {
          let {c1,c2} = state;
          if (action.meta.operationResults && action.meta.operationResults.counter && action.meta.operationResults.counter.oldState == c1)
            c1 = action.meta.operationResults.counter.state;
          else
            c2 = action.meta.operationResults.counter.state;
          return {c1,c2,res:c1*c2};
        }
      },
      signature: '@@reduxOperations'
    }
  }
  return state;
}

export const counter = (state = 0, action) => {
  if (action.type === INIT_REDUX_OPERATIONS) {
    return {
      INCREMENT_COUNTER1: {
        priority: 1,
        resolve: (state = 0, action)=> {
          console.log('counter called - increment');
          return state + 1;
        }
      },
      DECREMENT_COUNTER1: {
        priority: 1,
        resolve: (state = 0, action)=> state - 1
      },
      INCREMENT_ASYNC: {
        priority: 1,
        resolve: (state = 0, action)=> {
          console.log('counter async called');
          setTimeout(()=>{
            console.log('timeout returned called');
            action.meta.dispatch(increment1(action.meta.location, action.meta.name));
          }, 1000);
          return state;
        }
      },
      //init: 0,
      signature: '@@reduxOperations'
    }
  }
  return state;
}
