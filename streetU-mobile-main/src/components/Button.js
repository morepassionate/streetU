import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../constants/colors';
import { Text } from '../components/Text';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 7,
    height: 60
  },
  containerOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 3,
    borderRadius: 10,
  },

  text: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 18,
    marginTop: 2,
    fontWeight: '800',
  },
  textOutline: {
    color: colors.white,
  },
});

export const Button = ({ onPress = () => {}, children = '', type }) => {
  const containerStyles = [styles.container];
  const textStyles = [styles.text];

  if (type === 'outline') {
    containerStyles.push(styles.containerOutline);
    textStyles.push(styles.textOutline);
  }

  return (
    <TouchableOpacity onPress={onPress} style={containerStyles}>
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
}; 