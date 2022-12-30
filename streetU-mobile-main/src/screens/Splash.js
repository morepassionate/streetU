import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import Background from '../components/Background';
import * as Animatable from 'react-native-animatable';
import { StackActions, useNavigation } from '@react-navigation/native';

const ImageAnimated = Animatable.createAnimatableComponent(Image);

const css = StyleSheet.create({
    imgLogo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginTop: '50%'
    },
});

const StyleImgLogo = [css.imgLogo];
const DestinoLogo = require('../../assets/Logo.png');

export const Splash = ({ }) => {

    const navigation = useNavigation();
    var INTERVALO_PARA_PROX_TELA = 3000;

    const funcaoProxTela = () => {
        setTimeout(() => {
            navigation.dispatch(StackActions.replace('Login'));
        }, INTERVALO_PARA_PROX_TELA);
    }

    useEffect(() => {
        funcaoProxTela();
    }, []);

    return (
        <Background>
            <Logo />
        </Background>
    );
}


const Logo = () => {
    return (
        <ImageAnimated
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            style={StyleImgLogo}
            source={DestinoLogo} />
    )
}