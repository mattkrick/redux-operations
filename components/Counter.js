import React, { Component, PropTypes } from 'react'
import {walkState} from 'redux-operations';
import {increment, incrementAsync, decrement, incrementIfOdd, setCounter, counter} from '../ducks/counter';
import {connect} from 'react-redux';
//import {counter} from '../reducers/counter'


const mapStateToProps = (state, props) => {
  return {
    counter: props.location ? walkState(props.location, state, counter) : state.counter
  }
}

@connect(mapStateToProps)
export default class Counter extends Component {
  render() {
    const { location, counter, dispatch } = this.props
    return (
      <div>
        <p>
          Clicked: {counter} times
          {' '}
          <button onClick={() => dispatch(increment(location, 'counter'))}>+</button>
          {' '}
          <button onClick={() => dispatch(decrement(location, 'counter'))}>-</button>
          {' '}
          <button onClick={() => dispatch(incrementIfOdd(location, 'counter'))}>+ if odd</button>
          {' '}
          <button onClick={() => dispatch(incrementAsync(location, 'counter'))}>Async +</button>
          {' '}
          <input type="number" ref="setInput" size="5" defaultValue="0"/>
          <button onClick={() => dispatch(setCounter(this.refs['setInput'].value,location, 'counter'))}>Set input</button>
          {' '}
        </p>
      </div>
    )
  }
}
