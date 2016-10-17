const INIT_REDUX = '@@redux/INIT';
const INIT_DEVTOOLS = '@@INIT';
const INIT_REDUX_OPERATIONS = '@@reduxOperations/INIT';
const REDUX_OPERATION_SIGNATURE = '@@reduxOperations';

const bindOperationToActionCreator = (locationInState, lastOperations, actionCreator) => {
  return (...args) => {
    const action = actionCreator(...args);
    action.meta = {...action.meta, operations: {locationInState, operationName: lastOperations.operationName, dispatch: lastOperations.dispatch}};
    return action;
  }
};

/**
 * Binds the locationInState and operationName to every actionCreator. After the action is created with the
 * enhanced function, the action will contain a meta.operations property that is used internally by redux-operations.
 * The same can be accomplished by manually passing this info into your action creators.
 *
 * @param {Array} locationInState the stack that takes you from store.getState() to your specified component state
 * @param {Function} reducer the reducer associated with this action. We just use it to grab the name
 * @param {Function|Object} actionCreators a redux action creator or object of many action creators
 *
 * @returns {Function|Object} actionCreators that automatically assign operations metadata to themselves
 */
export const bindOperationToActionCreators = (locationInState, lastOperations, actionCreators) => {
  if (typeof actionCreators === 'function') {
    return bindOperationToActionCreator(locationInState, lastOperations, actionCreators);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(`bindOperationToActionCreators requires a function or object full of functions`);
  }

  return Object.keys(actionCreators).reduce((reduction, actionCreator) => {
    reduction[actionCreator] = bindOperationToActionCreator(locationInState, lastOperations, actionCreators[actionCreator]);
    return reduction;
  }, {});
};

/**
 * Given the redux state, walkState uses the locationInState stack as a map to get to your
 * desired subState. If it doesn't exist yet, it creates it & initializes it based on the defaultValue
 * supplied in your reducer. This is commonly used in react-redux's mapStateToProps for dynamic states.
 *
 * @param {Array} locationInState the stack that takes you from store.getState() to your specified component state
 * @param {Object} state the redux state
 * @param {Function} initializer the redux-operations reducer (not your rootReducer)
 *
 * @returns {*} the desired subState
 */
export const walkState = (locationInState = [], state, initializer) => {
  //TODO maybe memoize?
  return locationInState.reduce((reduction, key, currentIdx) => {
    if (reduction.hasOwnProperty(key)) {
      return reduction[key];
    } else if (currentIdx === locationInState.length - 1) {
      return (typeof initializer === 'function') && initializer();
    } else {
      return {};
    }
  }, state);
};

/**
 * A custom factory to create a reducer full of operations specifically for redux-operations
 *
 * @param {String} operationName the name of the reducer as passed into combineReducers.
 * @param {*} initialState the initial state for components using this reducer, same as what you'd use for redux.
 * @param {Object} reducerObject an object where each property key is a redux actionType.
 *
 * @property {Object} actionType an object that holds the priority, resolve, and arguments of a specific operation.
 * @property {Number} actionType.priority a priority assigned to the operation. If multiple reducers share the same
 * action type, the one with a lower priority will run first. Defaults to 0.
 * @property {Function} actionType.resolve the reducer function that receives state and the
 * overloaded action (includes meta.operations) and runs on a dispatch
 * @property {Object} actionType.arguments AN object of arguments that are expected to be present in the payload
 * @property {Function} argument.type The expected constructor for the given argument
 * @property {String} argument.description A brief description of the argument passed into the payload
 *
 * @returns {Function} a redux-operations reducer that plays well with other reducers
 */
export const operationReducerFactory = (operationName, initialState, reducerObject) => {
	// Able to define name on creation of reducer
	function operation(state = initialState, action = {}) {
		if (action.type !== INIT_REDUX_OPERATIONS) return state;

		//For each operation, set the initialState as the default value
		Object.keys(reducerObject).forEach(operation => {
			const resolveFunc = reducerObject[operation].resolve;
			reducerObject[operation].resolve = (state = initialState, action) => resolveFunc(state, action);
			reducerObject[operation].resolve.toString = () => '<Resolve Function>';
			const args = reducerObject[operation].arguments;
			if (typeof args === 'object' && args !== null) {
				Object.keys(args).forEach(arg => {
					const curArg = args[arg];
					if (typeof curArg.type === 'function') {
						curArg.type.toString = () => `<${curArg.type.name}>`;
					}
				})
			}
		});

		return {
			...reducerObject,
			signature: REDUX_OPERATION_SIGNATURE,
			operationName
		}
	}

	return Object.defineProperty(operation, 'operationName', {
		value: operationName,
		enumerable: false,
		writable: false,
		configurable: false,
	});

};

/**
 * An internal function that dynamically mutates the redux state.
 *
 * @param {Array} locationInState the stack that takes you from store.getState() to your specified component state
 * @param {Object} state the redux state
 * @param {Object} newSubState the newly created subState that will overwrite the state at locationInState
 *
 * @returns {Object} new state
 */
const appendChangeToState = (locationInState, state, newSubState) => {
  const nextLocation = locationInState[0];
  if (locationInState.length === 1) {
    return {...state, [nextLocation]: newSubState};
  } else {
    const subObject = appendChangeToState(locationInState.slice(1), state[nextLocation] || {}, newSubState);
    return {...state, [nextLocation]: subObject}
  }
};

/**
 * An internal function that generates the redux-operations API.
 *
 * @param {*} initialResult the state after initialization & populated with initial values
 *
 * @returns {Object} the beautiful visual API as seen in redux devtools
 */
const makeStoreAPI = initialResult => {
  const api = {};
  makeStoreOperations(api, initialResult);
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

/**
 * An internal function that picks out the reducers that are specially created
 * for redux-operations. It then provides a defaultLocation for components that don't need
 * to be dynamically created. It also provides a name that will be compared to operationName in walkState,
 * which is generally provided in the reducer or component layer.
 */
const makeStoreOperations = (storeOperations, state, stack = [], key) => {
  if (state && typeof state === 'object')
    if (state.signature === REDUX_OPERATION_SIGNATURE) {
      Object.keys(state).filter(key => key !== 'signature').forEach(operation => {
        storeOperations[operation] = storeOperations[operation] || {};
        storeOperations[operation].operationArray = storeOperations[operation].operationArray || [];
        storeOperations[operation].operationArray.push({
          ...state[operation],
          defaultLocation: [...stack],
					operationName: key
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

/**
 * An internal function that initializes the store, generates the API, and overloads actions
 * with the result of the operation. The latter is best understood if you consider two reducers
 * that both trigger something based on the same action type. In redux-operations, you can say
 * 1 action has many operations. Operation #2 may need the result of operation #1. By providing that information
 * in action.meta.operations.results, which is accessable in the resolve function, the developer can write
 * clean logic basic on previous results without the need for generators or middleware.
 */
const liftReducerWith = (reducer, initialCommittedState) => {
  const initialLiftedState = {
    userState: initialCommittedState
  };

  return (liftedState = initialLiftedState, liftedAction) => {
    let {api, userState} = liftedState;
    if (liftedAction.type === INIT_REDUX || liftedAction.type === INIT_DEVTOOLS) {
      const initialResult = reducer(undefined, {type: INIT_REDUX_OPERATIONS});
      api = makeStoreAPI(initialResult);
    }
    let activeState = reducer(userState, liftedAction);
    const actionObject = api[liftedAction.type] || {};
    const operationArray = actionObject.operationArray;
    if (operationArray) {
      operationArray.forEach(operation => {
        let locationInState = operation.defaultLocation;
        // 3 possiblies: If a locationInState isn't given, use the default (for simple non-multi scenarios)
        // If Loc but no Name, or name == operation name, use given location (for dynamic or multi scenarios)
        // Otherwise, use default
        if (liftedAction.meta.operations.locationInState && (!liftedAction.meta.operations.operationName || operation.operationName === liftedAction.meta.operations.operationName)) {
          locationInState = liftedAction.meta.operations.locationInState
        }
        const subState = walkState(locationInState, activeState);
        const newSubState = operation.resolve(subState, liftedAction);
        if (subState !== newSubState) {
          activeState = appendChangeToState(locationInState, activeState, newSubState);
        }
        liftedAction.meta.operations.results = liftedAction.meta.operations.results || {};
        liftedAction.meta.operations.results[operation.operationName] = {oldState: subState, state: newSubState};
      })
    }
    return {
      api,
      userState: activeState
    }
  };
};

/**
 * An internal function that overwrites the state with state.userState, so you can see the API in devtools
 * but you don't have to do anything differently in able to access your state.
 */
const unliftState = (liftedState) => {
  return liftedState.userState;
};

/**
 * An internal function that hands the dispatch function to every action allowing for pain-free
 * async actions (thunks, promises) that happen right in the resolve function.
 */
const unliftStore = (reduxOperationStore, liftReducer) => {
  return {
    ...reduxOperationStore,

    dispatch(action) {
      action.meta = action.meta || {};
      action.meta.operations = action.meta.operations || {};
      action.meta.operations.dispatch = reduxOperationStore.dispatch;
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

/**
 * An store enhancer factory that takes no arguments and returns a standard redux storeEnhancer that
 * works similarly to a very basic redux-devtools. It shows you the API of all your redux-operations reducers
 *
 * @returns {Function} redux storeEnhancer
 */
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
      throw new Error('redux-operations should not be applied more than once. Check your store configuration.');
    }
    reduxOperationStore.dispatch.toString = () => '<Dispatch Function>'
    return unliftStore(reduxOperationStore, liftReducer);
  };
};
