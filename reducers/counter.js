import { INCREMENT_COUNTER1, DECREMENT_COUNTER1, INCREMENT_COUNTER2, DECREMENT_COUNTER2 } from '../actions/counter';

export const counter2 = (state = 0, action) => {
  if (action.type === 'INITQL') {
    return {
      INCREMENT_COUNTER2: {
        priority: 1,
        reducer: (state = 0, action)=> state + 1
      },
      DECREMENT_COUNTER2: {
        priority: 1,
        reducer: (state = 0, action)=> state - 1
      },
      //init: 0,
      signature: 'foo'
    }
  }
  return state;
}

export const counter1 = (state = 0, action) => {
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
      signature: 'foo'
    }
  }
  return state;
}
