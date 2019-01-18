import React from 'react'
import { StyleSheet, Text, ScrollView, View, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { WingBlank, Button } from '@ant-design/react-native'
import { Buffer } from 'buffer/'

function formatToDecimal(buffer) {
  const hexStr = buffer.toString('hex')
  return hexStr ? parseInt(hexStr, 16) : ''
}

function strToBinary(str) {
  const result = [];
  const list = str.split("");
  for (let i = 0; i < list.length; i++) {
    const str = list[i].charCodeAt().toString(2);
    result.push(str);
  }
  return result.join("");
}

export default class Operation extends React.PureComponent {
  static navigationOptions = {
    title: '读写特征'
  }

  constructor(props) {
    super(props)
    const { navigation } = props
    this.characteristic = navigation.getParam('characteristic')
    this.state = {
      readValue: '',
      writeValue: ''
    }
  }

  read = () => {
    this.characteristic.read()
      .then(characteristic => {
        console.log('读取特征值：', characteristic.value)
        this.setState({
          // readValue: Buffer.from(characteristic.value, 'base64').toString()
          readValue: characteristic.value
        })
      })
  }

  write = () => {
    const { writeValue } = this.state
    if (!writeValue) {
      Alert.alert('请输入要写入的特征值')
    }
    const str = Buffer.from(writeValue, 'hex').toString('base64')
    console.log('开始写入特征值：', str)
    this.characteristic.writeWithResponse(str)
      .then(() => {
        console.log('成功写入特征值')
      })
  }

  render() {
    const charac = this.characteristic
    const { readValue, writeValue } = this.state;
    const buffer = Buffer.from(readValue, 'base64');
    return (
      <SafeAreaView style={styles.fill}>
        <ScrollView style={styles.fill}>
          <WingBlank style={{ paddingVertical: 10 }}>
            <Text style={styles.label}>特征 ID:</Text>
            <Text style={styles.value}>{charac.id}</Text>
            <Text style={styles.label}>特征 UUID:</Text>
            <Text style={styles.value}>{charac.uuid}</Text>
            <View style={styles.attributeWrapper}>
              <Text style={styles.name}>
                可读:
             <Text style={styles.des}>{charac.isReadable ? '是' : '否'}</Text>
              </Text>
              <Text style={styles.name}>
                可写(有响应):
              <Text style={styles.des} >{charac.isWritableWithResponse ? '是' : '否'}</Text>
              </Text>
              <Text style={styles.name}>
                可写(无响应):
              <Text style={styles.des}>{charac.isWritableWithoutResponse ? '是' : '否'}</Text>
              </Text>
              <Text style={styles.name}>
                可通知:
              <Text style={styles.des}>{charac.isNotifiable ? '是' : '否'}</Text>
              </Text>
            </View>
            <Text style={styles.label}>当前特征值</Text>
            <Text style={styles.charac}>{`二进制: ${strToBinary(buffer.toString())}`}</Text>
            <Text style={styles.charac}>{`十进制: ${formatToDecimal(buffer)}`}</Text>
            <Text style={styles.charac}>{`十六进制: ${buffer.toString('hex')}`}</Text>
            <Text style={styles.charac}>{`UTF8: ${buffer.toString()}`}</Text>
            <Button type="primary" style={{ marginTop: 8 }} onPress={this.read}>读取特征值</Button>
            <TextInput
              style={styles.input}
              placeholder="请输入特征值（十六进制字符串）"
              value={writeValue}
              onChangeText={v => this.setState({ writeValue: v })}
            />
            <Button type="primary" onPress={this.write}>写入特征值</Button>
          </WingBlank>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
  },
  value: {
    marginTop: 8,
    marginBottom: 10,
    color: '#666'
  },
  attributeWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16
  },
  des: {
    color: '#666'
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    marginRight: 16
  },
  input: {
    marginVertical: 32
  },
  charac: {
    fontSize: 15,
    color: '#666',
    marginVertical: 5
  }
})