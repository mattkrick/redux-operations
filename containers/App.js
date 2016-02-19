import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import ClickCounter from '../components/ClickCounter'
//import MultiplyAll from '../components/MultiplyAll'
import React, { Component, PropTypes } from 'react'

const topCounter = ['counters', 'top'];
const bottomCounter = ['counters', 'bottom'];

export default class Counters extends Component {
  render() {
    return (
      <div>
        <div className="plain-counter">
          1. Plain counter
          <Counter/>
        </div>
        <div className="top-bottom">
          2. Top/Bottom counters
          <Counter location={topCounter}/>
          <Counter location={bottomCounter}/>
        </div>
        <div className="sum-all-clicks">
          3. Number of times all counters were incremented
          <ClickCounter/>
        </div>
      </div>
    )
  }
        //<Counter location={topLocation}/>


  //<MultiplyAll/>
}
//function mapStateToProps(state) {
//  return {
//    counter1: state.counter.counter,
//    counter2: state.counter2
//  }
//}
//
//function mapDispatchToProps(dispatch) {
//  return bindActionCreators(CounterActions, dispatch)
//}

//export default connect(mapStateToProps, mapDispatchToProps)(Counter)
