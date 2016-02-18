import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import ClickCounter from '../components/ClickCounter'
import MultiplyAll from '../components/MultiplyAll'
import React, { Component, PropTypes } from 'react'

const counter1Location = ['counters', 'counter1'];
const counter2Location = ['counters', 'counter2'];

export default class Counters extends Component {
  render() {
    return (
      <div>
        <Counter location={counter1Location}/>
        <Counter location={counter2Location}/>
        <Counter location={counter1Location}/>
        <ClickCounter/>
        <MultiplyAll/>
      </div>
    )
  }
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
