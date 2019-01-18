import React from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import { Toast, Portal } from '@ant-design/react-native'

import Button from '../components/Button'
import DeviceList from '../components/DeviceList'
import { ADD_DEVICE } from '../reducer/connectedDevice'

@connect(({ connectedDevice }) => ({
  connectedDevices: connectedDevice.list
}))
export default class Search extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: '搜索设备',
    headerRight: (
      <HeaderButtons>
        <Item
          title="已连接的设备"
          buttonStyle={{ color: '#1890ff', fontSize: 16 }}
          onPress={() => navigation.push('Device')}
        />
      </HeaderButtons>
    ),
  })

  constructor(props) {
    super(props)

    this.state = {
      bleState: null,
      scanning: false,
      devices: []
    }
    this._initBleManager()
  }

  componentWillUnmount() {
    this.bleManager.destroy()
  }

  _initBleManager() {
    const manager = this.bleManager = new BleManager()

    manager.onStateChange(this.onStateChange)
    this._checkState()
  }

  _checkState = () => {
    this.bleManager.state()
      .then(state => {
        console.log('检查蓝牙状态：', state)
        this.setState({
          bleState: state
        })
        if (state === 'PoweredOff') {
          this._showAlert()
        }
      })
  }

  _showAlert() {
    Alert.alert(
      '蓝牙未开启',
      '需要您开启蓝牙才能使用后续功能',
      [
        { text: '取消' },
        { text: '开启蓝牙', onPress: this._onOpenBluetooth }
      ]
    )
  }

  _onOpenBluetooth = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=Bluetooth')
    } else {
      this.bleManager.enable()
    }
  }

  // 蓝牙状态发生变化
  onStateChange = (state) => {
    console.log('蓝牙状态发生变化，新的状态为：', state)
    this.setState({
      bleState: state
    })
    if (state === 'PoweredOff') {
      this._showAlert()
    }
  }

  // 搜索到设备
  onScannedDevice = (err, device) => {
    const { devices } = this.state
    if (devices.findIndex(item => item.id === device.id) < 0) {
      this.setState({
        devices: [...devices, device]
      })
    }
  }

  // 搜索设备
  scanDevices = () => {
    const { bleState } = this.state
    if (bleState === 'PoweredOn') {
      console.log('开始搜索设备')
      this.setState({ scanning: true, devices: [] })
      this.bleManager.startDeviceScan(null, { allowDuplicates: false }, this.onScannedDevice)
    } else {
      this._showAlert()
    }
  }

  // 停止搜索设备
  stopScan = () => {
    if (this.state.scanning) {
      console.log('停止搜索设备')
      this.setState({ scanning: false })
      this.bleManager.stopDeviceScan()
    }
  }

  clearDevices = () => {
    this.setState({
      devices: []
    })
  }

  connectDevice = async (device) => {
    const { connectedDevices, dispatch, navigation } = this.props
    const index = connectedDevices.findIndex(item => item.id === device.id)
    if (index >= 0) {
      Alert.alert('已经连接该设备了')
      return
    }
    this.stopScan() // 连接时停止扫描
    const key = Toast.loading('正在连接设备...')
    await device.connect()
    console.log('成功连接设备：', device.id)
    await device.discoverAllServicesAndCharacteristics()
    console.log('获取设备的服务和特征')
    Portal.remove(key)
    dispatch({
      type: ADD_DEVICE,
      payload: device
    })
    Alert.alert('成功连接设备', null, [
      { text: '算了' },
      { text: '去看看', onPress: () => navigation.push('Device') }
    ])
  }

  renderDevice = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.connectDevice(item)}>
        <View style={styles.listItem}>
          <Text style={styles.itemId}>{item.id}</Text>
          <Text style={styles.itemName}>{item.localName || item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { scanning, devices } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button
            style={{ marginRight: 16 }}
            onPress={this.scanDevices}
            disabled={scanning}
          >{scanning ? '正在搜索' : '开始搜索'}</Button>
          <Button
            onPress={this.stopScan}
            disabled={!scanning}
          >停止搜索</Button>
        </View>
        <View style={styles.listHeader}>
          <View style={styles.row}>
            <Text style={styles.headerTitle}>可用设备</Text>
            {scanning && <ActivityIndicator />}
          </View>
          <TouchableOpacity onPress={this.clearDevices}>
            <Text>清空</Text>
          </TouchableOpacity>
        </View>
        <DeviceList
          onPress={this.connectDevice}
          data={devices}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    marginRight: 6,
    fontWeight: '500'
  }
})