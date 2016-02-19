import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import ClickCounter from '../components/ClickCounter'
import MultiplyAll from '../components/MultiplyAll'
import AddDynamicCounters from '../components/AddDynamicCounters'
import React, { Component, PropTypes } from 'react'

const topCounter = ['counters', 'top'];
const bottomCounter = ['counters', 'bottom'];

export default class Counters extends Component {
  render() {
    return (
      <div>
        <div className="instructions">
          Explore the api in devtools to see operation flow, args, and descriptions ---->
          <div>Your normal state is under userState</div>
        </div>
        <div className="plain-counter">
          <h2>1. Plain counter</h2>
          <Counter/>
        </div>
        <div className="top-bottom">
          <h2>2. Top/Bottom counters</h2>
          <h3>(Solves #2 from https://github.com/evancz/elm-architecture-tutorial)</h3>
          <Counter location={topCounter}/>
          <Counter location={bottomCounter}/>
        </div>
        <div className="sum-all-clicks">
          <h2>3. Number of times all counters were incremented</h2>
          <h3>(Solves http://blog.javascripting.com/2016/02/02/encapsulation-in-redux/)</h3>
          <ClickCounter/>
        </div>
        <div className="multiply sum and last click">
          <h2>4. All counters clicked multiplied by value of last counter clicked</h2>
          <h3>(Solves https://github.com/reactjs/redux/issues/1315#issue-129937015)</h3>
          <MultiplyAll/>
        </div>
        <div className="add-dynamically">
          <h2>5. A counter that creates counters</h2>
          <h3>(Solves #3, #4 from https://github.com/evancz/elm-architecture-tutorial)</h3>
          <AddDynamicCounters/>
        </div>
      </div>
    )
  }
}
