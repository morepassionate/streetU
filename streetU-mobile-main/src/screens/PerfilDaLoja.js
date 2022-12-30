import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Image, FlatList } from 'react-native';
import { AnimatedView } from '../components/AnimatedView';
import { BackgroundSemAVoiding } from '../components/Background';
import { Header } from '../components/Header';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { BotaoVoltar } from '../components/BotaoVoltar';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { CardListasNoPerfil } from '../components/CardListasNoPerfil';
import { useNavigation } from '@react-navigation/native';

const css = StyleSheet.create({
    headerTitle: {
        marginTop: Platform.OS === 'ios' ? '10%' : 0,
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 25,
        justifyContent: 'space-between'

    },
    Row: {
        flexDirection: 'row',
        paddingTop: 12
    },
    IconeRight: {
        marginRight: 15
    },
    ImageCapa: {
        height: 250,
        width: '90%',
        borderRadius: 20,
        opacity: 0.5
    },
    ContainerCapa: {
        alignItems: 'center',
        marginBottom: '10%'
    },
    ImagemAvatar: {
        width: 120,
        height: 80,
        borderRadius: 10,
        position: 'absolute',
        bottom: -30,
    }
});

const headerTitle = css.headerTitle;
const IconeRight = css.IconeRight;
const Row = css.Row;
const ImageCapa = css.ImageCapa;
const ContainerCapa = css.ContainerCapa;
const ImagemAvatar = css.ImagemAvatar;

var ICONE_LOCATION = "location-outline";
var ICONE_WHATSAPP = "logo-whatsapp";
var ICONE_WEB = "globe-outline";
var BOTAO_REDONDO_VOLTAR = "arrow-back-circle-outline";
var COR_ICONE = colors.white;
var TAMANHO_ICONE = 20;
var STORY_IMAGE = "https://lh3.googleusercontent.com/p/AF1QipODDKRGF4BLlcd4Qybaemha2d4KliHCAmqPyFux=w1080-h608-p-no-v0";


export const PerfilDaLoja = ({ route, navigation }) => {
    const { _RequestMinhasListas, dataMinhasListas } = useContext(FirebaseContext);
    const idDaLoja = route?.params?.DadosDaLoja?.user_id;
    const isLoja = route?.params?.DadosDaLoja?.isLoja;
    const Nome = route?.params?.DadosDaLoja?.user_name;
    const AvatarPerfil = route?.params?.DadosDaLoja?.user_foto_avatar;
    const goBackScreen = route?.params?.goBackScreen;
    const [listasRequestedDaLoja, setListasRequestedDaLoja] = useState([]); 


    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            _RequestMinhasListas(idDaLoja);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        setListasRequestedDaLoja(dataMinhasListas);
    }, [dataMinhasListas]);

    const back = () => {
        navigation.navigate('Buscar')
    }

    return (
        <BackgroundSemAVoiding>
            <HeaderTitle nomeDaLoja={Nome} goBackScreen={back} />
            <ListaColecaoDaLoja listasRequestedDaLoja={listasRequestedDaLoja} AvatarPerfil={AvatarPerfil} />
        </BackgroundSemAVoiding>
    );
};

const HeaderTitle = ({ nomeDaLoja, goBackScreen }) => {
    return (
        <AnimatedView>
            <View style={headerTitle}>
                <Icone onPress={() => goBackScreen()} style={{ marginRight: 10, top: 5 }} nameIcone={BOTAO_REDONDO_VOLTAR} tamanhoIcon={30} corIcone={COR_ICONE} />

                <Text type={'header'} style={{ marginLeft: '-30%' }}>{nomeDaLoja}</Text>
                <View style={Row}>
                    <Icone style={IconeRight} nameIcone={ICONE_WHATSAPP} tamanhoIcon={TAMANHO_ICONE} corIcone={COR_ICONE} />
                    <Icone style={IconeRight} nameIcone={ICONE_WEB} tamanhoIcon={TAMANHO_ICONE} corIcone={COR_ICONE} />
                    <Icone style={IconeRight} nameIcone={ICONE_LOCATION} tamanhoIcon={TAMANHO_ICONE} corIcone={COR_ICONE} />
                </View>
            </View>
        </AnimatedView>
    )
};

const HeaderCapaELogo = ({ AvatarPerfil }) => {
    return (
        <AnimatedView style={ContainerCapa}>
            <Image resizeMode='cover' source={{ uri: AvatarPerfil }} style={ImageCapa} />
            <Image resizeMode='cover' source={{ uri: AvatarPerfil }} style={ImagemAvatar} />
        </AnimatedView>
    )
};

const ListaColecaoDaLoja = ({ listasRequestedDaLoja, AvatarPerfil }) => {
    return (
        <AnimatedView>
            <FlatList
                data={listasRequestedDaLoja}
                ListHeaderComponent={() => <HeaderCapaELogo AvatarPerfil={AvatarPerfil} />}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <CardListasNoPerfil listaDeColecoesDoUsuario={item} />}
            />
        </AnimatedView>
    )
}