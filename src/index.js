const INIT_REDUX = '@@redux/INIT';
const INIT_DEVTOOLS = '@@INIT';
export const INIT_REDUX_OPERATIONS = '@@reduxOperations/INIT';
export const REDUX_OPERATION_SIGNATURE = '@@reduxOperations';


export const walkState = (locationStack, state) => {
  return locationStack.reduce((reduction, key, currentIdx) => {
    if (!reduction[key]) {
      reduction[key] = (currentIdx === locationStack.length - 1) ? undefined : {};
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

const makeStoreAPI = initResult => {
  const api = {};
  makeStoreOperations(api, initResult);
  Object.keys(api).forEach(action => {
    api[action].operationArray.sort((a, b) => {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      return priorityA > priorityB;
    });
    if (process.env.NODE_ENV !== 'production') {
      api[action].arguments = api[action].operationArray.reduce((reduction, operation) => {
        return Object.assign(reduction, operation.arguments)
      }, {})
    }
  });
  return api;
};

const makeStoreOperations = (storeOperations, state, stack = [], key) => {
  if (state && typeof state === 'object' && state.signature === REDUX_OPERATION_SIGNATURE) {
    Object.keys(state).filter(key => key !== 'signature').forEach(operation => {
      storeOperations[operation] = storeOperations[operation] || {};
      storeOperations[operation].operationArray = storeOperations[operation].operationArray || [];
      storeOperations[operation].operationArray.push({
        ...state[operation],
        defaultLocation: [...stack],
        name: key
      })
    })
  } else {
    Object.keys(state).forEach(key => {
      stack.push(key);
      makeStoreOperations(storeOperations, state[key], stack, key);
    })
  }
  stack.pop();
};

const liftReducerWith = (reducer, initialCommittedState) => {
  const initialLiftedState = {
    userState: initialCommittedState
  };

  return (liftedState = initialLiftedState, liftedAction) => {
    let {api, userState} = liftedState;
    let activeState = reducer(userState, liftedAction);
    if (liftedAction.type === INIT_REDUX || liftedAction.type === INIT_DEVTOOLS) {
      const initResult = reducer(undefined, {type: INIT_REDUX_OPERATIONS});
      api = makeStoreAPI(initResult);
    }
    else {
      const actionObject = api[liftedAction.type] || {};
      const operationArray = actionObject.operationArray;
      if (operationArray) {
        operationArray.forEach(operation => {
          let locationStack = operation.defaultLocation;
          // 3 possiblies: If a locationStack isn't given, use the default (for simple non-multi scenarios)
          // If Loc but no Name, or name == operation name, use given location (for dynamic or multi scenarios)
          // Otherwise, use default
          if (liftedAction.meta.location && (!liftedAction.meta.name || operation.name === liftedAction.meta.name)) {
            locationStack = liftedAction.meta.location
          }
          const subState = walkState(locationStack, activeState);
          const newSubState = operation.resolve(subState, liftedAction);
          if (subState !== newSubState) {
            activeState = appendChangeToState(locationStack, activeState, newSubState);
          }
          liftedAction.meta.operationResults = liftedAction.meta.operationResults || {};
          liftedAction.meta.operationResults[operation.name] = {oldState: subState, state: newSubState};
        })
      }
    }
    return {
      api,
      userState: activeState
    }
  };
};

const unliftState = (liftedState) => {
  return liftedState.userState;
};

const unliftStore = (reduxOperationStore, liftReducer) => {
  return {
    ...reduxOperationStore,

    dispatch(action) {
      action.meta = action.meta || {};
      action.meta.dispatch = reduxOperationStore.dispatch;
      reduxOperationStore.dispatch(action);
      return action;
    },

    getState() {
      return unliftState(reduxOperationStore.getState());
    },

    replaceReducer(nextReducer) {
      reduxOperationStore.replaceReducer(liftReducer(nextReducer));
    }
  };
};

export const reduxOperations = () => {
  return createStore => (reducer, initialState, enhancer) => {
    function liftReducer(r) {
      if (typeof r !== 'function') {
        throw new Error('Expected the reducer to be a function.');
      }
      return liftReducerWith(r, initialState);
    }
    const reduxOperationStore = createStore(liftReducer(reducer), enhancer);
    if (reduxOperationStore.reduxOperationStore) {
      throw new Error('reduxOperation should not be applied more than once. Check your store configuration.');
    }
    return unliftStore(reduxOperationStore, liftReducer);
  };
};

