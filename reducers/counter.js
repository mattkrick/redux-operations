import { INCREMENT_COUNTER1, DECREMENT_COUNTER1, INCREMENT_COUNTER2, DECREMENT_COUNTER2 } from '../actions/counter';

export const clickCounter = (state = 0, action) => {
  if (action.type === 'INITQL') {
    return {
      INCREMENT_COUNTER1: {
        priority: 1,
        reducer: (state = 0, action)=> state + 1
      },
      signature: '@@reduxOperations'
    }
  }
  return state;
}

export const counter = (state = 0, action) => {
  if (action.type === 'INITQL') {
    return {
      INCREMENT_COUNTER1: {
        priority: 1,
        reducer: (state = 0, action)=> state + 1
      },
      DECREMENT_COUNTER1: {
        priority: 1,
        reducer: (state = 0, action)=> state - 1
      },
      //init: 0,
      signature: '@@reduxOperations'
    }
  }
  return state;
}
