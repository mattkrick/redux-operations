import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  return {
    clickCounter: state.clickCounter
  }
}

@connect(mapStateToProps)
export default class ClickCounter extends Component {
  render() {
    const {clickCounter} = this.props
    return (
      <div>
        <p>
          All counters clicked: {clickCounter} times
        </p>
      </div>
    )
  }
}
