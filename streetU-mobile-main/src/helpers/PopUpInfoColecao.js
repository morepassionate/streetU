import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Pressable, View, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import colors from '../constants/colors';
const { width } = Dimensions.get('screen');
import { format, compareAsc } from 'date-fns'
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


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
        height: '38%',
        padding: 15,
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
    ContainerRow: {
        width: '98%',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row-reverse',
        marginTop: -5 ,
        marginBottom: 15
    },
    Linha: {
        width: '98%',
        height: 15,
        flexDirection: 'row',
        alignItems: 'center',

    },
    ContainerColuna: {
        width: '98%',
        alignItems: 'flex-start'
    },
    txtFooter: {
        color: colors.white,
    },
    SpaceRight: {
        marginRight: 20
    }
});

const Linha = [css.Linha];
const modalView = [css.modalView];
const txtFooter = [css.txtFooter];
const SpaceRight = [css.SpaceRight];
const centeredView = [css.centeredView];
const ContainerRow = [css.ContainerRow];
const ContainerColuna = [css.ContainerColuna];
var PERFIL_DA_LOJA = 'PerfilDaLoja';

export default function PopUpInfoColecao({
    modalVisible,
    setModalVisible,
    DataListaDeColecoes,
    idColecoesANotificar,
    handlerAtivaNotificacoes,
    handlerEscondeColecaoDoUser,
    listaDeLojas
}) {

    const navigation = useNavigation();

    const navegaParaPerfilDaLoja = (nomeLoja) => { 
        listaDeLojas?.filter((item) => {
            if (item.user_name === nomeLoja) {
                setModalVisible(false);
                if (item?.user_tipo === 1) return navigation.navigate(PERFIL_DA_LOJA, { DadosDaLoja: item, goBackScreen: 'Inicio' });
            }
        }) 
    }

    const FechaModal = () => {
        setModalVisible(!modalVisible);
    }

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
                    <Body
                        handlerEscondeColecaoDoUser={handlerEscondeColecaoDoUser}
                        handlerAtivaNotificacoes={handlerAtivaNotificacoes}
                        idColecoesANotificar={idColecoesANotificar}
                        DataListaDeColecoes={DataListaDeColecoes}
                        FechaModal={FechaModal}
                    />
                    <Footer
                        DataListaDeColecoes={DataListaDeColecoes}
                        navegaParaPerfilDaLoja={navegaParaPerfilDaLoja} />
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

const Row = ({ children }) => {
    return (
        <View style={ContainerRow}>
            {children}
        </View>
    )
}

const Coluna = ({ children }) => {
    return (
        <View style={ContainerColuna}>
            {children}
        </View>
    )
}

const Body = ({ handlerEscondeColecaoDoUser, DataListaDeColecoes, handlerAtivaNotificacoes, idColecoesANotificar, FechaModal }) => {
    const [iconeNotification, setIconeNotification] = useState('notifications-outline');

    const handleAtivaNotificacoes = () => {
        handlerAtivaNotificacoes(DataListaDeColecoes)
        setIconeNotification(iconeNotification === 'notifications-outline' ? 'notifications' : 'notifications-outline');
    }

    const handlerDisativaColecao = () => {
        handlerEscondeColecaoDoUser(DataListaDeColecoes)
    }

    var IdColecoesANotificar = [];
    idColecoesANotificar?.map((item) => {
        IdColecoesANotificar.push(item.idColecao);
    });

    const result = IdColecoesANotificar.includes(DataListaDeColecoes.idColecao);

    useEffect(() => {
        if (result) return setIconeNotification('notifications-outline');
    }, [result]);

    return (
        <Row>
            <TouchableOpacity onPress={FechaModal}>
                <Icone nameIcone={'chevron-up-outline'} tamanhoIcon={25} corIcone={'white'} />
            </TouchableOpacity>
            <Icone
                onPress={handleAtivaNotificacoes}
                nameIcone={iconeNotification}
                tamanhoIcon={30}
                corIcone={result ? colors.primary : colors.white}
                style={SpaceRight} />
            <Icone
                nameIcone={'share-social-outline'}
                tamanhoIcon={30}
                corIcone={colors.white}
                style={SpaceRight} />
            <Icone
                onPress={handlerDisativaColecao}
                nameIcone={'close-circle-outline'}
                tamanhoIcon={33}
                corIcone={colors.primary}
                style={SpaceRight} /> 
        </Row>
    )
}

const Footer = ({ DataListaDeColecoes, navegaParaPerfilDaLoja }) => {

    const { TipoLista, Views, shares, Lojas, DataCriacaoColecao, Nome, FotosLista } = DataListaDeColecoes;
    const [iconArrow, setIconArrow] = useState('chevron-forward-outline');

    const MostraListaDeLojas = () => {
        mudaIconeDaSetaIndicativa();
    }

    const mudaIconeDaSetaIndicativa = () => {
        setIconArrow(iconArrow === 'chevron-forward-outline' ? 'chevron-down-outline' : 'chevron-forward-outline')
    }

    const verificaVisibilidadeDaListaDeLojas = (icon) => {
        return (
            <View>
                <FlatList data={Lojas} renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => navegaParaPerfilDaLoja(item)}>
                            <Text> - {item}</Text>
                        </TouchableOpacity>
                    )
                }} />
            </View>);
    }

    const verificaQuantidadeDeLojas = (loja) => {
        if (loja === 0) {
            return '';
        } else if (loja == 1) {
            return 'Loja';
        } else if (loja >= 1) {
            return 'Lojas';
        }
    }

    const verificaPrivacidadeDaLista = (privacidade) => {
        if (!privacidade) return "Lista pública";
        if (privacidade) return "Lista privada";
    }

    return (
        <Coluna>
            <Text>Criado em {DataCriacaoColecao.substring(0, 10)}</Text>
            <Text>Por {Nome}</Text>
            <Text>{verificaPrivacidadeDaLista(TipoLista)} . {Views} views . {shares} partilhas . {FotosLista.length} imagens</Text>
            <Text>{verificaQuantidadeDeLojas(Lojas.length)}: </Text>
            <View style={Linha} />
            {verificaVisibilidadeDaListaDeLojas(iconArrow)}
        </Coluna>
    )
}