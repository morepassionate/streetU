import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import Icone from './Icone';

const css = StyleSheet.create({
    Icon: {
        alignSelf: 'center',
        marginBottom: 25,
        marginTop: -15,
        width: 80,
        height: 80,
        borderRadius: 80,
    }
});

const Icon = [css.Icon];
const Botao = [css.Botao];

export const ButtonAvatar = ({ onPressed }) => {
    return (
        <TouchableOpacity onPress={() => onPressed()} style={Icon}>
            <Icone nameIcone={'camera-outline'} tamanhoIcon={50} corIcone={colors.white} />
        </TouchableOpacity>
    );
}