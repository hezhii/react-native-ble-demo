import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import uuidv1 from 'uuid/v1';
import BLEPeripheral from 'react-native-ble-peripheral'

import Card from './Card';

function formatData(hexStr) {
  let len = str.length;
  if (len % 2 != 0) {
    return null;
  }
  len /= 2;
  let pos = 0;
  const arr = [];
  for (let i = 0; i < len; i++) {
    const v = parseInt(str.substr(pos, 2), 16);
    hexA.push(v);
    pos += 2;
  }
  console.log(`十六进制字符串:${hexStr}，转换后的结果为:\n`, arr)
  return arr;
}

export default class App extends React.PureComponent {
  state = {
    services: [],
    characteristics: [],
    serviceId: '',
    sendServiceId: '',
    sendCharId: '',
    sendData: ''
  }

  onAddService = () => {
    const { services } = this.state;
    const serviceId = uuidv1();
    BLEPeripheral.addService(serviceId, true);
    this.setState({
      services: [...services, serviceId]
    })
    console.log('添加服务...\n服务 ID 为:', serviceId);
  }

  onAddCharacteristics = () => {
    const { characteristics, serviceId } = this.state;
    if (!serviceId) {
      Alert.alert('请填写特征所属的服务 ID');
    }
    const id = uuidv1();
    BLEPeripheral.addCharacteristicToService(serviceId, id, 16, 8);
    this.setState({
      characteristics: [...characteristics, id]
    })
    console.log(`添加特征...\n服务 ID 为:${serviceId}；特征 ID 为:${id}`)
  }

  start = () => {
    BLEPeripheral.start()
      .then(res => {
        console.log(res)
        console.log('开始广播')
      }).catch(error => {
        console.log('启动广播出错：', error)
      })
  }

  sendNotify = () => {
    const { sendServiceId, sendCharId, sendData } = this.state;
    BLEPeripheral.sendNotificationToDevices(sendServiceId, sendCharId, formatData(sendData));
  }

  renderItem = ({ item }) => {
    return <Text style={styles.text} selectable>{item}</Text>
  }

  render() {
    const {
      services,
      characteristics,
      serviceId,
      sendServiceId,
      sendCharId,
      sendData
    } = this.state;

    const service = (
      <TouchableOpacity onPress={this.onAddService}>
        <Text style={styles.extraBtn}>添加服务</Text>
      </TouchableOpacity>
    );

    const characteristic = (
      <TouchableOpacity onPress={this.onAddCharacteristics}>
        <Text style={styles.extraBtn}>添加特征</Text>
      </TouchableOpacity>
    );
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.readme}>{`使用方法：\n1. 点击开始广播；\n2. 添加服务；\n3. 复制服务 ID，添加特征；\n4. 再次点击开始广播。\n如果先添加服务和特征再广播会报错，第一次点击广播时，没有服务和特征。`}</Text>
        <View style={styles.btnContainer}>
          <Button title="开始广播" color="#096dd9" onPress={this.start} />
        </View>
        <Card title="服务" style={styles.card} extra={service}>
          <FlatList
            data={services}
            keyExtractor={(item, index) => '' + index}
            renderItem={this.renderItem}
          />
        </Card>
        <Card title="特征" style={styles.card} extra={characteristic}>
          <View style={styles.formItem}>
            <Text>服务 ID:</Text>
            <TextInput
              value={serviceId}
              style={styles.input}
              placeholder="请输入服务 ID"
              onChangeText={v => this.setState({ serviceId: v })}
            />
          </View>
          <FlatList
            data={characteristics}
            keyExtractor={(item, index) => '' + index}
            renderItem={this.renderItem}
          />
        </Card>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <Text>服务:</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入服务 ID"
              value={sendServiceId}
              onChangeText={v => this.setState({ sendServiceId: v })}
            />
          </View>
          <View style={styles.formItem}>
            <Text>特征:</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入特征 ID"
              value={sendCharId}
              onChangeText={v => this.setState({ sendCharId: v })}
            />
          </View>
          <View style={styles.formItem}>
            <Text>数据:</Text>
            <TextInput
              style={styles.input}
              placeholder="请填写十六进制数（如：10A1）"
              value={sendData}
              onChangeText={v => this.setState({ sendData: v })}
            />
          </View>
          <Button title="发送通知" color="#096dd9" onPress={this.sendNotify} />
        </View>
      </ScrollView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  readme: {
    marginVertical: 10,
  },
  btnContainer: {
    marginBottom: 15,
  },
  card: {
    marginBottom: 15
  },
  extraBtn: {
    fontSize: 13,
    color: '#096dd9',
  },
  form: {
    paddingBottom: 15
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    paddingLeft: 15,
    flex: 1
  },
  text: {
    fontSize: 16,
    color: '#333'
  }
});
