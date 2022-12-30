import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

import colors from '../constants/colors';

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'CircularStd'
  },
  headerText: {
    fontWeight: '600',
    fontSize: 32,
    marginBottom: '10%', 
    fontFamily: 'CircularStd'

  },
  subHeaderText: {
    color: colors.gray,
    fontSize: 20,
    marginBottom: 12,
    marginTop: -12, 
    fontFamily: 'CircularStd'

  },
  outlineText: { 
    color: colors.white,
    marginBottom: 15,
    marginTop: 15,
    alignSelf: 'center',  
    borderBottomWidth: 1,
    borderColor: colors.white,
    fontSize: 18,
    fontFamily: 'CircularStd'

  },
  componentText:{
    marginLeft: 10,
    color: colors.cinzaTxt,
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'CircularStd'

  },
  txtErro: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.error
}
});

export const Text = ({ type, children, style = {}, ...rest}) => { 
  let textStyles = [styles.text];

  if (type === 'header') {
    textStyles.push(styles.headerText);
  } else if (type === 'subheader') {
    textStyles.push(styles.subHeaderText);
  } else if(type === 'outline'){
    textStyles.push(styles.outlineText)
  } else if(type === 'component'){
    textStyles.push(styles.componentText)
  } else if(type === 'error'){
    textStyles.push(styles.txtErro)
  }

  if (Array.isArray(style)) {
    textStyles = [...textStyles, ...style];
  } else {
    textStyles.push(style);
  }

  return <RNText style={textStyles} {...rest}>{children}</RNText>;
};
