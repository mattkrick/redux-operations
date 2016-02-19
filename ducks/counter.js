import {INIT_REDUX_OPERATIONS} from 'redux-operations';
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'
export const INCREMENT_ASYNC = 'INCREMENT_ASYNC'
export const INCREMENT_IF_ODD = 'INCREMENT_IF_ODD'
export const SET_COUNTER = 'SET_COUNTER'

export function increment(location, name) {
  return {
    type: INCREMENT_COUNTER,
    meta: {location, name}
  }
}

export function decrement(location, name) {
  return {
    type: DECREMENT_COUNTER,
    meta: {location, name}
  }
}

export function incrementIfOdd(location, name) {
  return {
    type: INCREMENT_IF_ODD,
    meta: {location, name}
  }
}

export function incrementAsync(location, name) {
  return {
    type: INCREMENT_ASYNC,
    meta: {location, name}
  }
}

export function setCounter(newValue, location, name) {
  return {
    type: SET_COUNTER,
    meta: {location, name},
    payload: {newValue: +newValue}
  }
}

export const counter = (state = 0, action) => {
  if (action.type !== INIT_REDUX_OPERATIONS) return state;
  return {
    INCREMENT_COUNTER: {
      priority: 1,
      resolve: (state = 0, action)=> state + 1
    },
    DECREMENT_COUNTER: {
      priority: 1,
      resolve: (state = 0, action)=> state - 1
    },
    INCREMENT_IF_ODD: {
      resolve: (state = 0, action) => state % 2 ? state + 1 : state
    },
    INCREMENT_ASYNC: {
      priority: 1,
      resolve: (state = 0, action)=> {
        console.log('counter async called');
        setTimeout(()=> {
          const {dispatch, location, name} = action.meta;
          console.log('timeout returned called');
          dispatch(increment(location, name));
        }, 1000);
        return state;
      }
    },
    SET_COUNTER: {
      resolve: (state = 0, action) => action.payload.newValue,
      arguments: {
        newValue: {type: Number, description: 'The new value for the counter'}
      }
    },
    signature: '@@reduxOperations'
  }
};

