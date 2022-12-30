import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { Text } from './Text';

const css = StyleSheet.create({
    ContainerBotaoInative: {
        margin: 10,
        padding: 8,
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 15,
    },
    ContainerBotaoAtive: {
        margin: 10,
        padding: 8,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 15,
    },
    TxtInative: {
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
        color: colors.white
    },
    TxtAtive: {
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
        color: colors.primary
    }
});

const ContainerBotaoInative = css.ContainerBotaoInative;
const ContainerBotaoAtive = css.ContainerBotaoAtive;
const TxtAtive = [css.TxtAtive];
const TxtInative = [css.TxtInative];

export const CardCategorias = ({ data, index, indexEscolhido, setIndexEscolhido }) => {
    const item = data?.nome; 
    return (
        <TouchableOpacity style={ index === indexEscolhido ? ContainerBotaoAtive : ContainerBotaoInative} onPress={() => setIndexEscolhido(index)} >
            <Text style={index === indexEscolhido ? TxtAtive : TxtInative}>{item}</Text>
        </TouchableOpacity>
    )
}