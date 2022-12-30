import React, { useState } from 'react';
import { useEffect } from 'react';
import { Dimensions, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import { AnimatedView } from './AnimatedView';
import { Divisor } from './Divisor';
import Icone from './Icone';
import { Text } from './Text';
const { width } = Dimensions.get('screen');

const css = StyleSheet.create({
    ColorDivisor: {
        backgroundColor: 'black',
        width: '95%',
        height: 2,
        alignSelf: 'center',
        marginTop: 15
    },
    Avatar: {
        height: 110,
        width: 90,
        borderRadius: 10
    },
    CardRequested: {
        flexDirection: 'row',
        padding: 20,
    },
    Txt: {
        marginLeft: 15,
        fontSize: 20
    },
    TxtSubheader: {
        marginLeft: 15,
        fontSize: 14,
        marginTop: 13
    },
    iconeClose: {
        position: 'absolute',
        right: 25,
        top: 18
    },
    Botao: {
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 15,
        padding: 5,
        position: 'absolute',
        right: 20,
        top: 57,
        marginTop: 5,
    },
    BotaoGreen: {
        borderWidth: 2,
        borderColor: colors.green,
        borderRadius: 15,
        padding: 5,
        position: 'absolute',
        right: 20,
        top: 57,
        marginTop: 5,
    },
    BotaoStyleSeguir: {
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 15,
        padding: 5,
        position: 'absolute',
        right: 20,
        top: 95,
        marginTop: 5
    },
    TxtBotao: {
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
        width: 100,
        textAlign: 'center'
    },
    TxtBotaoGreen: {
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
        width: 100,
        textAlign: 'center',
        color: colors.green
    },
    txtBotaoUnfollow: {
        color: colors.white,
        fontSize: 13,
        marginLeft: 10,
        marginRight: 10,
        width: 100,
        textAlign: 'center'
    },
    botaoUnfollow: {
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 15,
        padding: 5,
        position: 'absolute',
        right: 20,
        top: 95,
        marginTop: 5
    }
});

const BotaoStyleSeguir = css.BotaoStyleSeguir;
const CardRequested = css.CardRequested;
const TxtBotaoGreen = css.TxtBotaoGreen;
const ColorDivisor = css.ColorDivisor;
const TxtSubheader = css.TxtSubheader;
const iconeClose = css.iconeClose;
const BotaoGreen = css.BotaoGreen;
const TxtBotao = css.TxtBotao;
const txtBotaoUnfollow = css.txtBotaoUnfollow;
const botaoUnfollow = css.botaoUnfollow;
const BotaoStyle = css.Botao;
const Avatar = css.Avatar;
const Txt = css.Txt;

var TAMANHO_ICONE = 25;
var COR_ICONE = colors.white;

export const CardPedidosRequested = ({
    PedidosRequested, aceitaPedidoDeAmizade,
    nomeBotaoAceitar, botaoSeguirDeVolta,
    handlerSegueUsuario, IdUsersFollowing,
    excluiRequestFollow, handlerUnfollowUsuario }) => {

    const uri = PedidosRequested?.uri;
    const pedido = PedidosRequested;
    const nome_user_seguidor = PedidosRequested?.nome_user_seguidor;
    const requisicao_aceita = PedidosRequested?.requisicao_aceita;
    const id_user_seguidor = PedidosRequested?.id_user_seguidor;
    const show = PedidosRequested?.show;
    const result = IdUsersFollowing.includes(id_user_seguidor); 

    return (
        <>
            {show ?
                <AnimatedView>
                    <View style={ColorDivisor} />
                    <View style={CardRequested}>
                        <Image style={Avatar} source={{ uri: uri }} />
                        <View>
                            <Text style={Txt}>{nome_user_seguidor}</Text>
                            <Text style={[TxtSubheader, { marginTop: 25 }]}>{nome_user_seguidor}</Text>
                            <Text style={TxtSubheader}>{nome_user_seguidor}</Text>
                        </View>
                        {!requisicao_aceita ?
                            <Icone
                                style={iconeClose}
                                nameIcone={'close'}
                                tamanhoIcon={TAMANHO_ICONE}
                                corIcone={COR_ICONE}
                                onPress={() => excluiRequestFollow(pedido)}
                            /> : null}
                        <Botao titleButton={requisicao_aceita ? 'Pedido aceito' : nomeBotaoAceitar} press={aceitaPedidoDeAmizade} pedido={pedido} requisicao_aceita={requisicao_aceita} />
                        {result ?
                            <BotaoUnfollow
                                titleButton={'Deixar de seguir'}
                                press={handlerUnfollowUsuario}
                                pedido={pedido} />
                            :
                            <BotaoSeguir
                                titleButton={botaoSeguirDeVolta}
                                press={handlerSegueUsuario}
                                pedido={pedido} />
                        }
                    </View>
                </AnimatedView> : null}
        </>
    )

}

const Botao = ({ titleButton, press, pedido, requisicao_aceita }) => {

    return (
        <TouchableOpacity onPress={() => press(pedido)} style={requisicao_aceita ? BotaoGreen : BotaoStyle}>
            <Text style={requisicao_aceita ? TxtBotaoGreen : TxtBotao}>{titleButton}</Text>
        </TouchableOpacity>
    )
};

const BotaoSeguir = ({ titleButton, press, pedido }) => {

    return (
        <TouchableOpacity onPress={() => press(pedido)} style={BotaoStyleSeguir}>
            <Text style={titleButton === 'Pedido aceito' ? TxtBotaoGreen : TxtBotao}>{titleButton}</Text>
        </TouchableOpacity>
    )
}

const BotaoUnfollow = ({ titleButton, press, pedido }) => {

    return (
        <TouchableOpacity onPress={() => press(pedido)} style={botaoUnfollow}>
            <Text style={txtBotaoUnfollow}>{titleButton}</Text>
        </TouchableOpacity>
    )
}
