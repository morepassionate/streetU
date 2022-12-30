import React from 'react';
import { View, StyleSheet, Dimensions, TextInput } from 'react-native';
import colors from '../constants/colors';
import { AnimatedView } from './AnimatedView';
import Icone from './Icone';
const { width } = Dimensions.get('screen');

const css = StyleSheet.create({
    containerSearch: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '90%',
        height: 60,
        alignSelf: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 20,
        marginBottom: 20
    },

});

const containerSearch = [css.containerSearch];


export const Buscador = ({ onPress, children }) => {
    return (
        <AnimatedView style={containerSearch}>
            {children}
            <Icone
                style={{ position: 'absolute', right: 20 }}
                nameIcone={'search'}
                tamanhoIcon={25}
                corIcone={colors.primary}
                onPress={onPress} />
        </AnimatedView>
    )
}