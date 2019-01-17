import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class App extends React.PureComponent {
  render() {
    return (
      <View style={styles.fill}>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
