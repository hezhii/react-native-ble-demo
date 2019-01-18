import React from 'react'
import { StyleSheet, Text, ScrollView, View, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { WingBlank, Button } from '@ant-design/react-native'
import { Buffer } from 'buffer/'

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
        console.log(characteristic === this.characteristic);
        console.log('读取特征:', characteristic)
      })
  }

  write = () => {
    const { writeValue } = this.state
    if (!writeValue) {
      Alert.alert('请输入要写入的特征值')
    }
    console.log(writeValue);
    console.log(Buffer.from(writeValue, 'hex'))
    console.log(Buffer.from(writeValue, 'hex').toString('base64'))
    // this.characteristic.writeWithResponse()
  }

  render() {
    const charac = this.characteristic || {}
    const { readValue, writeValue } = this.state;
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
            <Text style={styles.label}>当前特征值:</Text>
            <Text style={styles.value}>{readValue || '无'}</Text>
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
  }
})