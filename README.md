[![npm version](https://badge.fury.io/js/redux-operations.svg)](https://badge.fury.io/js/redux-operations)

# redux-operations
Solves challenging redux problems in a clean, understandable, debuggable fasion. 

##Installation
`npm i -S redux-operations`

## What kind of problems can it solve?
Everything you'll ever encounter in the wild:
- Dynamic state
- Action watching (eg count how many times a particular action was run)
- Based on itermediary results (eg 2 reducers sharing the same action & 1 needs the result of the other)
- Async actions without thunk/promise middleware. Just write your logic directly in your reducer
- Visual, dare I say *graphiQL*, API to make debugging a breeze

## Where can I see it working?
- https://github.com/mattkrick/redux-operations-counter-example
- https://github.com/slorber/scalable-frontend-with-elm-or-redux/tree/master/redux-operations-DrorT
- Your app here!

## How's it different from redux-saga?
risking oversimplification, redux-saga uses generators and puts business logic in the middleware.
It also lets you cancel promises.

redux-operations keeps all logic in the reducer by adding info to `action.meta.operations` behind the scenes.
This allows it to solve a few extra hard problems like dynamic state.
It also plays nicely with vanilla redux so you only need to use it for the tricky parts of your app.
But, if you like a visual API for debugging, you might as well use it for your whole app.

See [scalable-frontend-with-elm-or-redux](https://github.com/slorber/scalable-frontend-with-elm-or-redux/) to see how the two solve the same problem and decide which fits your use case.

##Usage

###Create the store enhancer

Just like `redux-devtools` or `applyMiddleware`, redux-operations is a `storeEnhancer`.

#### API 
`const storeEnhancer = reduxOperations();`

#### Example
```js
import {createStore} from 'redux'
import {reduxOperations} from 'redux-operations';
return createStore(rootReducer, initialState, reduxOperations());
```

If you use this in conjunction with redux-devtools, you'll see an enhanced state there:

```js
state = {
  api: <YOUR REDUX-OPERATIONS API HERE>
  userState: <YOUR STATE HERE>
})
```
There's no need to adjust any of your code, your application only sees what's inside `userState`.

###Write your reducer

When your store is created, redux-operations ignores your regular reducers and only uses reducers designed for it.
These are easily created by using a reducer factory that takes in an `operationName`, `initialState` and an object full of "operations".
An operation is an action that is specific to the reducer. In other words, one action type has 1 or many operations.
This already occurs in the wild, but the execution order is arbitrary and intermediary results are not passed through.
The operationName is the same name that you use in your `combineReducers`. By making you repeat that name here, we allow for perfect compatibility with standard redux.

#### API
`operationReducerFactory(operationName, initialState, reducerObject);`

#### Example
```js
import {operationReducerFactory} from 'redux-operations';
const initialState = 0;
export const counter = operationReducerFactory('counter', initialState, {
  INCREMENT_COUNTER: {
    resolve: (state, action)=> state + 1
  },
  INCREMENT_ASYNC: {
    priority: 1, // if this action type is used in another reducer, this determines which runs first
    resolve: (state, action)=> {
      setTimeout(()=> {
        const {dispatch, locationInState} = action.meta.operations;
        // yes, that counter variable below is a circular reference to the reducer object
        const inc = bindOperationToActionCreators(locationInState, counter, increment);
        dispatch(inc());
      }, 1000);
      return state;
    }
  },
  SET_COUNTER: {
    resolve: (state, action) => action.payload.newValue, // set the state to the variable passed in
    arguments: {
      newValue: {type: Number, description: 'The new value for the counter'} // show this in the API
    }
  }
});
```
Notice that all the logic occurs in the `resolve` method, *even async actions*. 
In plain redux, this logic is split between the action creator and the resolve function, which subjectively makes the flow harder to follow.

###Integrate into the model-view layer (eg your redux container)

redux-operations works with all frontend frameworks, but we'll show an example of it working in react.
For the example, imagine you have 2 counters that share the same reducer. 
You need to know where in the state tree to find each (called `locationInState`)
and the `reducerObject` so it can initialize the state at runtime (for dynamically generated states)

First, we need to get the possibly-dynamic state from the state tree.

#### API
`walkState(locationInState, state, reducerObject);`

#### Example
```js
import {counterReducer} from './counterReducer';
import {walkState} from 'redux-operations';

const mapStateToProps = (state, props) => {
  return {
    // `locationInState` is static here, but is usually passed in via props.
    counter: walkState(['counters', 'top'], state, counterReducer);
  }
};
```

Next, we need to make sure that our action creators attach this info to the new actions.
This is done by attaching `locationInState` and the `operationName` to the `action.meta.operations` property.
Since the `operationName` is stored in the `reducerObject`, we just pass that in.
To make it easy, redux-operations offers a HOF to do the work for you. 
It takes in a single function or an object of functions, similar to redux's `bindDispatchToActions`.

#### API
`bindOperationtToActionCreators(locationInState, reducerObject, actionCreators);`

#### Example
```js
import {bindOperationToActionCreators} from 'redux-operations';
import {counterReducer} from './counterReducer';
import * from './actionCreators';
import {connect} from 'react-redux';

@connect(mapStateToProps)
export default class Counter extends Component {
 render() {
    const {incrementAsync} = bindOperationToActionCreators(['counters', 'top'], counterReducer, actionCreators);
    return (
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    )
  }
}
```

## More advanced cases
For more advanced use cases, see the [Counter example](https://github.com/mattkrick/redux-operations-counter-example)
or read the [blog post](https://medium.com/@matt.krick/introducing-redux-operations-332ab56e468b#.rzl1w93o9).
