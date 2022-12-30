import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Platform, StatusBar, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AnimatedView } from '../components/AnimatedView';
import { BackgroundSemAVoiding } from '../components/Background';
import { Divisor } from '../components/Divisor';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { PopUpSaveColecao } from '../helpers/PopUpSaveColecao';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { PopUpEscolheQualTipoSalvar } from '../helpers/PopUpEscolheQualTipoSalvar';
import { db } from '../util/Firebase';
import { arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import { SnackbarAlert } from '../components/Snackbar';
import { SalvouInColecao } from '../objetos/SalvouInColecao';

const { width, height } = Dimensions.get('screen');

const css = StyleSheet.create({
    containerHeader: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? '15%' : 10,
    },
    coluna: {
        flexDirection: 'column',
        marginLeft: 10,
        width: Platform.OS === 'ios' ? '60%' : '65%'
    },
    Avatar: {
        width: 77,
        height: 82,
        borderRadius: 10,
    },
    IconeVoltar: {
        marginLeft: 15,
        marginRight: 15
    },
    TxtSubheader: {
        marginTop: 5,
        fontSize: 13
    },
    TxtHeader: {
        fontSize: 12,
        width: 150
    },
    IconeNotificacao: {
        position: 'absolute',
        right: 55,
        top: -25
    },
    IconeConfig: {
        position: 'absolute',
        right: 10,
        top: -25
    },
    Row: {
        flexDirection: 'row-reverse',
        paddingLeft: 15,
        marginTop: 20
    },
    SpaceLeft: {
        marginLeft: 10
    },
    ContainerBody: {
        alignItems: 'center',
        marginTop: -15,
        marginBottom: -80
    },
    ContainerImagem: {
        width: width / 2 * 1.8,
        height: height / 2 * 1.3  ,
        borderRadius: 15,
        marginRight: 5,
        marginLeft: 12
    },
    ContainerImagemSemOpacity: {
        width: width / 2 * 1.9,
        height: height / 2 * 1.3,
        borderRadius: 15,
        marginRight: 10, 
        marginLeft: 12
    },
    ContainerFooter: {
        width: '100%',
        marginTop: -20
    },
    TxtFooter: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 17,
        width: width / 2 * 1.5,
        alignSelf: 'center'
    },
    LinhaDivisor: {
        marginLeft: 40,
        marginRight: 40,
        height: 2,
        marginBottom: 20,
        backgroundColor: colors.cinzaTxt,
    },
    containerIconeFooter: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15
    },
    iconeFooter: {
        height: 30,
        width: 30,
        marginRight: 15
    },
    paddingX: {
        //paddingHorizontal: 10
    },
    ArrowRight: {
        position: 'absolute',
        right: 2,
        top: '35%'
    },
    ArrowLeft: {
        position: 'absolute',
        left: 2,
        top: '35%'
    },
});

const Row = [css.Row];
const coluna = [css.coluna];
const Avatar = [css.Avatar];
const TxtFooter = [css.TxtFooter];
const TxtHeader = [css.TxtHeader];
const SpaceLeft = [css.SpaceLeft];
const iconeFooter = [css.iconeFooter];
const IconeVoltar = [css.IconeVoltar];
const IconeConfig = [css.IconeConfig];
const LinhaDivisor = [css.LinhaDivisor];
const TxtSubheader = [css.TxtSubheader];
const ContainerBody = [css.ContainerBody];
const ContainerImagem = [css.ContainerImagem];
const ContainerImagemSemOpacity = [css.ContainerImagemSemOpacity];
const ContainerFooter = [css.ContainerFooter];
const containerHeader = [css.containerHeader];
const IconeNotificacao = [css.IconeNotificacao];
const containerIconeFooter = [css.containerIconeFooter];
const paddingX = [css.paddingX];
const ArrowRight = [css.ArrowRight];
const ArrowLeft = [css.ArrowLeft];

var ICONE_BOOKMARK_OUTLINE = "bookmark-outline";
var ICONE_BOOKMARK_FILLED = "bookmark";
var ICONE_SHARE = "share-social-outline";
var ICONE_NOTIFICACAO_OUTLINE = "notifications-outline";
var ICONE_CLOSE = "close-circle-outline";
var ICONE_CONFIG = "ellipsis-vertical";
var BOTAO_REDONDO_VOLTAR = "arrow-back-circle-outline";
var TEXT_SUBHEADER = "subheader";
var TAMANHO_ICONE = 30;
var RESIZE_IMG = "cover";
var TIME_PARA_FECHAR = 3000;

export const DetalhesItemLista = ({ route, navigation }) => {

    const { _RequestMinhasListas, dataMinhasListas, indexImagemSelected } = useContext(FirebaseContext);
    const { usuario } = useContext(UserContext);
    const UserUid = usuario.uid;
    const [DataListColecoesSalvas, setDataListColecoesSalvas] = useState();
    const [visible, setIsVisible] = useState(false);
    const [iconeBookmark, setIconeBookmark] = useState(ICONE_BOOKMARK_OUTLINE);
    const [visibleModalSaveColecao, setVisibleModalSaveColecao] = useState(false);
    const [visibleSnackSalvouEmColecao, setVisibleSnackSalvouEmColecao] = useState(false);
    const [listaOndeColecaoSeraSalva, setListaOndeColecaoSeraSalva] = useState([]);
    const [idColecoesANotificar, setIdColecoesANotificar] = useState(null);

    const [Images, setImage] = useState([]);

    var dados_da_colecao = route.params?.DataListaDeColecoes;
    var GO_BACK_SCREEN = route.params?.goBackScreen;

    //Função para fechar o snakbar
    const onDismissSnackBar = () => setVisibleSnackSalvouEmColecao(false);

    //Função para fechar o pop up que salva colecao
    const fechaModalPopUp = () => setVisibleModalSaveColecao(false);

    useEffect(() => {
        setIconeBookmark(!visibleModalSaveColecao && listaOndeColecaoSeraSalva.length === 0 ? ICONE_BOOKMARK_OUTLINE : ICONE_BOOKMARK_FILLED);
        _RequestMinhasListas(UserUid);
    }, [visibleModalSaveColecao, listaOndeColecaoSeraSalva]);

    useEffect(() => {
        setDataListColecoesSalvas(dataMinhasListas);
        recuperaColecoesANotificar();
    }, [dataMinhasListas]);

    useEffect(() => {
        const IniciaFechamentoDoSnackAutomaticamente = () => {
            setTimeout(() => {
                onDismissSnackBar();
            }, TIME_PARA_FECHAR);
        }
        IniciaFechamentoDoSnackAutomaticamente();
    }, []);

    //Abre pop up com uma flatlist de todas as listas do usuario
    const handlerModalSalvarColecao = () => {
        setVisibleModalSaveColecao(!visibleModalSaveColecao ? true : false);
    };

    //Salva colecao em determinada lista recuperada ou criada no momento (tipo uma playlist)
    const handlerSalvaColecaoEmLista = (lista) => {
        setVisibleModalSaveColecao(false);
        setListaOndeColecaoSeraSalva(lista);
        handlerSalvaTodasAsFotosDeUmaColecao(lista.idColecao, Images, UserUid);
    };

    //Funçao para voltar para a home
    const handlerVoltarParaHome = () => {
        navigation.navigate(GO_BACK_SCREEN);
    };

    //Funçao para ir para a screen que cria uma nova lista
    const handlerVaiParaScreenDeCriacaoDeNovaLista = () => {
        setVisibleModalSaveColecao(false);
        navigation.navigate('CriarNovaLista');
    };

    //Funçao que pega todas as fotos de determinada coleção de uma loja e salva na sua propria lista
    const handlerSalvaTodasAsFotosDeUmaColecao = (Id_Colecao, Lista_de_Imagens, userId) => {

        var nomeDaNovaLoja = [];
        var imgDaNovaLoja = [];
        var idDaNovaLoja = [];

        var uri = Lista_de_Imagens?.uri;
        var id_image = Lista_de_Imagens?.idFoto;
        var lojaOrigem = Lista_de_Imagens?.LojaOrigem;
        var idDaLoja = Lista_de_Imagens?.idLojaOrigem;
        var LogoLojaOrigem = Lista_de_Imagens?.LogoLojaOrigem; 

        const ref_colecao = db.collection("colecoes").doc(Id_Colecao);
        const ref_saveInColecao = doc(collection(db, "salvouInColecao"));

        nomeDaNovaLoja.push(Lista_de_Imagens?.LojaOrigem);
        imgDaNovaLoja.push(LogoLojaOrigem);
        idDaNovaLoja.push(idDaLoja);

        const newMap = SalvouInColecao(userId, ref_colecao.id, id_image, uri, idDaLoja, lojaOrigem);

        //SUBSTITUIR ...imgDaNovaLoja por ...idDaNovaLoja e quando for mostrar no pop up fazer uma requisição dos dados da loja pelo id
        return ref_colecao.update({
            FotosLista: arrayUnion(Lista_de_Imagens),
            visivel: true,
            Lojas: arrayUnion(...imgDaNovaLoja)
        }).then(() => {
            setDoc(ref_saveInColecao, newMap).then(() => {
                setVisibleSnackSalvouEmColecao(true);
            });
        }).catch((error) => {
        });

    };

    //Abre pop up que salva coleção em lista
    const handlerAbrePopUpSaveColecao = (Img) => {
        setImage(Img);
        handlerModalSalvarColecao();
    };

    //Função handler que verifica se coleção ja esta notificando e add a saida correta para cada situação
    const handlerAtivaNotificacoes = async (dataColecao) => {
        setIdColecoesANotificar(null);

        const { idColecao } = dataColecao;

        const verificaSeJaNotifica = db.collection('notificarColecoes').doc(idColecao + '-' + UserUid);
        verificaSeJaNotifica.get().then((doc) => {
            if (doc.data() != undefined) {
                return excluiAtivacaoDeNotificacaoDeUmaLista(idColecao);
            } else {
                return salvaColecoesANotificar(idColecao);
            }
        });
    };

    //Função que excluir opção de notificar do db
    const excluiAtivacaoDeNotificacaoDeUmaLista = async (id) => {
        await db.collection('notificarColecoes').doc(id + '-' + UserUid).delete().then(() => {
            Alert.alert('Sucesso !', 'Essa lista não irá mais notificar quando houver novas imagens...');
        });
    }

    //Função que salva opção de notificar do db
    const salvaColecoesANotificar = async (id) => {
        let colecaoANotificar = {
            idColecao: id,
            userANotificar: UserUid
        };

        await db.collection('notificarColecoes').doc(id + '-' + UserUid).set(colecaoANotificar).then(() => {
            Alert.alert('Sucesso !', 'Essa lista irá notificar quando houver novas imagens...');
        });

    };

    //Função para recuperar as colecoes que estao sendo notificadas
    const recuperaColecoesANotificar = async () => {
        await db.collection('notificarColecoes').where('userANotificar', '==', UserUid).onSnapshot((querySnapshot) => {
            let colecoesANotificar = [];
            querySnapshot.forEach((doc) => {
                colecoesANotificar.push({ ...doc.data() });
                setIdColecoesANotificar(colecoesANotificar);
            });
        });
    };

    return (
        <BackgroundSemAVoiding>
            <Header
                DataListaDeColecoes={dados_da_colecao}
                handlerVoltarParaHome={handlerVoltarParaHome}
                UserUid={UserUid}
                idColecoesANotificar={idColecoesANotificar}
                handlerAtivaNotificacoes={handlerAtivaNotificacoes}
            />
            <Body
                handlerAbrePopUpSaveColecao={handlerAbrePopUpSaveColecao}
                DataListaDeColecoes={dados_da_colecao}
                indexImagemSelected={indexImagemSelected}
                UserUid={UserUid}
            />
            <SnackbarAlert
                visibleSnack={visibleSnackSalvouEmColecao}
                onDismissSnackBar={onDismissSnackBar}
                txtSnack={'Guardado em lista'}
            />
            <PopUpSaveColecao
                modalVisible={visibleModalSaveColecao}
                setModalVisible={setVisibleModalSaveColecao}
                DataListColecoesSalvas={DataListColecoesSalvas}
                handlerModalSalvarColecao={handlerModalSalvarColecao}
                handlerSalvaColecaoEmLista={handlerSalvaColecaoEmLista}
                handlerVaiParaScreenDeCriacaoDeNovaLista={handlerVaiParaScreenDeCriacaoDeNovaLista}
                fechaModalPopUp={fechaModalPopUp} />
        </BackgroundSemAVoiding>
    );
}

const Header = ({ DataListaDeColecoes, handlerVoltarParaHome, UserUid, idColecoesANotificar, handlerAtivaNotificacoes }) => {
    const { TitleLista, Nome, idUser, idColecao } = DataListaDeColecoes;

    var IdColecoesANotificar = [];
    idColecoesANotificar?.map((item) => {
        IdColecoesANotificar.push(item.idColecao);
    });

    const result = IdColecoesANotificar.includes(idColecao);

    return (
        <AnimatedView style={containerHeader}>
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
                <Divisor duration={700} />
                <Text
                    style={TxtSubheader}
                    type={TEXT_SUBHEADER}>{Nome}</Text>
            </AnimatedView>
            {idUser === UserUid ?
                <Icone
                    nameIcone={ICONE_SHARE}
                    tamanhoIcon={25}
                    corIcone={colors.cinzaTxt}
                    style={IconeNotificacao}
                /> :
                <Icone
                    onPress={() => handlerAtivaNotificacoes(DataListaDeColecoes)}
                    nameIcone={result ? ICONE_CLOSE : ICONE_NOTIFICACAO_OUTLINE}
                    tamanhoIcon={25}
                    corIcone={result ? colors.primary : colors.cinzaTxt}
                    style={IconeNotificacao}
                />}
            <Icone
                nameIcone={ICONE_CONFIG}
                tamanhoIcon={25}
                corIcone={colors.cinzaTxt}
                style={IconeConfig} />
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

const Body = ({ DataListaDeColecoes, handlerAbrePopUpSaveColecao, indexImagemSelected, UserUid }) => {
    const ImageRef = useRef();
    const { FotosLista, idUser, DescricaoColecao } = DataListaDeColecoes;
    const [activeIndex, setActiveIndex] = useState(indexImagemSelected);
    const StyleViewRowButtonsItens = { flexDirection: 'row-reverse', paddingLeft: 20, marginBottom: 10 };

    useEffect(() => {
        setActiveIndex(indexImagemSelected);
        setTimeout(() => {
            if (indexImagemSelected === FotosLista / 2) {
                ImageRef.current?.scrollToOffset({
                    offset: indexImagemSelected * width - width / 2 + 415 / 2,
                    animated: true
                });
            } else {
                ImageRef.current?.scrollToOffset({
                    offset: indexImagemSelected * width - width / 2 + 415 / 2,
                    animated: true
                });
            }
        }, 400);
    }, []);

    const scrollToIndex = (index) => {
        setActiveIndex(index);
        if (index * width + 10 / 2 > width) {
            ImageRef.current?.scrollToOffset({
                offset: index * width - width / 2 + 420 / 2,
                animated: true
            });
        } else if (index + 1 === FotosLista?.length) {
            ImageRef.current?.scrollToOffset({
                offset: index * width / 2 + 420 / 2,
                animated: true
            });
        } else {
            ImageRef.current?.scrollToOffset({
                offset: 0,
                animated: true
            });
        }
    };

    return (
        <AnimatedView
            duration={1900}
            style={ContainerBody}>
            <FlatList
                horizontal
                ref={ImageRef}
                data={FotosLista}
                pagingEnabled
                scrollEnabled={true} 
                onMomentumScrollEnd={ev => {
                    setActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width))
                }}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={paddingX}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            {idUser === UserUid ?
                                <View style={{ height: 35 }} /> :
                                <View style={StyleViewRowButtonsItens}>
                                    <Icone
                                        nameIcone={'share-social-outline'}
                                        tamanhoIcon={25}
                                        corIcone={colors.cinzaTxt} />
                                    <Icone
                                        nameIcone={'bookmark-outline'}
                                        tamanhoIcon={25}
                                        corIcone={colors.cinzaTxt}
                                        onPress={() => handlerAbrePopUpSaveColecao(item)}
                                        style={{ marginRight: 10 }} />
                                </View>
                            }
                            <Image
                                resizeMode='cover'
                                source={{ uri: item.uri }}
                                style={activeIndex === index ? ContainerImagem : ContainerImagemSemOpacity}
                            />
                            <Text
                                type={TEXT_SUBHEADER}
                                style={TxtFooter}>{item.descricaoFoto}</Text>
                            <Footer
                                DataListaDeColecoes={item}
                                DescricaoColecao={DescricaoColecao}
                            />
                        </View>
                    )
                }}
            /> 
        </AnimatedView>
    )
}

const Footer = ({ DataListaDeColecoes, DescricaoColecao }) => {
    var DESC_COLECAO = DescricaoColecao;

    return (
        <AnimatedView duration={2100} style={ContainerFooter}>
            <Text
                type={TEXT_SUBHEADER}
                style={TxtFooter}>{DESC_COLECAO}</Text>
            <Divisor style={LinhaDivisor} />
            <AnimatedView style={containerIconeFooter}>
                <Image
                    resizeMode="contain"
                    source={{ uri: DataListaDeColecoes?.LogoLojaOrigem }}
                    style={iconeFooter} />
                <Text>{DataListaDeColecoes?.LojaOrigem}</Text>
            </AnimatedView>
        </AnimatedView>
    )
}
