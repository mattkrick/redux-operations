//export const reduxQLMiddleware = ({ dispatch, getState, operations }) => {
//  return next => action => {
//    action.meta = action.meta || {};
//    action.meta.operations = operations;
//    action.meta.dispatch = dispatch;
//    next(action);
//  }
//};
//
//export const walkState = (locationStack, state) => {
//  return locationStack.reduce((reduction, key, currentIdx) => {
//    reduction[key] = reduction[key] || (currentIdx === locationStack.length - 1) ? undefined : {};
//    return reduction[key];
//  }, state);
//};
//
//const appendChangeToState = (locationStack, state, newSubState) => {
//  if (locationStack.length === 1) {
//    return Object.assign({}, state, {[locationStack[0]]: newSubState});
//  } else {
//    const subObject = appendChangeToState(locationStack.slice(1), state[locationStack[0]], newSubState);
//    return Object.assign({}, state, {[locationStack[0]]: subObject});
//  }
//};
//
//export const reduxQLReducer = (reducer)=> {
//  return (state, action)=> {
//    let activeState = reducer(state, action);
//    const operationArray = action.meta && action.meta.operations && action.meta.operations[action.type];
//    if (operationArray) {
//      operationArray.forEach(operation => {
//        let locationStack = operation.defaultLocation;
//        // 3 possiblies: If a locationStack isn't given, use the default (for simple non-multi scenarios)
//        // If Loc but no Name, or name == operation name, use given location (for dynamic or multi scenarios)
//        // Otherwise, use default
//        if (action.meta.location && (!action.meta.name || operation.name === action.meta.name)) {
//          locationStack = action.meta.location
//        }
//        const subState = walkState(locationStack, activeState);
//        const newSubState = operation.reducer(subState, action);
//        if (subState !== newSubState) {
//          activeState = appendChangeToState(locationStack, activeState, newSubState);
//        }
//        action.meta.operationResults = action.meta.operationResults || {};
//        action.meta.operationResults[operation.name] = {oldState: subState, state: newSubState};
//      })
//    }
//    return activeState;
//  }
//};
//
//
