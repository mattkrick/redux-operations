//import {compose} from 'redux';
//
//const makeStoreOperations = (storeOperations, state, stack = [], key) => {
//  if (typeof  state === 'object' && state.signature === '@@reduxOperations') {
//    Object.keys(state).filter(key => key !== 'signature').forEach(operation => {
//      storeOperations[operation] = storeOperations[operation] || [];
//      storeOperations[operation].push({...state[operation], defaultLocation: [...stack], name: key})
//    })
//  } else {
//    Object.keys(state).forEach(key => {
//      stack.push(key);
//      makeStoreOperations(storeOperations, state[key], stack, key);
//    })
//  }
//  stack.pop();
//};
//
//export default function applyMiddleware(...middlewares) {
//  return (next) => (reducer, initialState) => {
//    var store = next(reducer, initialState);
//    var dispatch = store.dispatch;
//    var chain = [];
//
//    const operations = {};
//    const qlInit = {type: 'INITQL'};
//    const initResult = reducer(undefined, qlInit);
//    makeStoreOperations(operations, initResult);
//    debugger
//    //Object.keys(operations).forEach()
//    var middlewareAPI = {
//      getState: store.getState,
//      dispatch: (operation) => dispatch(operation),
//      operations
//    };
//    chain = middlewares.map(middleware => middleware(middlewareAPI));
//    dispatch = compose(...chain)(store.dispatch);
//
//    return {
//      ...store,
//      dispatch
//    };
//  };
//}
