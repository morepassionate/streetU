import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Image, FlatList, TouchableOpacity } from 'react-native';
import { AnimatedView } from '../components/AnimatedView';
import { BackgroundSemAVoiding } from '../components/Background';
import { Divisor } from '../components/Divisor';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { Button } from '../components/Button';
import { PopUpSaveColecao } from '../helpers/PopUpSaveColecao';
import { db } from '../util/Firebase';
import { SnackbarAlert } from '../components/Snackbar';
import { arrayUnion } from 'firebase/firestore';

const css = StyleSheet.create({
    containerHeader: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? '15%' : 10
    },

    IconeVoltar: {
        marginLeft: 15,
        marginRight: 15
    },

    coluna: {
        flexDirection: 'column',
        marginLeft: 10,
        width: Platform.OS === 'ios' ? '60%' : '65%'
    },

    TxtHeader: {
        fontSize: 12,
        width: 150
    },

    TxtSubheader: {
        marginTop: 5,
        fontSize: 13
    },

    Avatar: {
        width: 77,
        height: 82,
        borderRadius: 10,
    },

    Botao: {
        alignItems: 'center',
        padding: 10
    },

    ImagensGrid: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        borderRadius: 10
    },

    Padding: {
        padding: 15
    },

    SpaceTop: {
        marginTop: 20
    },

    CorIndication: {
        width: 15,
        height: 15,
        backgroundColor: colors.primary,
        borderRadius: 15,
        position: 'absolute',
        right: 15,
        top: 15
    }
});

const containerHeader = css.containerHeader;
const CorIndication = css.CorIndication;
const TxtSubheader = css.TxtSubheader;
const IconeVoltar = css.IconeVoltar;
const ImagensGrid = css.ImagensGrid;
const TxtHeader = css.TxtHeader;
const SpaceTop = css.SpaceTop;
const Padding = css.Padding;
const Avatar = css.Avatar;
const coluna = css.coluna;
const Botao = css.Botao;

var BOTAO_REDONDO_VOLTAR = "arrow-back-circle-outline";
var TITLE_FLATLIST = "Escolha as fotos";
var TEXT_SUBHEADER = "subheader";
var RESIZE_IMG = "cover";
var TAMANHO_ICONE = 30;
var SCREEN = "Inicio"

export const EscolheFotosDaColecao = ({ route, navigation }) => {

    const DataListaDeColecoes = route?.params?.dados_da_colecao;
    const DataListColecoesSalvas = route?.params?.DataListColecoesSalvas;
    const ListaDeImagens = DataListaDeColecoes?.FotosLista;
    const [listaDeImagensSelecionadas, setListaDeImagensSelecionadas] = useState([]);
    const [visibleModalSaveColecao, setVisibleModalSaveColecao] = useState(false);
    const [visibleSnackSalvouEmColecao, setVisibleSnackSalvouEmColecao] = useState(false);
    const [nomeBotao, setNomeBotao] = useState('foto');

    //Função para fechar o snakbar
    const onDismissSnackBar = () => setVisibleSnackSalvouEmColecao(false);

    //Função para fechar o pop up que salva colecao
    const fechaModalPopUp = () => setVisibleModalSaveColecao(false);

    useEffect(() => {
        if (listaDeImagensSelecionadas?.length === 0) return setNomeBotao(null);
        if (listaDeImagensSelecionadas?.length === 1) return setNomeBotao('foto');
        if (listaDeImagensSelecionadas?.length >= 2) return setNomeBotao('fotos');
    }, [listaDeImagensSelecionadas]);

    //Funçao que escolhe as fotos e poe dentro de uma lista
    const handlerEscolheFotos = (foto) => {
        var Lista = [];

        if (listaDeImagensSelecionadas.length === 0) {
            Lista.push(foto);
            setListaDeImagensSelecionadas(Lista);
        } else {
            let fotoJaEstaNosSelecionados = false;
            listaDeImagensSelecionadas.map(data => {
                let IdFoto = foto.idFoto;
                let IdFotoNoLooping = data.idFoto;
                if (IdFotoNoLooping === IdFoto) return fotoJaEstaNosSelecionados = true;
                if (IdFotoNoLooping !== IdFoto) return Lista.push(data);
            });

            if (fotoJaEstaNosSelecionados) return setListaDeImagensSelecionadas(Lista);
            if (!fotoJaEstaNosSelecionados) {
                Lista.push(foto);
                setListaDeImagensSelecionadas(Lista);
            }
        }
    };

    //Funçao para abrir pop up onde escolhe em qual coleção salvar
    const handlerSalvaFotosNaColecao = () => {
        setVisibleModalSaveColecao(true);
    };

    //Funçao para ir para a screen que cria uma nova lista
    const handlerVaiParaScreenDeCriacaoDeNovaLista = () => {
        setVisibleModalSaveColecao(false);
        navigation.navigate('CriarNovaLista');
    };

    //Funçao para salvar a lista de fotos selecionadas na colecao determinada
    const handlerSalvaAsFotosEscolhidaEmUmaColecao = (DadosColecao) => {
        const IdColecao = DadosColecao?.idColecao;
        const ListaDeFotoJaExistente = DadosColecao?.FotosLista;
        const NewArrayListaDeFotos = [...listaDeImagensSelecionadas, ...ListaDeFotoJaExistente];

        var nomeDaNovaLoja = [];
        var nomeDaNovaLojaNaListaExistente = [];
        var switchNomeDaLojaASalvar = [];

        var RefColecao = db.collection("colecoes").doc(IdColecao);

        ListaDeFotoJaExistente?.map((item) => {
            nomeDaNovaLojaNaListaExistente = item.LojaOrigem;
        });

        listaDeImagensSelecionadas?.map((item) => {
            nomeDaNovaLoja.push(item.LojaOrigem);
        });

        switchNomeDaLojaASalvar = nomeDaNovaLoja;

        return RefColecao.update({
            FotosLista: NewArrayListaDeFotos,
            visivel: true,
            Lojas: arrayUnion(...switchNomeDaLojaASalvar)
        }).then(() => {
            setVisibleSnackSalvouEmColecao(true);
            setVisibleModalSaveColecao(false);
            setListaDeImagensSelecionadas([]);
        });
    }

    //Voltar para tela annterior
    const handlerVoltaParaTelaAnterior = () => {
        navigation.navigate('DetalhesItemLista', { DataListaDeColecoes: DataListaDeColecoes, goBackScreen:SCREEN })
    }

    return (
        <BackgroundSemAVoiding>
            <Header
                DataListaDeColecoes={DataListaDeColecoes}
                handlerVoltarParaHome={handlerVoltaParaTelaAnterior} />
            <GridImagens
                DataListaDeColecoes={DataListaDeColecoes}
                handlerEscolheFotos={handlerEscolheFotos}
                listaDeImagensSelecionadas={listaDeImagensSelecionadas} />
            <BotaoFooter
                handlerSalvaFotosNaColecao={handlerSalvaFotosNaColecao}
                listaDeImagensSelecionadas={listaDeImagensSelecionadas}
                nomeBotao={nomeBotao} />
            <PopUpSaveColecao
                modalVisible={visibleModalSaveColecao}
                setModalVisible={setVisibleModalSaveColecao}
                DataListColecoesSalvas={DataListColecoesSalvas}
                handlerVaiParaScreenDeCriacaoDeNovaLista={handlerVaiParaScreenDeCriacaoDeNovaLista}
                handlerSalvaColecaoEmLista={handlerSalvaAsFotosEscolhidaEmUmaColecao}
                fechaModalPopUp={fechaModalPopUp}
            />
            <SnackbarAlert
                visibleSnack={visibleSnackSalvouEmColecao}
                onDismissSnackBar={onDismissSnackBar}
                txtSnack={'Guardado em lista'}
            />
        </BackgroundSemAVoiding>
    )
}

const Header = ({ DataListaDeColecoes, handlerVoltarParaHome }) => {
    const { TitleLista, Nome, idUser } = DataListaDeColecoes;

    return (
        <AnimatedView duration={500} style={containerHeader}>
            <Icone
                onPress={() => handlerVoltarParaHome()}
                nameIcone={BOTAO_REDONDO_VOLTAR}
                tamanhoIcon={TAMANHO_ICONE}
                corIcone={colors.white}
                style={IconeVoltar} />
            <Thumbnail DataListaDeColecoes={DataListaDeColecoes} />
            <AnimatedView style={coluna}>
                <Text
                    numberOfLines={1}
                    style={TxtHeader}>{TitleLista}</Text>
                <Divisor duration={500} />
                <Text
                    style={TxtSubheader}
                    type={TEXT_SUBHEADER}>{Nome}</Text>
            </AnimatedView>
        </AnimatedView>
    )
};

const Thumbnail = ({ DataListaDeColecoes }) => {
    const { AvatarPerfil } = DataListaDeColecoes;

    return (
        <AnimatedView duration={1500}>
            <Image
                resizeMode={RESIZE_IMG}
                style={Avatar}
                source={{ uri: AvatarPerfil }} />
        </AnimatedView>
    )
};

const GridImagens = ({ DataListaDeColecoes, handlerEscolheFotos, listaDeImagensSelecionadas }) => {
    const ListaDeImagens = DataListaDeColecoes?.FotosLista;
    var IdTodasAsFotosDaColecao = [];
    var IdFotoDaColecao = "";

    listaDeImagensSelecionadas?.map((item) => {
        IdTodasAsFotosDaColecao.push(item.idFoto);
    });

    return (
        <AnimatedView duration={1500}>
            <FlatList
                numColumns={4}
                data={ListaDeImagens}
                ListHeaderComponent={() => <Text>{TITLE_FLATLIST}</Text>}
                ListHeaderComponentStyle={Padding}
                contentContainerStyle={SpaceTop}
                renderItem={({ item }) => {
                    IdFotoDaColecao = item.idFoto;
                    const result = IdTodasAsFotosDaColecao.includes(IdFotoDaColecao);

                    return (
                        <TouchableOpacity onPress={() => handlerEscolheFotos(item)} style={Botao} >
                            <Image
                                source={{ uri: item.uri }}
                                style={ImagensGrid} />
                            {result ? <View style={CorIndication} /> : null}
                        </TouchableOpacity>
                    )
                }}
            />
        </AnimatedView>
    )
};

const BotaoFooter = ({ handlerSalvaFotosNaColecao, nomeBotao, listaDeImagensSelecionadas }) => {

    const verificaQuantiadeDeFotosNaLista = (ListaImagens) => {
        if (ListaImagens === 0) return null;
        if (ListaImagens >= 0) return ListaImagens;
    };

    return (
        !!listaDeImagensSelecionadas.length ?
            <View style={Padding}>
                <Button
                    onPress={() => handlerSalvaFotosNaColecao()}>
                    Salvar {verificaQuantiadeDeFotosNaLista(listaDeImagensSelecionadas.length)} {nomeBotao}
                </Button>
            </View>
            : null
    )
}