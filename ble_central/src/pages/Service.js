import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-navigation'

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

  render() {
    return (
      <SafeAreaView style={styles.container}>

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})