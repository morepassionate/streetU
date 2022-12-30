import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import * as Animatable from 'react-native-animatable';
import { Text } from '../components/Text';
import { TextInput } from '../components/Form';
import { useLogin } from '../util/auth';
import colors from '../constants/colors';
import { Button } from '../components/Button'; 
import Icone from '../components/Icone';

const ViewAnimated = Animatable.createAnimatableComponent(View);

const css = StyleSheet.create({
    imgLogo: {
        width: 180,
        height: 180,
        marginTop: Platform.OS === 'ios' ? '15%' : 0
    },
    PaddingBox: {
        paddingLeft: 25,
        paddingRight: 25,
    },
    BoxHeader: {
        alignItems: 'center'
    },
    ColorTxtWhite: {
        color: colors.white
    },
    fontWeight: {
        fontWeight: '700'
    },
    IconeStyle:{
        position: 'absolute',
        left: 20
    },
})

const BoxHeader = [css.BoxHeader];
const IconeStyle = css.IconeStyle;
const StyleImgLogo = [css.imgLogo];
const fontWeight = [css.fontWeight];
const PaddingBox = [css.PaddingBox];
const ColorTxtWhite = [css.ColorTxtWhite];
const BtaoVoltar = { width: 80, height: 45 };

const DestinoLogo = require('../../assets/Logo.png');
var BOTAO_REDONDO_VOLTAR = "arrow-back-circle-outline";
var TAMANHO_ICONE = 40;

export const ResetPassword = ({ navigation }) => {

    const handlerVoltarParaLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <Background behavior={'padding'}>
            <BotaoVoltar acaoOnPress={handlerVoltarParaLogin} style={{marginLeft: 10}} />
            <Header />
            <Body />
        </Background>
    )
}

const Logo = () => {
    return (
        <Image style={StyleImgLogo} source={DestinoLogo} />
    )
}

const Header = () => {
    return (
        <ViewAnimated animation={'fadeInUp'} duration={1200} style={BoxHeader}>
            <Logo />
            <Text type={'header'} style={[ColorTxtWhite, fontWeight]}>Recuperar senha</Text>
        </ViewAnimated>
    )
}

const Body = () => {
    const { email, setEmail, submit, errors } = useLogin();

    return (
        <ViewAnimated animation={'fadeInUp'} duration={1500} style={PaddingBox}>
            <TextInput
                label="E-mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                valor={email}
                onChangeText={text => setEmail(text)}
                errorText={errors.email}
            />
            <Button onPress={submit}>Confirmar</Button>
        </ViewAnimated>
    )
}

const BotaoVoltar = ({ acaoOnPress }) => {
    return (
        <TouchableOpacity
            style={BtaoVoltar}
            onPress={() => acaoOnPress()}>
            <Icone
                nameIcone={BOTAO_REDONDO_VOLTAR}
                tamanhoIcon={TAMANHO_ICONE}
                corIcone={colors.white}
                style={IconeStyle} />
        </TouchableOpacity>
    )
}

