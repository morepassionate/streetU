import React, { useContext } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import colors from '../constants/colors';
import { UserContext } from '../contexts/UserContext';
import { AnimatedView } from './AnimatedView';
import { Divisor } from './Divisor';
import Icone from './Icone';
import { Text } from './Text';

const css = StyleSheet.create({
    containerCard: {
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 15,
        paddingTop: 15
    },
    coluna: {
        flexDirection: 'column'
    },
    Avatar: {
        width: 77,
        height: 82,
        borderRadius: 10,
    },
    spaceLeft: {
        marginLeft: 10
    },
    txtHeader: {
        fontSize: 15,
        marginBottom: 15,
        marginTop: 5
    },
    txtSubheader: {
        fontSize: 13,
    },
    botaoSeguir: {
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        width: 70,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtBotao: {
        fontSize: 13,
    },
    IconLock: {
        position: 'absolute',
        right: 15,
        top: 15
    }
})

const card = [css.containerCard];
const coluna = [css.coluna];
const Avatar = [css.Avatar];
const spaceLeft = [css.spaceLeft];
const txtHeader = [css.txtHeader];
const txtSubheader = [css.txtSubheader];
const txtBotao = [css.txtBotao];
const botaoSeguir = [css.botaoSeguir];
const IconLock = [css.IconLock];


export const CardLista = ({ DataListaDeColecoes, handlerAbreScreenDetalhes }) => {

    const Nome = DataListaDeColecoes?.Nome;
    const TitleLista = DataListaDeColecoes?.TitleLista;
    const StatusSeguir = DataListaDeColecoes?.seguindo;
    const AvatarPerfil = DataListaDeColecoes?.AvatarPerfil;
    const TipoLista = DataListaDeColecoes?.TipoLista;
    const idUser = DataListaDeColecoes?.idUser;
    const { usuario } = useContext(UserContext);
    const UserId = usuario.uid;
    const QuantidadeDeFotos = DataListaDeColecoes?.FotosLista?.length;

    const verificaIconePrivacidadeDaLista = (tipo) => {
        if (!tipo) return 'lock-open-outline';
        if (tipo) return 'lock-closed-outline';
    }

    const verificaQuantidadeDeFotosNaColecao = (listaDeFotos) => {
        if (listaDeFotos === 0) return null;
        if (listaDeFotos <= 1) return "foto";
        if (listaDeFotos >= 2) return "fotos";
    }

    return (
        <TouchableOpacity onPress={() => handlerAbreScreenDetalhes(DataListaDeColecoes)}>
            <Card>
                <Thumbnail AvatarPerfil={AvatarPerfil} />
                <View style={[coluna, spaceLeft]}>
                    <Text style={txtHeader}>{TitleLista}</Text>
                    <Text style={txtSubheader}>{Nome}</Text>
                    {idUser === UserId ? null :
                        <TouchableOpacity style={botaoSeguir}>
                            <Text style={txtBotao}>{!StatusSeguir ? 'Seguir' : 'Seguindo'}</Text>
                        </TouchableOpacity>
                    }
                    <Text style={txtSubheader}>{!!QuantidadeDeFotos ? QuantidadeDeFotos : null} {verificaQuantidadeDeFotosNaColecao(QuantidadeDeFotos)}</Text>
                </View>
                <Icone nameIcone={verificaIconePrivacidadeDaLista(TipoLista)} tamanhoIcon={20} corIcone={colors.white} style={IconLock} />
            </Card>
            <Divisor />
        </TouchableOpacity>
    );
}

const Thumbnail = ({ AvatarPerfil }) => {
    return (
        <View style={coluna}>
            <Image
                style={Avatar}
                source={{ uri: AvatarPerfil }} />
        </View>
    )
}

const Card = ({ children }) => {
    return (
        <AnimatedView duration={1600} style={card}>
            {children}
        </AnimatedView>
    )
}

