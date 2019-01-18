import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-navigation'

export default class Characteristic extends React.PureComponent {
  static navigationOptions = {
    title: '特征'
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