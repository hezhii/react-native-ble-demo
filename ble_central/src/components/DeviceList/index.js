import React from 'react'
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native'

export default class DeviceList extends React.PureComponent {
  renderItem = ({ item }) => {
    const { onPress } = this.props
    return (
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.id}</Text>
          <Text style={styles.desc}>{item.localName || item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { data } = this.props
    return (
      <FlatList
        style={styles.list}
        ListEmptyComponent={() => <Text style={styles.placeholder}>暂无数据</Text>}
        data={data}
        ItemSeparatorComponent={() => <View style={styles.border} />}
        keyExtractor={(item, index) => '' + index}
        renderItem={this.renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 15
  },
  item: {
    paddingLeft: 16,
    paddingVertical: 8
  },
  title: {
    fontSize: 16
  },
  desc: {
    color: '#666'
  },
  border: {
    backgroundColor: '#d9d9d9',
    height: 0.5
  },
  placeholder: {
    fontSize: 16,
    paddingLeft: 15,
    color: '#666'
  }
})