//export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
//export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'
//export const INCREMENT_ASYNC = 'INCREMENT_ASYNC'
//
//export function increment(location, name) {
//  return {
//    type: INCREMENT_COUNTER,
//    meta: {location, name}
//  }
//}
//
//export function decrement() {
//  return {
//    type: DECREMENT_COUNTER
//  }
//}
//
//export function incrementIfOdd() {
//  return (dispatch, getState) => {
//    const { counter } = getState()
//
//    if (counter % 2 === 0) {
//      return
//    }
//
//    dispatch(increment())
//  }
//}
//
//export function incrementAsync(location, name) {
//  return {
//    type: INCREMENT_ASYNC,
//    meta: {location, name}
//  }
//}
