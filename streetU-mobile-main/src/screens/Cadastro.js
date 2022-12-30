import React, { useContext, useState } from 'react';
import { View, Image, Platform, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import * as Animatable from 'react-native-animatable';
import { Text } from '../components/Text';
import { ButtonAvatar } from '../components/ButtonAvatar';
import { CheckBox } from '../components/CheckBox';
import { Button } from '../components/Button';
import { TextInput } from '../components/Form';
import { useCadastro } from '../util/register';
import { UserContext } from '../contexts/UserContext';
import { Loading } from '../components/Loading';
import Icone from '../components/Icone';
import colors from '../constants/colors';


const ViewAnimated = Animatable.createAnimatableComponent(View);

const css = StyleSheet.create({
    StyleImgLogo: {
        width: 160,
        height: 160,
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? '15%' : 0
    },
    PaddingInBox: {
        paddingLeft: 25,
        paddingRight: 25
    },
    CentralizaItems: {
        alignItems: 'center'
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
    SizeHeight: {
        height: 30
    },
    IconeStyle: {
        position: 'absolute',
        left: 20
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 80,
        marginBottom: 20,
        alignSelf: 'center'
    }
});

const SizeHeight = [css.SizeHeight];
const BoxCheckBox = [css.BoxCheckBox];
const StyleImgLogo = [css.StyleImgLogo];
const PaddingInBox = [css.PaddingInBox];
const IconeStyle = [css.IconeStyle];
const CentralizaItems = [css.CentralizaItems];
const avatar = [css.avatar];
const BtaoVoltar = { width: 80, height: 45 };

const DestinoLogo = require('../../assets/Logo.png');
var TIPO_TEXTO = 'error'
var BOTAO_REDONDO_VOLTAR = "arrow-back-circle-outline";
var TAMANHO_ICONE = 40;


export const Cadastro = ({ navigation }) => {

    const { listenerCadastro, loading } = useContext(UserContext);
    const {
        submit,
        errors,
        nome,
        email,
        celular,
        password,
        confirmationPassword,
        setEmail,
        setPassword,
        setConfirmationPassword,
        setNome,
        setCelular,
        pickImage,
        imageSelected,
        aceitaTermos, 
        setAceitaTermos } = useCadastro();

    const MsgErroDoFirebase = (result) => {
        return !!result ? listenerCadastro.msg : null
    };

    const handlerVoltarParaLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <Background behavior={'position'}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <BotaoVoltar acaoOnPress={handlerVoltarParaLogin} />
                <Header />
                {imageSelected ?
                    <Image source={{ uri: imageSelected }} style={avatar} />
                    :
                    <ChooseImageAvatar
                        pickImage={pickImage}
                    />}
                <Body
                    errors={errors}
                    nome={nome}
                    email={email}
                    celular={celular}
                    password={password}
                    confirmationPassword={confirmationPassword}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setConfirmationPassword={setConfirmationPassword}
                    setNome={setNome}
                    setCelular={setCelular}
                />
                <Text type={TIPO_TEXTO}>{MsgErroDoFirebase(listenerCadastro)}</Text>
                <BoxCheckbox
                    valor={aceitaTermos}
                    setValor={setAceitaTermos}
                />
                <Footer
                    submit={submit}
                    loading={loading}
                />
                <Space />
            </ScrollView>
        </Background>
    );
}

const AnimatedView = ({ duration, children, ...rest }) => {
    return (
        <ViewAnimated animation={'fadeInUp'} duration={duration} {...rest}>
            {children}
        </ViewAnimated>
    )
}

const Logo = () => {
    return (
        <Image style={StyleImgLogo} source={DestinoLogo} />
    )
}

const Header = () => {
    return (
        <AnimatedView style={[PaddingInBox, CentralizaItems]}>
            <Logo />
            <Text type={'header'}>Crie sua conta</Text>
        </AnimatedView>
    );
}

const ChooseImageAvatar = ({ pickImage, imageSelected }) => {
    return (
        <AnimatedView>
            <ButtonAvatar
                onPressed={pickImage}
            />
        </AnimatedView>
    );
}

const Body = ({
    errors,
    nome,
    email,
    celular,
    password,
    confirmationPassword,
    setEmail,
    setPassword,
    setConfirmationPassword,
    setNome,
    setCelular
}) => {
    return (
        <AnimatedView style={PaddingInBox}>
            <TextInput
                label="Nome"
                placeholder="Nome"
                keyboardType="default"
                autoCapitalize="none"
                valor={nome}
                onChangeText={(txt) => setNome(txt)}
                errorText={errors.nome}
            />
            <TextInput
                label="E-mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                valor={email}
                onChangeText={(txt) => setEmail(txt)}
                errorText={errors.email}
            />
            <TextInput
                label="Celular"
                placeholder="Celular"
                keyboardType="numeric"
                autoCapitalize="none"
                valor={celular}
                onChangeText={(txt) => setCelular(txt)}
                errorText={errors.celular}
            />
            <TextInput
                label="Senha"
                placeholder="Senha"
                secureTextEntry
                autoCapitalize="none"
                valor={password}
                onChangeText={(txt) => setPassword(txt)}
                errorText={errors.password}
            />
            <TextInput
                label="Confirme sua senha"
                placeholder="Confirme sua senha"
                secureTextEntry
                autoCapitalize="none"
                valor={confirmationPassword}
                onChangeText={(txt) => setConfirmationPassword(txt)}
                errorText={errors.confirmationPassword}
            />
        </AnimatedView>
    );
}

const BoxCheckbox = ({ valor, setValor }) => {
    return (
        <AnimatedView style={[BoxCheckBox]}>
            <CheckBox valor={valor} setValor={setValor} />
            <Text type={'component'}>Concordo com os Termos de uso</Text>
        </AnimatedView>
    );
}

const Footer = ({ submit, loading }) => {
    const VerificaEstadoDoBotao = (state) => {
        switch (state) {
            case true:
                return <Loading />
            case false:
                return <Button onPress={submit}>Confirmar</Button>
        }
    }
    return (
        <AnimatedView style={PaddingInBox}>
            {VerificaEstadoDoBotao(loading)}
        </AnimatedView>
    );
}

const Space = () => {
    return (
        <View style={SizeHeight} />
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