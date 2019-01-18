import React from 'react'
import { createAppContainer, createStackNavigator } from 'react-navigation'

import Device from './pages/Device'
import Search from './pages/Search'
import Service from './pages/Service'
import Characteristic from './pages/Characteristic'
import Operation from './pages/Operation'

const AppNavigator = createStackNavigator({
  Search,
  Device,
  Service,
  Characteristic,
  Operation
}, {
    defaultNavigationOptions: {
      headerTitleStyle: {
        fontSize: 18,
      },
      headerBackTitle: '返回',
    },
  })

export default createAppContainer(AppNavigator)
