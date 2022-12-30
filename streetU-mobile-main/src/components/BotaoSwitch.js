import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { Text } from './Text';

const css = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    Toggle: {
        marginRight: 15,
    }
});

const container = css.container;
const Toggle = css.Toggle;

export const BotaoSwitch = ({ txtSwitch, valor, acaoToggle }) => {
    return (
        <View style={container}>
            <Switch
                style={Toggle}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={valor ? colors.white : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={acaoToggle}
                value={valor}
            />
            <Text>{txtSwitch}</Text>
        </View>
    )
}