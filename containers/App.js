import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import ClickCounter from '../components/ClickCounter'
import MultiplyAll from '../components/MultiplyAll'
import React, { Component, PropTypes } from 'react'

const topCounter = ['counters', 'top'];
const bottomCounter = ['counters', 'bottom'];

export default class Counters extends Component {
  render() {
    return (
      <div>
        <div className="plain-counter">
          <h1>1. Plain counter</h1>
          <Counter/>
        </div>
        <div className="top-bottom">
          <h1>2. Top/Bottom counters</h1>
          <Counter location={topCounter}/>
          <Counter location={bottomCounter}/>
        </div>
        <div className="sum-all-clicks">
          <h1>3. Number of times all counters were incremented</h1>
          <ClickCounter/>
        </div>
        <div className="sum-all-clicks">
          <h1>4. All counters clicked multiplied by value of last counter clicked</h1>
          <h3>(Solves htth3s://github.com/reactjs/redux/issues/1315#issue-129937015)</h3>
          <MultiplyAll/>
        </div>
      </div>
    )
  }
}
