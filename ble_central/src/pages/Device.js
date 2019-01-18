import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'

import DeviceList from '../components/DeviceList'

@connect(({ connectedDevice }) => ({
  devices: connectedDevice.list
}))
export default class Device extends React.PureComponent {
  static navigationOptions = {
    title: '已连接的设备'
  }

  onPressDevice = (item) => {
    const { navigation } = this.props
    navigation.push('Service', { device: item })
  }

  render() {
    const { devices } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <DeviceList data={devices} onPress={this.onPressDevice} />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})