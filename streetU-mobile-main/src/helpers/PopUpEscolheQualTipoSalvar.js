import React from 'react';
import { View, StyleSheet, Modal, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import { List } from 'react-native-paper';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import colors from '../constants/colors';
const { width } = Dimensions.get('screen');

const css = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'black',
        width: width,
        height: Platform.OS === 'ios' ? '25%' : '25%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    ContainerHeader: {
        alignSelf: 'flex-end',
        paddingRight: 30,
        paddingTop: 10
    },
    ContainerBody: {
    },
    IconeCentralizado: {
        alignSelf: 'center',
        marginBottom: 10
    },
    TxtBotaoHeader: {
        color: colors.white
    },
    ContainerBotao: {
        padding: 15,
        alignItems: 'flex-start',
        width: width
    },
    Botao: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '98%',
        marginTop: 10,
        height: 50,
        paddingLeft: 15,
    },
    SpaceRight: {
        marginRight: 15
    }
});

const modalView = [css.modalView];
const centeredView = [css.centeredView];
const ContainerBotao = [css.ContainerBotao];
const Botao = [css.Botao];
const SpaceRight = [css.SpaceRight];

export const PopUpEscolheQualTipoSalvar = ({
    modalVisible,
    handlerFecharModalEscolheOqueSalvar,
    handlerScreenParaEscolherImagens
}) => {

    return (
        <View style={centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <ViewModal>
                    <BodyModal
                        handlerScreenParaEscolherImagens={handlerScreenParaEscolherImagens}
                        handlerFecharModalEscolheOqueSalvar={handlerFecharModalEscolheOqueSalvar} />
                </ViewModal>
            </Modal>
        </View>
    )
}

const ViewModal = ({ children }) => {
    return (
        <View style={centeredView}>
            <View style={modalView}>
                {children}
            </View>
        </View>
    )
}

const BodyModal = ({
    handlerFecharModalEscolheOqueSalvar,
    handlerScreenParaEscolherImagens
}) => {
    return (
        <View style={ContainerBotao}>
            <ListaOpcoes
                acaoOnPress={handlerFecharModalEscolheOqueSalvar}
                titulo={'Salvar coleção inteira'}
                NAME_ICONE={'bookmarks-outline'}
            />
            <ListaOpcoes
                acaoOnPress={handlerScreenParaEscolherImagens}
                titulo={'Salvar fotos selecionadas'}
                NAME_ICONE={'images-outline'}
            />
        </View>
    )
}

const ListaOpcoes = ({ titulo, acaoOnPress, NAME_ICONE }) => {
    return (
        <TouchableOpacity onPress={() => acaoOnPress()} style={Botao}>
            <Icone nameIcone={NAME_ICONE} tamanhoIcon={30} corIcone={'white'} style={SpaceRight} />
            <Text>{titulo}</Text>
        </TouchableOpacity>
    )
}