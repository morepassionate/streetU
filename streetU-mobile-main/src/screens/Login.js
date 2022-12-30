import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Image, StyleSheet, Alert, Platform, TouchableOpacity, ScrollView } from 'react-native';
import Background from '../components/Background';
import { Button } from '../components/Button';
import { CheckBox } from '../components/CheckBox';
import { TextInput } from '../components/Form';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { PopUpConnectFacebook } from '../helpers/PopUpConnectFacebook';
import { useLogin } from '../util/auth';
import * as Animatable from 'react-native-animatable';
import { UserContext } from '../contexts/UserContext';
import { Loading } from '../components/Loading';

const ViewAnimated = Animatable.createAnimatableComponent(View);

const css = StyleSheet.create({
    imgLogo: {
        width: 160,
        height: 160,
        marginTop: Platform.OS === 'ios' ? '15%' : 0
    },
    PaddingBox: {
        paddingLeft: 25,
        paddingRight: 25,
    },
    BoxCheckBox: {
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
        marginBottom: 18
    },
    BoxHeader: {
        alignItems: 'center'
    },
    ColorTxtWhite: {
        color: colors.white
    },
    SpaceComponents: {
        marginTop: 10
    },
    fontCenter: {
        textAlign: 'center'
    },
    fontWeight: {
        fontWeight: '700'
    },
    SizeHeight: {
        height: 30
    },
});

const BoxHeader = [css.BoxHeader];
const SizeHeight = [css.SizeHeight];
const StyleImgLogo = [css.imgLogo];
const fontCenter = [css.fontCenter];
const fontWeight = [css.fontWeight];
const PaddingBox = [css.PaddingBox];
const BoxCheckBox = [css.BoxCheckBox];
const ColorTxtWhite = [css.ColorTxtWhite];
const SpaceComponents = [css.SpaceComponents];

const DestinoLogo = require('../../assets/Logo.png');
var TIPO_TEXTO = 'error'

export function Login({ navigation }) {

    const { email, password, setEmail, setPassword, submit, errors } = useLogin();
    const [lembrarSenha, setLembrarSenha] = useState(false);
    const snapPoints = useMemo(() => ['60%'], []);
    const [index, setIndex] = useState(0)
    const sheetRef = useRef(null);
    const { listenerLogar, loading } = useContext(UserContext);

    const fechaModal = () => {
        if (sheetRef.current !== undefined) return sheetRef.current.close({ duration: 300 });
    };

    const handlerBotaoEsqueciSenha = () => {
        navigation.navigate('Resetpassword');
    }

    const handlerBotaoCriarConta = () => {
        navigation.navigate('Cadastro');
    }

    const MsgErroDoFirebase = (result) => {
        return !!result ? listenerLogar.msg : null
    }

    return (
        <Background behavior={'padding'}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <BodyForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    errors={errors}
                />
                <Text type={TIPO_TEXTO}>{MsgErroDoFirebase(listenerLogar)}</Text>
                <ContainerCheckBox
                    valor={lembrarSenha}
                    lembrarSenha={setLembrarSenha} />
                <FooterButtons
                    handlerBotaoEsqueciSenha={handlerBotaoEsqueciSenha}
                    handlerBotaoCriarConta={handlerBotaoCriarConta}
                    submit={submit}
                    loading={loading} />
                <PopUpConnectFacebook
                    fechaModal={fechaModal}
                    index={index}
                    refBottom={sheetRef}
                    snapPoints={snapPoints}
                    title={'Conectar as redes sociais'}
                    subtitle={'Conecte com seu facebook para uma experiência completa, e veja as listas que seus amigos criaram!'}
                    titleButton={'Conectar'}
                />
                <Space />
            </ScrollView>
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
            <Text type={'header'} style={[ColorTxtWhite, fontWeight]}>Login</Text>
        </ViewAnimated>
    )
}

const BodyForm = ({ email, password, setEmail, setPassword, errors }) => {

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
            <TextInput
                label="Senha"
                placeholder="Senha"
                secureTextEntry
                autoCapitalize="none"
                valor={password}
                onChangeText={text => setPassword(text)}
                errorText={errors.password}
            />
        </ViewAnimated>
    )
}

const ContainerCheckBox = ({ valor, lembrarSenha }) => {
    return (
        <ViewAnimated animation={'fadeInUp'} duration={1800} style={BoxCheckBox} >
            <CheckBox setValor={lembrarSenha} valor={valor} />
            <Text type={'component'}>Lembrar senha</Text>
        </ViewAnimated>
    )
}

const FooterButtons = ({ submit, handlerBotaoEsqueciSenha, handlerBotaoCriarConta, loading }) => {

    const VerificaEstadoDoBotao = (state) => {
        switch (state) {
            case true:
                return <Loading />
            case false:
                return (
                    <>
                        <Button onPress={submit}>Login</Button>
                        <View style={SpaceComponents} />
                        <Button onPress={handlerBotaoCriarConta} type={'outline'}>Criar conta</Button>
                        <Text style={fontCenter}>ou</Text>
                        <Button type={'outline'}>Login com facebook</Button>
                        <View style={SpaceComponents} />
                    </>
                )
        }
    }
    return (
        <ViewAnimated animation={'fadeInUp'} duration={2000} style={PaddingBox}>
            <TouchableOpacity onPress={handlerBotaoEsqueciSenha}>
                <Text type={'outline'}>Esqueci a senha</Text>
            </TouchableOpacity>
            {VerificaEstadoDoBotao(loading)}
        </ViewAnimated>
    )
}

const Space = () => {
    return (
        <View style={SizeHeight} />
    )
}