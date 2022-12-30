import React from 'react';
import { Platform, StatusBar, View, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import Icone from './Icone';

var BOTAO_REDONDO_VOLTAR = "arrow-back-circle-outline";
var TAMANHO_ICONE = 40;

const css = StyleSheet.create({
    IconeStyle: {
        marginTop: Platform.OS === 'ios' ? '15%' : 0,
        marginBottom: 50
    },
});

const IconeStyle = css.IconeStyle;

export const BotaoVoltar = ({ acaoOnPress, ...rest }) => {
    return (
        <Icone
            nameIcone={BOTAO_REDONDO_VOLTAR}
            tamanhoIcon={TAMANHO_ICONE}
            corIcone={colors.white}
            style={[IconeStyle, { ...rest }]}
            onPress={() => acaoOnPress()}
        />
    );
}