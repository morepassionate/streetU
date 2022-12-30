import React from 'react';
import { FlatList, View, StyleSheet, Image } from 'react-native';
import { AnimatedView } from './AnimatedView';
import { Divisor } from './Divisor';
import { Text } from './Text';

const css = StyleSheet.create({
    ImagensColecao: {
        height: 160,
        width: 101,
        marginTop: 20,
        marginRight: 15,
        borderRadius: 10,
    },
    ContainerListaColecoes: {
        padding: 15
    },
    txtTitleLista: {
        textAlign: 'right',
        marginRight: 15,
    },
    txtTitleListaLeft: {
        textAlign: 'left',
        marginRight: 15, 
    },
    txtViews: {
        textAlign: 'right',
        marginRight: 15,
        marginTop: 5,
        fontSize: 13
    }
});

const ImagensColecao = css.ImagensColecao;
const ContainerListaColecoes = css.ContainerListaColecoes;
const txtTitleLista = css.txtTitleLista;
const txtTitleListaLeft = css.txtTitleListaLeft;
const txtViews = css.txtViews;

export const CardListasNoPerfil = ({ listaDeColecoesDoUsuario, handlerAbreScreenDetalhes }) => {
    const TitleLista = listaDeColecoesDoUsuario?.TitleLista;
    const FotosLista = listaDeColecoesDoUsuario?.FotosLista;
    const Views = listaDeColecoesDoUsuario?.Views;
    const isLoja = listaDeColecoesDoUsuario?.isLoja; 

    return (
        <AnimatedView duration={1500} style={ContainerListaColecoes}>
            <Text style={isLoja ? txtTitleListaLeft : txtTitleLista}>{TitleLista}</Text>
            <Divisor duration={800} />
            {!isLoja ?
                <Text style={txtViews}>{Views} views</Text> : null}
            <FlatList
                data={FotosLista}
                horizontal 
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <Image style={ImagensColecao} source={{ uri: item.uri }} />} />
        </AnimatedView>
    );
}
