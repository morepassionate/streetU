import React from 'react';
import { View, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import colors from '../constants/colors';

const css = StyleSheet.create({
    styleCheckBox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderColor: colors.white,
    }
})

const StyleCheckBox = [css.styleCheckBox];

export const CheckBox = ({ valor, setValor }) => {

    return (
        <Checkbox
            style={StyleCheckBox}
            value={valor}
            onValueChange={setValor}
            color={valor ? colors.primary: colors.white}
        />
    )
}