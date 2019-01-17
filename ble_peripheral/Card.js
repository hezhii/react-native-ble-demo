import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Card extends React.PureComponent {
  render() {
    const { title, children, style, headerStyle, contentStyle, extra } = this.props;
    return (
      <View style={[styles.card, style]}>
        <View style={[styles.header, headerStyle]}>
          <Text style={styles.title}>{title}</Text>
          {extra}
        </View>
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E7E9EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  content: {
    padding: 16,
  },
});