import React, { Component, PropTypes } from 'react'
import {walkState} from 'redux-operations';
import {} from '../ducks/counter';
import Counter from './Counter';
import {connect} from 'react-redux';


const mapStateToProps = (state) => {
  return {
    numberOfCounters: state.numberOfCounters
  }
}

@connect(mapStateToProps)
export default class AddDynamicCounters extends Component {
  render() {
    const { numberOfCounters } = this.props;
    const counterArr = [];
    for (let i = 0; i < numberOfCounters; i++) {
      counterArr.push(i);
    }
    return (
      <div>
        <Counter location={['numberOfCounters']}/>
        {numberOfCounters ? <h3>ALL THE COUNTERS</h3> : null}
        <div className="allCounters">{counterArr.map(val => this.renderCounter(val))}</div>
      </div>
    )
  }
  renderCounter = (counterIdx) => {
    return <Counter location={['counters', counterIdx]} key={`counter${counterIdx}`} />;
  };
}
