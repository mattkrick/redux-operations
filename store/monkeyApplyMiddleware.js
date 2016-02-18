import {compose} from 'redux';

const makeStoreActions = (storeActions, state, stack = []) => {
  //debugger
  if (typeof  state === 'object' && state.signature === 'foo') {
    Object.keys(state).forEach(action => {
      if (action !== 'signature') {
        storeActions[action] = storeActions[action] || [];
        storeActions[action].push({...state[action], defaultLocation: [...stack]})
      }
    })
  } else {
    Object.keys(state).forEach(key => {
      stack.push(key);
      makeStoreActions(storeActions, state[key], stack);
    })
  }
  stack.pop();
};

export default function applyMiddleware(...middlewares) {
  return (next) => (reducer, initialState) => {
    var store = next(reducer, initialState);
    var dispatch = store.dispatch;
    var chain = [];

    const actions = {};
    const qlInit = {type: 'INITQL'};
    const initResult = reducer(undefined, qlInit);
    makeStoreActions(actions, initResult);
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
      actions
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}
