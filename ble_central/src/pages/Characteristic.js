import React from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { WingBlank, List } from '@ant-design/react-native'

const ListItem = List.Item
const Brief = ListItem.Brief;

export default class Characteristic extends React.PureComponent {
  static navigationOptions = {
    title: '特征'
  }

  constructor(props) {
    super(props)
    const { navigation } = props
    this.service = navigation.getParam('service')
    this.state = {
      characteristics: []
    }
  }

  componentDidMount() {
    this.getCharacteristics()
  }

  getCharacteristics() {
    this.service.characteristics()
      .then(characteristics => {
        this.setState({
          characteristics
        })
      })
  }

  onPressCharacteristic = (characteristic) => {
    const { navigation } = this.props
    navigation.push('Operation', { characteristic })
  }

  render() {
    const { characteristics } = this.state
    const service = this.service
    return (
      <SafeAreaView style={styles.fill}>
        <WingBlank style={{ paddingVertical: 10 }}>
          <Text style={styles.label}>服务 ID:</Text>
          <Text style={styles.value}>{service.id}</Text>
          <Text style={styles.label}>服务 UUID:</Text>
          <Text style={styles.value}>{service.uuid}</Text>
        </WingBlank>
        <View style={styles.listHeader}>
          <Text style={styles.headerTitle}>特征列表</Text>
        </View>
        <ScrollView style={styles.fill}>
          <List>
            {characteristics.map((characteristic, index) => (
              <ListItem key={index} arrow="horizontal" onPress={() => this.onPressCharacteristic(characteristic)}>
                {characteristic.id}
                <Brief>{`UUID: ${characteristic.uuid}`}</Brief>
              </ListItem>
            ))}
          </List>
        </ScrollView>
      </SafeAreaView >
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
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f9',
    padding: 15
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '500'
  }
})