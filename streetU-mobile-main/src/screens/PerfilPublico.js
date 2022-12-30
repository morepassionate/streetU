import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image, StatusBar, Platform, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { BackgroundSemAVoiding } from '../components/Background';
import colors from '../constants/colors';
import { AnimatedView } from '../components/AnimatedView';
import { Text } from '../components/Text';
import Icone from '../components/Icone';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { CardListasNoPerfil } from '../components/CardListasNoPerfil';
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { UserContext } from '../contexts/UserContext';
import { seguindo } from '../objetos/Seguidor';
import { db } from '../util/Firebase';
import { novoUserBlock } from '../objetos/UsuarioBloqueado';

const css = StyleSheet.create({
    avatar: {
        height: 120,
        width: 120,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 20
    },
    txt_name: {
        textAlign: 'center',
        color: colors.white
    },
    txt_subHeader: {
        marginTop: -20,
        marginBottom: 20,
        textAlign: 'center'
    },
    icon_pencil: {
        position: 'absolute',
        right: '25%',
        top: 110
    },
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
    txtViews: {
        textAlign: 'right',
        marginRight: 15,
        marginTop: 5,
        fontSize: 13
    },
    IconeStyle: {
        position: 'absolute',
        left: 15,
        top: 10
    },
    ContainerHeader: {
        marginTop: Platform.OS === 'ios' ? '10%' : 0,
        marginBottom: -20
    },
    botaoSeguir: {
        borderWidth: 1,
        borderColor: colors.white,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        alignSelf: 'center',
        padding: 5,
        marginBottom: '10%'
    },
    botaoOnfollow: {
        borderWidth: 1,
        borderColor: colors.primary,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        alignSelf: 'center',
        padding: 5,
        marginBottom: '10%'
    }
});

const avatar = css.avatar;
const icon_pencil = css.icon_pencil;
const txt_name = css.txt_name;
const txt_subHeader = css.txt_subHeader;
const IconeStyle = css.IconeStyle;
const ContainerHeader = css.ContainerHeader;
const botaoSeguir = css.botaoSeguir;
const botaoOnfollow = css.botaoOnfollow;

var BOTAO_REDONDO_VOLTAR = "arrow-back-circle-outline";
var TAMANHO_ICONE = 40;
var ICONE_LOCK = 'lock-closed-outline';
var SIZE_ICONE = 25;
var COR_ICONE = colors.white;
var HEADER = "header";

export const PerfilPublico = ({ route, navigation }) => {

    const { usuario } = useContext(UserContext);
    const IdUsuarioPublico = route?.params?.DadosDoUsuarioPublico?.idUser;
    const NomeUsuarioPublico = route?.params?.DadosDoUsuarioPublico?.Nome;
    const [usersFollowing, setUsersFollowing] = useState([]);
    const PaginaAnterior = route?.params?.goBackScreen;
    const { _RequestDataDoUsuario, dadosDePerfilDoUser, _RequestMinhasListas, dataMinhasListas } = useContext(FirebaseContext);
    const [dadosUsuarioRequested, setDadosUsuarioRequested] = useState([]);
    const [listaDoUsuarioPublicoRequested, setListaDoUsuarioPublicoRequested] = useState([]);
    const [nomeBotaSeguir, setNomeBotaoSeguir] = useState('Seguir');
    const [dataDoPerfilDoUserLogado, setDataDoPerfilDoUserLogado] = useState(null);
    const [minhaListaDeSeguidores, setMinhaListaDeSeguidores] = useState([]);
    const [userJaSegue, setUserJaSegue] = useState(false);

    var IdUsersFollowing = [];
    var listaDeSeguidores = [];
    var UserId = usuario?.uid;
    var NomeUserSeguidor = dataDoPerfilDoUserLogado?.user_name;
    var AvatarUserSeguidor = dataDoPerfilDoUserLogado?.user_foto_avatar;

    const [refshing, setRefshing] = useState(false);

    const ativaRefshing = () => setRefshing(true);
    const desativaRefshing = () => setRefshing(false);

    const onRefresh = () => {
        ativaRefshing();
        _RequestDataDoUsuario(IdUsuarioPublico);
        _RequestMinhasListas(IdUsuarioPublico);
        _requestDataUser();
        recuperaDadosDosSeguidores();
        recuperaUsuarioQueEuJaSigo();
    }

    const _requestDataUser = () => {
        var refDataUser = db.collection("usuarios").doc(UserId);
        refDataUser.onSnapshot((doc) => {
            if (doc.exists) return setDataDoPerfilDoUserLogado(doc.data());
        });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            _RequestDataDoUsuario(IdUsuarioPublico);
            _RequestMinhasListas(IdUsuarioPublico);
            _requestDataUser();
            recuperaDadosDosSeguidores();
            recuperaUsuarioQueEuJaSigo();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        setDadosUsuarioRequested(dadosDePerfilDoUser);
        setListaDoUsuarioPublicoRequested(dataMinhasListas);
        desativaRefshing();
    }, [dadosDePerfilDoUser, dataMinhasListas]);

    usersFollowing?.map((item) => {
        IdUsersFollowing.push(item.id_user_sendo_seguido);
    });

    const result = IdUsersFollowing.includes(IdUsuarioPublico); 
    const recuperaUsuarioQueEuJaSigo = () => {
        db.collection('seguindo')
            .where('id_user_sendo_seguido', '==', IdUsuarioPublico)
            .where('id_user_seguidor', '==', UserId)
            .orderBy('data_criacao', "desc").onSnapshot((querySnapshot) => {
                let JaSigo = [];
                querySnapshot.forEach((doc) => {
                    JaSigo.push({ ...doc.data(), id: doc.id });
                });
                console.log(JaSigo.length);
                if (JaSigo.length > 0) {
                    setUserJaSegue(true);
                } else {
                    setUserJaSegue(false);
                }
                setUsersFollowing(JaSigo);
            });
    }

    const handlerSegueUsuario = async (data) => {
        const { IdUsuarioPublico, NomeUsuarioPublico } = data;
        salvaNovaRequisicaoDeFollowNoBancoDeDados(IdUsuarioPublico, NomeUsuarioPublico);
    };

    const salvaNovaRequisicaoDeFollowNoBancoDeDados = (idUserPublico, nomeUserPublico) => {
        const refUserLogado = db.collection('usuarios').doc(UserId);
        const SegueUsuario = seguindo(UserId, idUserPublico, nomeUserPublico, false, NomeUserSeguidor, AvatarUserSeguidor, true);
        const ref_seguidor = doc(collection(db, "seguindo"));
        return setDoc(ref_seguidor, SegueUsuario).then(() => {
            refUserLogado.update({
                seguindo: arrayUnion(idUserPublico)
            })
            setNomeBotaoSeguir('Seguindo');
            onRefresh();
        });
    };

    const handlerUnfollowUsuario = (data) => {
        excluiRequestFollow(data);
    };

    const handlerVoltaPaginaAnterior = () => {
        setUsersFollowing(null);
        setMinhaListaDeSeguidores(null);
        navigation.navigate(PaginaAnterior);
    };

    const handlerBloqueiaUser = () => {
        const ref_bloqueio_de_user = doc(collection(db, 'usuariosBloqueados'));
        listaDoUsuarioPublicoRequested?.map((item) => {
            const userBloqueado = novoUserBlock(UserId, item.idUser, item.Nome);
            return setDoc(ref_bloqueio_de_user, userBloqueado).then(() => {
                onRefresh();
            });
        });
        return;
    };

    const excluiRequestFollow = (req) => {

        const { IdUsuarioPublico } = req;
        db.collection('seguindo')
            .where('id_user_sendo_seguido', '==', IdUsuarioPublico)
            .where('id_user_seguidor', '==', UserId)
            .orderBy('data_criacao', "desc").onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    deleteFirestore(doc.id);
                });
            });
    };

    const deleteFirestore = (id) => {
        const refSeguindo = db.collection("seguindo").doc(id);
        refSeguindo.delete().then(() => {
            _RequestDataDoUsuario(IdUsuarioPublico);
            _RequestMinhasListas(IdUsuarioPublico);
            db.collection('seguindo')
                .where('id_user_sendo_seguido', '==', IdUsuarioPublico)
                .where('id_user_seguidor', '==', UserId)
                .orderBy('data_criacao', "desc").onSnapshot((querySnapshot) => {
                    let JaSigo = [];
                    querySnapshot.forEach((doc) => {
                        JaSigo.push({ ...doc.data(), id: doc.id });
                    });
                });
            Alert.alert('Sucesso !', 'Você deixou de seguir este usuário...');
            onRefresh();
        });
    };

    const recuperaDadosDosSeguidores = () => {
        db.collection('seguidores').where('id_user', '==', IdUsuarioPublico)
            .orderBy("data_criacao", "desc").onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    listaDeSeguidores.push({ ...doc.data(), id: doc.id });
                    setMinhaListaDeSeguidores(listaDeSeguidores);
                });
            });
    };

    return (
        <BackgroundSemAVoiding>
            <ListaDeColecoesDoUsuarioPublico
                listaDoUsuarioPublicoRequested={listaDoUsuarioPublicoRequested}
                dadosUsuarioRequested={dadosUsuarioRequested}
                handlerVoltaPaginaAnterior={handlerVoltaPaginaAnterior}
                result={result}
                handlerSegueUsuario={handlerSegueUsuario}
                IdUsuarioPublico={IdUsuarioPublico}
                NomeUsuarioPublico={NomeUsuarioPublico}
                nomeBotaSeguir={nomeBotaSeguir}
                handlerBloqueiaUser={handlerBloqueiaUser}
                handlerUnfollowUsuario={handlerUnfollowUsuario}
                minhaListaDeSeguidores={minhaListaDeSeguidores?.length}
                onRefresh={onRefresh}
                refshing={refshing}
                userJaSegue={userJaSegue}
            />
        </BackgroundSemAVoiding>
    )
}

const HeaderBody = ({

    listaDoUsuarioPublicoRequested, dadosUsuario,
    handlerVoltaPaginaAnterior, handlerSegueUsuario,
    IdUsuarioPublico, NomeUsuarioPublico,
    handlerBloqueiaUser, handlerUnfollowUsuario, minhaListaDeSeguidores, userJaSegue

}) => {

    const AvatarPerfil = dadosUsuario?.user_foto_avatar;
    const Nome = dadosUsuario?.user_name;

    const verificaQuantidadeDeListas = (listas) => {
        if (listas === 0 || undefined || null) return null;
        if (listas === 1) return 'lista';
        if (listas >= 2) return 'listas';
    };

    const verificaQuantidadeDeSeguidores = (seguidores) => {
        if (seguidores === 0 || undefined || null) return null;
        if (seguidores === 1) return 'seguidor';
        if (seguidores >= 2) return 'seguidores';
    };

    return (
        <AnimatedView duration={1300} style={ContainerHeader}>
            <Icone
                nameIcone={BOTAO_REDONDO_VOLTAR}
                tamanhoIcon={TAMANHO_ICONE}
                corIcone={colors.white}
                style={IconeStyle}
                onPress={() => handlerVoltaPaginaAnterior()}
            />
            <Icone
                style={icon_pencil}
                nameIcone={ICONE_LOCK}
                tamanhoIcon={SIZE_ICONE}
                corIcone={COR_ICONE}
                onPress={() => handlerBloqueiaUser()}
            />
            <Image
                style={avatar}
                source={{ uri: AvatarPerfil }} />
            <Text
                style={txt_name}
                type={HEADER}>{Nome}</Text>
            <Text
                style={txt_subHeader}>{!!minhaListaDeSeguidores ? minhaListaDeSeguidores : 'Nenhum seguidor'} {verificaQuantidadeDeSeguidores(minhaListaDeSeguidores)} . {listaDoUsuarioPublicoRequested?.length} {verificaQuantidadeDeListas(listaDoUsuarioPublicoRequested?.length)}</Text>

            {userJaSegue ?
                <TouchableOpacity
                    onPress={() => handlerUnfollowUsuario({ IdUsuarioPublico, NomeUsuarioPublico })}
                    style={botaoOnfollow}>
                    <Text style={{
                        color: colors.primary
                    }}>Seguindo</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => handlerSegueUsuario({ IdUsuarioPublico, NomeUsuarioPublico })}
                    style={botaoSeguir}>
                    <Text>Seguir</Text>
                </TouchableOpacity>
            }

        </AnimatedView>
    )
};

const ListaDeColecoesDoUsuarioPublico = ({
    listaDoUsuarioPublicoRequested, dadosUsuarioRequested,
    handlerVoltaPaginaAnterior, result, handlerSegueUsuario,
    IdUsuarioPublico, NomeUsuarioPublico, nomeBotaSeguir,
    handlerBloqueiaUser, handlerUnfollowUsuario, minhaListaDeSeguidores,
    onRefresh, refshing, userJaSegue
}) => {
    return (
        <AnimatedView duration={1900}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refshing}
                    />}
                ListHeaderComponent={() =>
                    <HeaderBody
                        dadosUsuario={dadosUsuarioRequested}
                        listaDoUsuarioPublicoRequested={listaDoUsuarioPublicoRequested}
                        handlerVoltaPaginaAnterior={handlerVoltaPaginaAnterior}
                        result={result}
                        IdUsuarioPublico={IdUsuarioPublico}
                        NomeUsuarioPublico={NomeUsuarioPublico}
                        handlerSegueUsuario={handlerSegueUsuario}
                        nomeBotaSeguir={nomeBotaSeguir}
                        handlerBloqueiaUser={handlerBloqueiaUser}
                        handlerUnfollowUsuario={handlerUnfollowUsuario}
                        minhaListaDeSeguidores={minhaListaDeSeguidores}
                        userJaSegue={userJaSegue}
                    />}
                showsVerticalScrollIndicator={false}
                data={listaDoUsuarioPublicoRequested}
                renderItem={({ item }) =>
                    <CardListasNoPerfil listaDeColecoesDoUsuario={item} />}
            />
        </AnimatedView>
    )
}

