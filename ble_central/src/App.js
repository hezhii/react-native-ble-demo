import React from 'react'
import { Provider } from 'react-redux'
import { Provider as AntProvider } from '@ant-design/react-native'

import store from './store/configureStore'
import Navigator from './navigator'

export default class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <AntProvider>
          <Navigator />
        </AntProvider>
      </Provider>
    )
  }
}