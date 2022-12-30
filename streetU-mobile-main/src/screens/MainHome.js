import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, FlatList, Platform, RefreshControl, Alert } from 'react-native';
import { db } from '../util/Firebase';
import Background, { BackgroundSemAVoiding } from '../components/Background';
import { DataStorys } from '../../DATAFAKE';
import { CardColecoes } from '../components/CardColecoes';
import { AnimatedView } from '../components/AnimatedView';
import { Storys } from '../helpers/Storys';
import { Header } from '../components/Header';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { collection, doc, setDoc } from 'firebase/firestore';
import { seguindo } from '../objetos/Seguidor';
import colors from '../constants/colors';
import { Loading } from '../components/Loading';

var DETALHES_ITEM_COLECAO = 'DetalhesItemLista';
var PERFIL_PUBLICO = 'PerfilPublico';
var MEU_PERFIL = 'MeuPerfil';
var PERFIL_DA_LOJA = 'PerfilDaLoja';

export const MainHome = ({ navigation }) => {

    const {
        _RequestTodasAsColecoes,
        _RequestUsuariosQueEstouSeguindo,
        dataColecao,
        setDataMinhasListas,
        usuariosQueSigo,
        _RequestDataDoUsuario,
        dadosDePerfilDoUser,
        clearState,
        _RequestPedidosParaSeguir,
        pedidosRequested
    } = useContext(FirebaseContext);
    const { usuario } = useContext(UserContext);
    const [DataListaDeColecoes, setDataListaDeColecoes] = useState();
    const [DadosMeuPerfil, setDadosMeuPerfil] = useState(null);
    const [usersFollowing, setUsersFollowing] = useState();
    const [refshing, setRefshing] = useState(false);
    const [idColecoesBloqueadas, setIdColecoesBloqueadas] = useState(null);
    const [idColecoesANotificar, setIdColecoesANotificar] = useState(null);
    const [listaDeLojas, setListaDeLojas] = useState(null);


    const ativaRefshing = () => setRefshing(true);
    const desativaRefshing = () => setRefshing(false);

    var UserId = usuario.uid;

    //Aqui eu chamo todas as funções que precisam ser atualizadas quando alguma ação acontece
    const onRefresh = () => {
        setIdColecoesBloqueadas(null);
        setIdColecoesANotificar(null);
        ativaRefshing();
        recuperaColecoesBloqueadas();
        _RequestTodasAsColecoes(UserId);
        setDataMinhasListas(null);
        _RequestDataDoUsuario(UserId);
        _RequestUsuariosQueEstouSeguindo(UserId);
        recuperaColecoesANotificar();
        _RequestPedidosParaSeguir(UserId);
        requestedDataUser();
        recuperaTodosOsUsers();
    }

    useEffect(() => {
        const uns = navigation.addListener('focus', () => {
            _RequestUsuariosQueEstouSeguindo(UserId);
            clearState();
        })
        return uns;
    }, [navigation]);

    useEffect(() => {
        onRefresh();
    }, []);

    useEffect(() => {
        setDataListaDeColecoes(dataColecao);
        setUsersFollowing(usuariosQueSigo);
        desativaRefshing();
    }, [dataColecao, usuariosQueSigo, dadosDePerfilDoUser]);

    //Função para recuperar itens do user logado no DB
    const requestedDataUser = () => {
        var refDataUser = db.collection('usuarios').doc(UserId);
        refDataUser.onSnapshot((doc) => {
            if (doc.exists) return setDadosMeuPerfil(doc.data());
        });
    }

    //Funçao para abrir tela de detalhes
    const handlerAbreScreenDetalhes = (data) => {
        navigation.navigate(DETALHES_ITEM_COLECAO, {
            DataListaDeColecoes: data,
            goBackScreen: 'Inicio',
        });
    };

    //Funçao para abrir screen do perfil publico
    const handlerHeaderCard = (data) => {
        const verificaTipoDeUsuario = data?.isLoja;
        const idUsuarioDaColecao = data?.idUser;
        if (idUsuarioDaColecao === UserId) return navigation.navigate(MEU_PERFIL);
        if (verificaTipoDeUsuario) return navigation.navigate(PERFIL_DA_LOJA, { DadosDaLoja: data, goBackScreen: 'Inicio' });
        if (!verificaTipoDeUsuario) return navigation.navigate(PERFIL_PUBLICO, { DadosDoUsuarioPublico: data, DadosDoMeuPerfil: DadosMeuPerfil, usersFollowing: usersFollowing, goBackScreen: 'Inicio' });
    };

    //Funçao que começa o processo de seguir um usuario
    const handlerSegueUsuario = (data) => {
        const { idUser, Nome } = data;
        const SegueUsuario = seguindo(UserId, idUser, Nome);
        const ref_seguidor = doc(collection(db, "seguindo"));
        setDoc(ref_seguidor, SegueUsuario).then(() => {
            onRefresh();
        });
    };

    //Funçao que esconde determinada coleção do usuario logado
    const handlerEscondeColecaoDoUser = async (dataColecao) => {
        const { idColecao } = dataColecao;
        let colecaoAEsconder = {
            id: idColecao,
            userQueNaoQuerVer: UserId
        }
        const ref_Colecoes_in_off = doc(collection(db, 'colecoesInOff'));
        await setDoc(ref_Colecoes_in_off, colecaoAEsconder).then(() => {
            onRefresh();
            Alert.alert('Sucesso !', 'Você removeu essa lista do seu feed...', [
                {
                    text: "Desfazer",
                    onPress: () => mostraColecaoQueTavaEscondida(ref_Colecoes_in_off.id),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]);
        });

    };

    //Funçao que mostra determinada coleção do usuario logado
    const mostraColecaoQueTavaEscondida = async (idDoc) => {
        await db.collection('colecoesInOff').doc(idDoc).delete().then(() => {
            onRefresh();
        })
    };

    //Funçao que começa o processo  de ativar notificações de determinada coleção para o usuario logado
    const handlerAtivaNotificacoes = async (dataColecao) => {
        setIdColecoesANotificar(null);

        const { idColecao } = dataColecao;

        const verificaSeJaNotifica = db.collection('notificarColecoes').doc(idColecao + '-' + UserId);
        verificaSeJaNotifica.get().then((doc) => {
            if (doc.data() != undefined) {
                return excluiAtivacaoDeNotificacaoDeUmaLista(idColecao);
            } else {
                return salvaColecoesANotificar(idColecao);
            }
        });
    };

    //Funçao que desativa notificações de determinada coleção para o usuario logado
    const excluiAtivacaoDeNotificacaoDeUmaLista = async (id) => {
        await db.collection('notificarColecoes').doc(id + '-' + UserId).delete().then(() => {
            onRefresh();
            Alert.alert('Sucesso !', 'Essa lista não irá mais notificar quando houver novas imagens...');
        });
    }

    //Funçao que salva no db as coleções que o user logado escolheu para notificar
    const salvaColecoesANotificar = async (id) => {
        let colecaoANotificar = {
            idColecao: id,
            userANotificar: UserId
        };

        await db.collection('notificarColecoes').doc(id + '-' + UserId).set(colecaoANotificar).then(() => {
            onRefresh();
            Alert.alert('Sucesso !', 'Essa lista irá notificar quando houver novas imagens...');
        });

    };

    //Recupera do banco de dados os usuarios que o user logado bloqueou
    const recuperaColecoesBloqueadas = async () => {
        await db.collection('colecoesInOff').where('userQueNaoQuerVer', '==', UserId).onSnapshot((querySnapshot) => {
            let colecoesInvisible = [];
            querySnapshot.forEach((doc) => {
                colecoesInvisible.push({ ...doc.data() });
                setIdColecoesBloqueadas(colecoesInvisible);
                desativaRefshing();
            });
        });
    };

    //Recupera todas as coleções que o user logado ativou as notificações
    const recuperaColecoesANotificar = async () => {
        await db.collection('notificarColecoes').where('userANotificar', '==', UserId).onSnapshot((querySnapshot) => {
            let colecoesANotificar = [];
            querySnapshot.forEach((doc) => {
                colecoesANotificar.push({ ...doc.data() });
                setIdColecoesANotificar(colecoesANotificar);
                desativaRefshing();
            });
        });
    };

    const recuperaTodosOsUsers = async () => {
        let listaDeLojas = [];
        await db.collection('usuarios').where('user_tipo', '==', 1).onSnapshot((shot) => {
            shot.forEach(doc => {
                listaDeLojas.push(doc.data());
                setListaDeLojas(listaDeLojas);
            })
        })
    }

    return (
        <BackgroundSemAVoiding>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refshing}
                    />}
                showsVerticalScrollIndicator={false}>
                <Header />
                <Storys
                    DataStorys={DataStorys}
                    MostrarNomes={false} />
                {refshing ? <Loading /> :
                    <ListaColecoes
                        handlerSegueUsuario={handlerSegueUsuario}
                        handlerAbreScreenDetalhes={handlerAbreScreenDetalhes}
                        handlerHeaderCard={handlerHeaderCard}
                        DataListaDeColecoes={DataListaDeColecoes}
                        UserId={UserId}
                        usersFollowing={usersFollowing}
                        refshing={refshing}
                        onRefresh={onRefresh}
                        handlerEscondeColecaoDoUser={handlerEscondeColecaoDoUser}
                        handlerAtivaNotificacoes={handlerAtivaNotificacoes}
                        idColecoesBloqueadas={idColecoesBloqueadas}
                        idColecoesANotificar={idColecoesANotificar}
                        DadosMeuPerfil={DadosMeuPerfil}
                        listaDeLojas={listaDeLojas}
                    />
                }
            </ScrollView>
        </BackgroundSemAVoiding>
    )
}

const ListaColecoes = ({
    handlerAbreScreenDetalhes, DataListaDeColecoes,
    handlerHeaderCard, UserId,
    handlerSegueUsuario, usersFollowing,
    refshing, onRefresh, handlerEscondeColecaoDoUser,
    idColecoesBloqueadas, handlerAtivaNotificacoes,
    idColecoesANotificar, DadosMeuPerfil, listaDeLojas

}) => {

    let id_users_following = [];

    usersFollowing?.map((item) => {
        id_users_following.push(item.id_user_sendo_seguido);
    });

    return (
        <AnimatedView duration={1500}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refshing}
                    />
                }
                data={DataListaDeColecoes}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isLoja = item.isLoja;

                    return (
                        <>
                            {isLoja ? null :
                                <CardColecoes
                                    handlerAbreScreenDetalhes={handlerAbreScreenDetalhes}
                                    handlerSegueUsuario={handlerSegueUsuario}
                                    handlerHeaderCard={handlerHeaderCard}
                                    usersFollowing={usersFollowing}
                                    DataListaDeColecoes={item}
                                    UserId={UserId}
                                    handlerEscondeColecaoDoUser={handlerEscondeColecaoDoUser}
                                    idColecoesBloqueadas={idColecoesBloqueadas}
                                    handlerAtivaNotificacoes={handlerAtivaNotificacoes}
                                    idColecoesANotificar={idColecoesANotificar}
                                    DadosMeuPerfil={DadosMeuPerfil}
                                    listaDeLojas={listaDeLojas}
                                />
                            }
                        </>
                    )
                }
                }
            />
        </AnimatedView>
    )
}