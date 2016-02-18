export const INCREMENT_COUNTER1 = 'INCREMENT_COUNTER1'
export const INCREMENT_COUNTER2 = 'INCREMENT_COUNTER2'
export const DECREMENT_COUNTER1 = 'DECREMENT_COUNTER1'
export const DECREMENT_COUNTER2 = 'DECREMENT_COUNTER2'

export function increment1(location, name) {
  return {
    type: INCREMENT_COUNTER1,
    meta: {location, name}
  }
}

export function increment2() {
  return {
    type: INCREMENT_COUNTER2
  }
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  }
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState()

    if (counter % 2 === 0) {
      return
    }

    dispatch(increment())
  }
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment())
    }, delay)
  }
}
