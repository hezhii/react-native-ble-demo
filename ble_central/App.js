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
  Linking,
  ScrollView
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
      devices: [],
      connectedDevice: null,
      services: []
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
    if (this.state.scanning) {
      console.log('停止搜索设备');
      this.setState({ scanning: false });
      this.bleManager.stopDeviceScan();
    }
  }

  connectDevice = async (device) => {
    let { connectedDevice } = this.state;
    /*
     * 如果已经连接过该设备，则弹框提示。
     * 如果已经连接了其他设备，则先断开与该设备的连接。 
     */
    if (connectedDevice) {
      if (connectedDevice.id === device.id) {
        Alert.alert('已经连接了该设备');
        return;
      } else {
        await connectedDevice.cancelConnection();
        console.log(`断开与 ${connectedDevice.id} 的连接`);
      }
    }

    this.stopScan(); // 连接时停止扫描
    connectedDevice = await device.connect();
    console.log('成功连接设备：', connectedDevice.id);
    this.setState({
      connectedDevice
    })

    await device.discoverAllServicesAndCharacteristics();
    const services = await device.services();
    this.setState({
      services
    });
  }

  renderDevice = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.connectDevice(item)}>
        <View style={styles.listItem}>
          <Text style={styles.itemId}>{item.id}</Text>
          <Text style={styles.itemName}>{item.localName || item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }


  renderService = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.connectDevice(item)}>
        <View style={styles.listItem}>
          <Text style={styles.itemId}>{item.id}</Text>
          <Text style={styles.itemName}>{item.uuid}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    const { scanning, devices, connectedDevice, services } = this.state;
    return (
      <SafeAreaView style={styles.fill}>
        <ScrollView>
          <View style={styles.header}>
            {scanning && <ActivityIndicator size="large" />}
            <View style={styles.buttonContainer}>
              <Button style={{ marginRight: 16 }} onPress={this.stopScan} disabled={!scanning}>停止搜索</Button>
              <Button onPress={this.scanDevices} disabled={scanning}>开始搜索</Button>
            </View>
          </View>
          <FlatList
            ListEmptyComponent={() => <Text style={styles.placeholder}>暂无设备</Text>}
            data={devices}
            ItemSeparatorComponent={() => <View style={styles.border} />}
            keyExtractor={(item, index) => '' + index}
            renderItem={this.renderDevice}
            style={styles.list}
          />
          <View style={styles.wrapper}>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>当前连接的设备：</Text>
              <Text>{connectedDevice ? connectedDevice.id : '尚未连接任何设备'}</Text>
            </View>
          </View>
          <FlatList
            ListEmptyComponent={() => <Text style={styles.placeholder}>暂无服务</Text>}
            data={services}
            ItemSeparatorComponent={() => <View style={styles.border} />}
            keyExtractor={(item, index) => '' + index}
            renderItem={this.renderService}
            style={[styles.list, { height: 200 }]}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
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
  listItem: {
    paddingLeft: 16,
    paddingVertical: 8
  },
  itemId: {
    fontSize: 16
  },
  itemName: {
    color: '#666'
  },
  border: {
    backgroundColor: '#d9d9d9',
    height: 0.5
  },
  list: {
    height: 300,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: '#E7E9EB',
  },
  wrapper: {
    paddingTop: 16,
    paddingHorizontal: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  placeholder: {
    paddingLeft: 16,
    color: '#666'
  }
});
