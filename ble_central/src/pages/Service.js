import React from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { WingBlank, List } from '@ant-design/react-native'

const ListItem = List.Item
const Brief = ListItem.Brief;

export default class Service extends React.PureComponent {
  static navigationOptions = {
    title: '服务'
  }

  constructor(props) {
    super(props)
    const { navigation } = props
    this.device = navigation.getParam('device')
    this.state = {
      services: [],
      loading: false
    }
  }

  componentDidMount() {
    this.getServices()
  }

  getServices() {
    this.setState({
      loading: true
    })
    this.device.services()
      .then(services => {
        console.log(services)
        this.setState({
          services,
          loading: false
        })
      })
  }

  onPressService = (service) => {
    const { navigation } = this.props
    navigation.push('Characteristic', { service })
  }

  render() {
    const { services } = this.state
    const device = this.device
    return (
      <SafeAreaView style={styles.fill}>
        <WingBlank style={{ paddingVertical: 10 }}>
          <Text style={styles.label}>设备 ID:</Text>
          <Text style={styles.value}>{this.device.id}</Text>
          <Text style={styles.label}>设备名称:</Text>
          <Text style={styles.value}>{device.localName || device.name || '无'}</Text>
        </WingBlank>
        <View style={styles.listHeader}>
          <Text style={styles.headerTitle}>服务列表</Text>
        </View>
        <ScrollView style={styles.fill}>
          <List>
            {services.map((service, index) => (
              <ListItem key={index} arrow="horizontal" onPress={() => this.onPressService(service)}>
                {service.id}
                <Brief>{`UUID: ${service.uuid}`}</Brief>
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
    marginBottom: 10
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