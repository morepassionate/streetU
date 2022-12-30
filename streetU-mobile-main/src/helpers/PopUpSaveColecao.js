import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Pressable, View, Dimensions, TouchableOpacity, FlatList, PanResponder, Platform } from 'react-native';
import { AnimatedView } from '../components/AnimatedView';
import { CardLista } from '../components/CardLista';
import { CardListasSalvas } from '../components/CardListasSalvas';
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
        height: Platform.OS === 'ios' ? '75%' : '80%',
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
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingTop: 10,
        width: width,
    },
    ContainerBody: {
    },
    IconeCentralizado: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        paddingRight: 15
    },
    TxtBotaoHeader: {
        color: colors.white
    },
    IconeFecharPopUp: {
        position: 'absolute',
        top: -40
    }
});

const modalView = [css.modalView];
const centeredView = [css.centeredView];
const TxtBotaoHeader = [css.TxtBotaoHeader];
const ContainerHeader = [css.ContainerHeader];
const ContainerBody = [css.ContainerBody];
const IconeCentralizado = [css.IconeCentralizado];
const IconeFecharPopUp = [css.IconeFecharPopUp];

export const PopUpSaveColecao = ({
    modalVisible, setModalVisible,
    DataListColecoesSalvas, handlerSalvaColecaoEmLista,
    handlerVaiParaScreenDeCriacaoDeNovaLista, fechaModalPopUp }) => {
        
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
                    <Icone nameIcone={'chevron-down-outline'} tamanhoIcon={30} onPress={()=> fechaModalPopUp()} style={IconeFecharPopUp} />
                    <HeaderModal
                        handlerVaiParaScreenDeCriacaoDeNovaLista={handlerVaiParaScreenDeCriacaoDeNovaLista} />
                    <BodyModal
                        DataListColecoesSalvas={DataListColecoesSalvas}
                        handlerSalvaColecaoEmLista={handlerSalvaColecaoEmLista}
                    />
                </ViewModal>
            </Modal>
        </View>
    );
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

const HeaderModal = ({ handlerVaiParaScreenDeCriacaoDeNovaLista }) => {
    return (
        <View>
            <TouchableOpacity style={ContainerHeader} onPress={() => handlerVaiParaScreenDeCriacaoDeNovaLista()}>
                <Icone
                    style={IconeCentralizado}
                    nameIcone={'add-outline'}
                    tamanhoIcon={30}
                    corIcone={colors.white} />
                <Text
                    style={TxtBotaoHeader}
                    type={'subheader'}>NOVA</Text>
            </TouchableOpacity>
        </View>
    )
}

const BodyModal = ({ DataListColecoesSalvas, handlerSalvaColecaoEmLista }) => {
    return (
        <AnimatedView style={ContainerBody}>
            <FlatList
                data={DataListColecoesSalvas}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <CardListasSalvas DataListaDeColecoes={item} handlerSalvaColecaoEmLista={handlerSalvaColecaoEmLista} />}
            />
        </AnimatedView>
    )
}