import React from 'react'
import { Provider } from 'react-redux'

import store from './store/configureStore'
import Navigator from './navigator'

export default class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    )
  }
}