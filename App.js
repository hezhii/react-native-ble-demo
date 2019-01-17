import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Linking
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const Button = ({ children, onPress, disabled, style }) => {
  const handlePress = () => {
    if (!disabled) {
      onPress && onPress();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.button, style, disabled && styles.disabledBtn]}>
        <Text style={styles.btnText}>{children}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      bleState: null,
      scanning: false,
      devices: []
    };
    this._initBleManager();
  }

  _initBleManager() {
    const manager = this.bleManager = new BleManager();

    manager.onStateChange(this.onStateChange);
    this._checkState();
  }

  _checkState = () => {
    this.bleManager.state()
      .then(state => {
        console.log('检查蓝牙状态：', state);
        this.setState({
          bleState: state
        })
        if (state === 'PoweredOff') {
          this._showAlert();
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
    );
  }

  _onOpenBluetooth = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=Bluetooth');
    } else {
      this.bleManager.enable();
    }
  }

  // 蓝牙状态发生变化
  onStateChange = (state) => {
    console.log('蓝牙状态发生变化，新的状态为：', state);
    this.setState({
      bleState: state
    });
    if (state === 'PoweredOff') {
      this._showAlert();
    }
  }

  // 搜索到设备
  onScannedDevice = (err, device) => {
    console.log('搜索到设备：\n', device)
    const { devices } = this.state;
    if (devices.findIndex(item => item.id === device.id) < 0) {
      this.setState({
        devices: [...devices, device]
      })
    }
  }

  // 搜索设备
  scanDevices = () => {
    const { bleState } = this.state;
    if (bleState === 'PoweredOn') {
      console.log('开始搜索设备');
      this.setState({ scanning: true, devices: [] })
      this.bleManager.startDeviceScan(null, { allowDuplicates: false }, this.onScannedDevice)
    } else {
      this._showAlert();
    }
  }

  // 停止搜索设备
  stopScan = () => {
    console.log('停止搜索设备');
    this.setState({ scanning: false });
    this.bleManager.stopDeviceScan();
  }

  renderDevice = ({ item }) => {
    return (
      <View style={styles.device}>
        <Text style={styles.deviceId}>{item.id}</Text>
        <Text style={styles.deviceName}>{item.localName || item.name}</Text>
      </View>
    )
  }

  render() {
    const { scanning, devices } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {scanning && <ActivityIndicator size="large" />}
          <View style={styles.buttonContainer}>
            <Button style={{ marginRight: 16 }} onPress={this.stopScan} disabled={!scanning}>停止搜索</Button>
            <Button onPress={this.scanDevices} disabled={scanning}>开始搜索</Button>
          </View>
        </View>
        <FlatList
          data={devices}
          ItemSeparatorComponent={() => <View style={styles.border} />}
          keyExtractor={(item, index) => '' + index}
          renderItem={this.renderDevice}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1890ff'
  },
  btnText: {
    color: '#fff'
  },
  disabledBtn: {
    opacity: 0.4
  },
  device: {
    paddingLeft: 16,
    paddingVertical: 8
  },
  deviceId: {
    fontSize: 16,
    paddingVertical: 8,
  },
  deviceName: {
    color: '#666'
  },
  border: {
    backgroundColor: '#d9d9d9',
    height: 1
  },
});
