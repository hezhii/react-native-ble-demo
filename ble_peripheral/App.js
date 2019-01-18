import React from 'react'
import { StyleSheet, ScrollView, Button, Text, View, TextInput, Alert } from 'react-native'
import BLEPeripheral from 'react-native-ble-peripheral'
import uuidv4 from 'uuid/v4'

function formatData(hexStr) {
  let len = hexStr.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  let pos = 0;
  const arr = [];
  for (let i = 0; i < len; i++) {
    const v = parseInt(hexStr.substr(pos, 2), 16);
    arr.push(v);
    pos += 2;
  }
  console.log(`十六进制字符串:${hexStr}，转换后的结果为:\n`, arr)
  return arr;
}

export default class App extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      sendData: ''
    }
    this.init()
  }

  // 生成服务和特征，由于广播数据大小的限制，只生成一个服务和特征
  init() {
    const serviceId = this.serviceId = uuidv4()
    const characteristicId = this.characteristicId = uuidv4()

    BLEPeripheral.addService(serviceId, true);
    /*
    * 添加特征，参数参考：
    * https://github.com/himelbrand/react-native-ble-peripheral#add-characteristic
    * https://developer.android.com/reference/android/bluetooth/BluetoothGattCharacteristic
    * 
    * 属性和权限是 int 型，通过数值相加添加多个权限和属性，多个之间通过 | 连接。
    * 
    * 这里添加了可读、可写权限和属性
    */
    BLEPeripheral.addCharacteristicToService(serviceId, characteristicId, 1 | 16, 16 | 2 | 4 | 8);
  }

  start = () => {
    BLEPeripheral.start()
      .then(res => {
        Alert.alert('成功开始广播', '现在设备可以被搜索到了')
      }).catch(err => {
        const message = err.message === 'Advertising onStartFailure: 1' ? '广播数据太多了' : err.message
        Alert.alert('广播失败', message)
      })
  }

  sendNotify = () => {
    const { sendData } = this.state;
    BLEPeripheral.sendNotificationToDevices(this.serviceId, this.characteristicId, formatData(sendData));
  }

  render() {
    const { sendData } = this.state
    return (
      <ScrollView style={styles.container}>
        <Button title="开始广播" color="#096dd9" onPress={this.start} />
        <View style={styles.info}>
          <Text style={styles.label}>服务 ID:</Text>
          <Text style={styles.value}>{this.serviceId}</Text>
          <Text style={styles.label}>特征 ID:</Text>
          <Text style={styles.value}>{this.characteristicId}</Text>
        </View>
        <View style={styles.row}>
          <Text>数据:</Text>
          <TextInput
            style={styles.input}
            placeholder="请填写十六进制数（如：10A1）"
            value={sendData}
            onChangeText={v => this.setState({ sendData: v })}
          />
        </View>
        <Button title="发送通知" color="#096dd9" onPress={this.sendNotify} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  info: {
    marginTop: 16
  },
  label: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500'
  },
  value: {
    marginTop: 5,
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    paddingLeft: 15,
    flex: 1
  },
})
