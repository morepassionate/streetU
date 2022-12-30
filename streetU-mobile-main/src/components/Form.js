import React from 'react';
import { TextInput as RNTextInput, StyleSheet, View, Platform } from 'react-native';

import { Text } from './Text';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 30,
    backgroundColor: colors.pretoInput,
    height: 70,
    padding: 10,
    borderRadius: 10
  },
  labelText: {
    color: colors.cinzaTxt,
    fontSize: 14,
    paddingLeft: 10,
    marginBottom: 2
  },
  textInput: {
    fontSize: 18,
    fontWeight: '500',
    paddingBottom: 10,
    paddingLeft: 10,
    color: colors.white,
  },
  border: {
    height: 1,
    backgroundColor: colors.border,
  },
  borderError: {
    backgroundColor: colors.error,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
  },
});

export const TextInput = ({ ref, label, errorText, valor, ...rest }) => {
  const borderStyles = [styles.border];

  if (errorText && errorText.length > 0) {
    borderStyles.push(styles.borderError);
  }

  return (
    <View style={styles.inputContainer}>
      {!!valor ?
        <Text style={styles.labelText}>{label}</Text> :
        <View style={{ height: Platform.OS === 'ios' ? 15 : 10 }} />}
      <RNTextInput
        placeholderTextColor={colors.white}
        style={styles.textInput}
        value={valor} {...rest} />
      <Text style={[styles.errorText, { marginTop: !!valor ? 12 : 15 }]}>{errorText}</Text>
    </View>
  );
};
