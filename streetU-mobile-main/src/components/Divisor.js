import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { AnimatedView } from './AnimatedView';

const css = StyleSheet.create({
    divisor: {
        height: 2,
        backgroundColor: colors.cinzaTxt, 
    },
});

const divisor = [css.divisor];

export const Divisor = ({...rest}) => {
    return (
        <AnimatedView duration={1800} style={divisor} {...rest}/>
    )
}