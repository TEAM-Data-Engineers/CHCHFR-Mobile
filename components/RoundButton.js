import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const RoundButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 50, // 圆形按钮
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    cursor: 'pointer',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16.6666666667,
  },
});

export default RoundButton;
