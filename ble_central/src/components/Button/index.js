import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

export default ({ children, onPress, disabled, style }) => {
  if (disabled) {
    return (
      <View style={[styles.button, style, styles.disabledBtn]}>
        <Text style={styles.btnText}>{children}</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, style]}>
        <Text style={styles.btnText}>{children}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
  }
})