import { DrawerActions, StackActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StatusBar, View, StyleSheet, Pressable, Dimensions, Platform, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import Icone from './Icone';


const css = StyleSheet.create({
    SvgLogo: {
        height: 30,
        marginLeft: 20,
        marginBottom: 15
    },
    SvgConfig: {
        height: 20,
        marginBottom: 15
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 0,
        paddingRight: 20,
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? '10%' : 0,
    }
});

const SvgLogo = [css.SvgLogo];
const SvgConfig = [css.SvgConfig];
const containerHeader = [css.containerHeader];

const DestinoSvgLogo = require('../../assets/StreetULogo.png');
const DestinoSvgConfig = require('../../assets/configIcon.png');

export const Header = () => {
    const navigation = useNavigation();

    const handlerAbreMenu = () => {
        navigation.navigate('MenuGrid');
    };
    
    return (
        <View style={containerHeader}>
            <Logo />
            <IconConfig acaoOnPress={handlerAbreMenu} />
        </View>
    )
}

const Logo = () => {
    return (
        <Image resizeMode='contain' style={SvgLogo} source={DestinoSvgLogo} />
    )
}

const IconConfig = ({ acaoOnPress }) => {
    return (
        <TouchableOpacity onPress={() => acaoOnPress()}>
            <Icone   style={SvgConfig} nameIcone={'settings'} tamanhoIcon={20} corIcone={colors.white} />
        </TouchableOpacity>
    )
}