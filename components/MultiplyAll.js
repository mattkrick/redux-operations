import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  return {
    result: state.multiplyAll
  }
}

@connect(mapStateToProps)
export default class ClickCounter extends Component {
  render() {
    const {result} = this.props
    return (
      <div>
        <p>
          Total multiply: {result}
        </p>
      </div>
    )
  }
}
