import { createStore, compose } from 'redux'
import reduxOperations from './reduxOperations';
import reducer from '../reducers'


const enhancer = compose(
    // Middleware you want to use in development:
    reduxOperations(),
    // Required! Enable Redux DevTools with the monitors you chose
    window.devToolsExtension()
);

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(reducer, initialState, enhancer);
  return store;
}
