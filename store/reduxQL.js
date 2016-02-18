export const reduxQLMiddleware = ({ dispatch, getState, actions }) => {
  return next => action => {
    console.log(dispatch, getState, actions);
    action.meta = action.meta || {};
    action.meta.actions = actions;

    next(action);
  }
};

export const walkState = (locationStack, state) => {
  return locationStack.reduce((reduction, key, currentIdx) => {
    if (!reduction[key]) {
      reduction[key] = (currentIdx === locationStack.length -1) ? undefined : {}
    }
    return reduction[key];
  }, state);
};

const appendChangeToState = (locationStack, state, newSubState) => {
  if (locationStack.length === 1) {
    return Object.assign({}, state, {[locationStack[0]]: newSubState});
  } else {
    const subObject = appendChangeToState(locationStack.slice(1), state[locationStack[0]], newSubState);
    return Object.assign({}, state, {[locationStack[0]]: subObject});
  }
};

export const reduxQLReducer = (reducer)=> {
  return (state, action)=> {
    let newState = reducer(state, action);
    const funcArray = action.meta && action.meta.actions && action.meta.actions[action.type];
    if (funcArray) {
      let hasChanged = false;
      funcArray.forEach(fn => {
        const locationStack = action.meta.location || fn.defaultLocation;
        const subState = walkState(locationStack, state);
        const newSubState = fn.reducer(subState, action);
        if (subState !== newSubState) {
          hasChanged = true;
          newState = appendChangeToState(locationStack, state, newSubState);
        }
      })
    }
    return newState;
  }
}
