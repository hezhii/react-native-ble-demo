import React from 'react'
import { createAppContainer, createStackNavigator } from 'react-navigation'

import Device from './pages/Device'
import Search from './pages/Search'

const AppNavigator = createStackNavigator({
  Search,
  Device,
}, {
    defaultNavigationOptions: {
      headerTitleStyle: {
        fontSize: 18,
      },
      headerBackTitle: '返回',
    },
  })

export default createAppContainer(AppNavigator)
