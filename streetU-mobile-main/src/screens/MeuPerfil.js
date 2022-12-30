import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { AnimatedView } from '../components/AnimatedView';
import { BackgroundSemAVoiding } from '../components/Background';
import { CardCategorias } from '../components/CardCategorias';
import { CardListasNoPerfil } from '../components/CardListasNoPerfil';
import { Header } from '../components/Header';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { db, storage } from '../util/Firebase';
import * as ImagePicker from 'expo-image-picker';
import { Loading } from '../components/Loading';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import { CardPedidosRequested } from '../components/CardPedidosRequested';
import { seguindo } from '../objetos/Seguidor';
import { seguidores } from '../objetos/Seguidores';

const css = StyleSheet.create({
    avatar: {
        height: 160,
        width: 160,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 20
    },
    txt_name: {
        textAlign: 'center',
        fontSize: 20,
        color: colors.white,
        width: 150,
    },
    icon_pencil: {
        position: 'absolute',
        right: '23%',
        top: 150
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
    centralizaView: {
        alignItems: 'center',

    },
    pencil: {
        position: 'absolute',
        right: 147,
        top: -10,
        width: 22,
        height: 22
    }
});

const txt_name = css.txt_name;
const avatar = css.avatar;
const icon_pencil = css.icon_pencil;
const centralizaView = css.centralizaView;
const pencil = css.pencil;

var REF_COLECAO_USER = 'usuarios';
var REF_COLECAO = 'colecoes';
var SIZE_ICONE = 25;
var COR_ICONE = colors.white;
var TEXT_SUBHEADER = "subheader";

export const MeuPerfil = ({ navigation }) => {

    const { usuario } = useContext(UserContext);
    const { _RequestMinhasListas, _RequestUsuariosQueEstouSeguindo, usuariosQueSigo, dataMinhasListas } = useContext(FirebaseContext);
    const [dadosDePerfilDoUser, setDadosDePerfilDoUser] = useState(null);
    const [listaDeColecoesDoUsuario, setListaDeColecoesDoUsuario] = useState(null);
    const [indexEscolhido, setIndexEscolhido] = useState(0);
    const [imageSelected, setImageSelected] = useState(null);
    const [PedidosRequest, setPedidosRequested] = useState(null);
    const [usersFollowing, setUsersFollowing] = useState([]);
    const [ICONE_PENCIL, SET_ICONE_PENCIL] = useState('camera-outline');
    const [loading, setLoading] = useState(false);
    const [reloader, setReloader] = useState(false);
    const [minhaListaDeSeguidores, setMinhaListaDeSeguidores] = useState(null);
    const [qntdUsersFollows, setQntdUsersFollows] = useState(null);
    const [qntDeSeguidoresPerfil, setQntDeSeguidoresPerfil] = useState(null);

    const [refshing, setRefshing] = useState(false);

    const ativaRefshing = () => setRefshing(true);
    const desativaRefshing = () => setRefshing(false);
    const ativeLoading = () => setLoading(true);
    const desativeLoading = () => setLoading(false);

    const [nomeBotaoAceitar, setNomeBotaoAceitar] = useState('Aceitar');
    const [botaoSeguirDeVolta, setBotaoSeguirDeVolta] = useState('Seguir');

    var UserId = usuario?.uid;
    var IdUsersFollowing = [];

    const onRefresh = () => {
        if(usersFollowing !== undefined){
            if (usersFollowing.length === 1) return usersFollowing.length = 0;
        }
        setMinhaListaDeSeguidores(null);
        ativaRefshing();
        setPedidosRequested(null);
        _RequestDataDoUsuario();
        _RequestMinhasListas(UserId);
        _RequestPedidosParaSeguir(UserId);
        _RequestUsuariosQueEstouSeguindo(UserId);
        recuperaDadosDosSeguidores();
        requestSeguidores();
    };

    useEffect(() => { onRefresh(); }, []);

    useEffect(() => {
        if (imageSelected !== null) return SET_ICONE_PENCIL('checkmark-outline');
        if (imageSelected === null) return SET_ICONE_PENCIL('camera-outline');
    }, [imageSelected]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageSelected(result.uri);
        }
    }

    const _DeterminaFlatlistResult = (index) => {
        switch (index) {
            case 0:
                return listaDeColecoesDoUsuario;
            case 1:
                return PedidosRequest;
        }
    };

    const _RequestDataDoUsuario = () => {
        var refDataUser = db.collection(REF_COLECAO_USER).doc(usuario.uid);
        refDataUser.get().then((doc) => {
            if (doc.exists) {
                setDadosDePerfilDoUser(doc.data());
            } else {
            }
        }).catch((error) => {
        });
    };

    useEffect(() => {
        setListaDeColecoesDoUsuario(dataMinhasListas);
        setUsersFollowing(usuariosQueSigo);
        setQntdUsersFollows(minhaListaDeSeguidores);
        desativaRefshing();
    }, [dataMinhasListas, usuariosQueSigo, minhaListaDeSeguidores]);

    useEffect(() => {
        _RequestDataDoUsuario();
    }, [imageSelected]);

    const requestSeguidores = async () => {
        db.collection('usuarios').where('user_id', '==', UserId).onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setQntDeSeguidoresPerfil(doc.data());
            });
        });
    };

    const _RequestPedidosParaSeguir = () => {
        db.collection('seguindo').where('id_user_sendo_seguido', '==', UserId).where('show', '==', true)
            .orderBy('data_criacao', "desc").onSnapshot((querySnapshot) => {
                let pedidosRequested = [];
                querySnapshot.forEach((doc) => {
                    pedidosRequested.push({ ...doc.data(), id: doc.id });
                    setPedidosRequested(pedidosRequested);
                });
            });
    };

    const recuperaDadosDosSeguidores = async () => {
        setMinhaListaDeSeguidores(null);

        await db.collection('seguidores').where('id_user', '==', UserId)
            .orderBy("data_criacao", "desc").onSnapshot((querySnapshot) => {
                var listaDeSeguidores = [];

                querySnapshot.forEach((doc) => {
                    listaDeSeguidores.push(doc.data());
                    setMinhaListaDeSeguidores(listaDeSeguidores);
                    desativaRefshing();
                });
            });
    };

    const handlerAbreScreenDetalhes = (data) => {
        //navigation.navigate(DETALHES_ITEM_COLECAO, { DataListaDeColecoes: data }); 
    };

    //FUNÇÃO QUE SALVA IMAGEM DE AVATAR NO FIRESTORE E ATUALIZA O AVATAR DO PERFIL NAS COLEÇÕES
    const salvaImagemNoDb = async () => {
        ativeLoading();
        const ref_user = db.collection("usuarios").doc(usuario.uid);

        const img = await fetch(imageSelected);
        const bytes = await img.blob();
        const caminho = 'avatarUsuario/' + `${usuario.uid}.png`;
        const storageRef = ref(storage, caminho);

        uploadBytes(storageRef, bytes).then(() => {
            getDownloadURL(storageRef).then(async (url) => {
                ref_user.update({
                    user_foto_avatar: url
                }).then(() => {
                    db.collection('colecoes').where('idUser', '==', usuario.uid).get().then(async (snapshots) => {
                        const updatesDadosPerfilNasColecoes = [];
                        snapshots.forEach((doc) =>
                            updatesDadosPerfilNasColecoes.push(doc.ref.update({
                                AvatarPerfil: url
                            }))
                        )
                        await Promise.all(updatesDadosPerfilNasColecoes);
                    });
                    desativeLoading();
                    setImageSelected(null);
                });
            });
        });
    }

    //FUNCAO QUE ACEITA PEDIDO DE AMIZADA E FAZ O UPDATE NO FIRESTORE
    const aceitaPedidoDeAmizade = async (DataPedido) => {
        setMinhaListaDeSeguidores(null);
        onRefresh();
        await updateFirestore(DataPedido);
    }

    usersFollowing?.map((item) => {
        //const result = IdUsersFollowing.includes(item.id_user_sendo_seguido); 
        IdUsersFollowing.push(item.id_user_sendo_seguido);
    });

    //FUNÇÃO SEGUE USUARIO 
    const handlerSegueUsuario = (data) => {

        const { id_user_seguidor, nome_user_seguidor } = data;
        const { user_name, user_foto_avatar } = dadosDePerfilDoUser;
        const SegueUsuario = seguindo(UserId, id_user_seguidor, nome_user_seguidor, false, user_name, user_foto_avatar, true);
        const ref_seguidor = doc(collection(db, "seguindo"));
        return setDoc(ref_seguidor, SegueUsuario).then(() => {
            onRefresh();
        });
    };

    //FUNÇÃO DEIXA DE SEGUIR USUARIO 
    const handlerUnfollowUsuario = async (data) => {
        var idUserSeguidor = data?.id_user_seguidor;
        console.log('PASSOU AQUI E DELETOU')
        return db.collection('seguindo').where('id_user_sendo_seguido', '==', idUserSeguidor).where('id_user_seguidor', '==', UserId)
            .orderBy('data_criacao', "desc").onSnapshot((querySnapshot) => {
                let pedidosRequested = {};
                querySnapshot.forEach((doc) => {
                    pedidosRequested = ({ ...doc.data(), id: doc.id });
                });
                if (!!pedidosRequested) {
                    const refSeguindo = db.collection("seguindo").doc(pedidosRequested?.id);
                    refSeguindo.delete().then(() => {
                        onRefresh();
                        if (usersFollowing.length === 1) return usersFollowing.length = 0;
                    });
                }
            });


    };


    const updateFirestore = (pedido) => {
        const idSeguindo = pedido?.id;
        const requisicao_aceita = pedido?.requisicao_aceita;
        const refSeguindo = db.collection("seguindo").doc(idSeguindo);
        refSeguindo.update({
            requisicao_aceita: requisicao_aceita ? false : true
        }).then(() => {
            if (!requisicao_aceita) {
                return criaListaDeSeguidores(pedido);
            } else {
                return excluiListaDeSeguidores(pedido);
            }
        });
    };

    const criaListaDeSeguidores = async (pedido) => {
        setMinhaListaDeSeguidores(null);
        const idPedido = pedido?.id;
        const id_user_seguidor = pedido?.id_user_seguidor;
        const nome_user_seguidor = pedido?.nome_user_seguidor;
        const novoSeguidor = seguidores(UserId, id_user_seguidor, nome_user_seguidor);
        await db.collection('seguidores').doc(idPedido).set(novoSeguidor).then(async () => {
            addContagemDeSeguidoresNoPerfilDoUser();
            await _RequestPedidosParaSeguir(UserId);
            setReloader(reloader ? false : true);
            onRefresh();
        });
    };

    const excluiListaDeSeguidores = async (seguidores) => {
        setMinhaListaDeSeguidores(null);
        const idPedido = seguidores?.id;
        const refSeguidores = db.collection("seguidores").doc(idPedido);
        await refSeguidores.delete().then(async () => {
            removeContagemDeSeguidoresNoPerfilDoUser();
            await _RequestPedidosParaSeguir(UserId);
            onRefresh();
        });
    };

    const addContagemDeSeguidoresNoPerfilDoUser = async () => {
        await recuperaDadosDosSeguidores();
        const ref_user = db.collection("usuarios").doc(UserId);
        if (minhaListaDeSeguidores?.length === undefined) {
            return ref_user.update({
                seguidores: 1
            }).then(() => {
                desativaRefshing();
            });
        }
        if (minhaListaDeSeguidores?.length > 0) {
            var valor = 1 + minhaListaDeSeguidores?.length;
            return ref_user.update({
                seguidores: valor
            }).then(() => {
                desativaRefshing();
            });
        };
    };

    const removeContagemDeSeguidoresNoPerfilDoUser = async () => {
        await recuperaDadosDosSeguidores();
        const ref_user = db.collection("usuarios").doc(UserId);
        if (minhaListaDeSeguidores?.length === 0) {
            return ref_user.update({
                seguidores: 0
            }).then(() => {
                desativaRefshing();
            });
        }
        if (minhaListaDeSeguidores?.length >= 1) {
            var valor = minhaListaDeSeguidores?.length - 1
            return ref_user.update({
                seguidores: valor
            }).then(() => {
                desativaRefshing();
            });
        };
    };

    const excluiRequestFollow = async (req) => {

        const idRequest = req?.id;
        const refSeguindo = db.collection("seguindo").doc(idRequest);
        await refSeguindo.delete().then(() => {
            setReloader(true);
        });
    };

    return (
        <BackgroundSemAVoiding>
            {refshing ?
                <View style={{ height: '100%', width: '100%' }}>
                    <Loading />
                </View>
                :
                <MinhasListas
                    listaDeColecoesDoUsuario={_DeterminaFlatlistResult(indexEscolhido)}
                    qntdLista={listaDeColecoesDoUsuario}
                    minhaListaDeSeguidores={qntdUsersFollows}
                    qntDeSeguidoresPerfil={qntDeSeguidoresPerfil}
                    indexEscolhido={indexEscolhido}
                    handlerAbreScreenDetalhes={handlerAbreScreenDetalhes}
                    dadosUsuario={dadosDePerfilDoUser}
                    pickImage={pickImage}
                    imageSelected={imageSelected}
                    ICONE_PENCIL={ICONE_PENCIL}
                    salvaImagemNoDb={salvaImagemNoDb}
                    loading={loading}
                    setIndexEscolhido={setIndexEscolhido}
                    aceitaPedidoDeAmizade={aceitaPedidoDeAmizade}
                    nomeBotaoAceitar={nomeBotaoAceitar}
                    botaoSeguirDeVolta={botaoSeguirDeVolta}
                    handlerSegueUsuario={handlerSegueUsuario}
                    handlerUnfollowUsuario={handlerUnfollowUsuario}
                    IdUsersFollowing={IdUsersFollowing}
                    excluiRequestFollow={excluiRequestFollow}
                    onRefresh={onRefresh}
                    refshing={refshing}
                />
            }
        </BackgroundSemAVoiding>
    );
}

const listItemCategorias = [
    {
        id: 1,
        nome: 'MINHAS LISTAS'
    },
    {
        id: 2,
        nome: 'PEDIDOS DE AMIZADE'
    },
    {
        id: 3,
        nome: 'LISTAS ATUALIZADAS'
    },
    {
        id: 4,
        nome: 'GUARDADO'
    },
];

const HeaderBody = ({ dadosUsuario, pickImage, imageSelected, ICONE_PENCIL, salvaImagemNoDb, loading, qntdLista, minhaListaDeSeguidores, qntDeSeguidoresPerfil }) => {
    const nome = dadosUsuario?.user_name;
    const avatar_perfil = dadosUsuario?.user_foto_avatar;
    const QntdLista = qntdLista?.length;
    const MinhaListaDeSeguidores = qntDeSeguidoresPerfil?.seguidores;

    const verificaQntdDeLista = (lista) => {
        if (lista === 0 || undefined) return null;
        if (lista === 1) return 'lista';
        if (lista > 1) return 'listas';
    }

    const verificaQntdDeSeguidores = (seguidores) => {
        if (seguidores === 0 || undefined) return null;
        if (seguidores === 1) return 'seguidor';
        if (seguidores > 1) return 'seguidores';
    }

    return (
        <AnimatedView>
            <Image
                style={avatar}
                source={{ uri: imageSelected === null ? avatar_perfil : imageSelected }} />
            {loading ?
                <Loading />
                :
                <Icone
                    style={icon_pencil}
                    nameIcone={ICONE_PENCIL}
                    tamanhoIcon={SIZE_ICONE}
                    corIcone={COR_ICONE}
                    onPress={() => { imageSelected === null ? pickImage() : salvaImagemNoDb() }}
                />
            }
            <View style={centralizaView}>
                <Text
                    style={txt_name}
                    numberOfLines={1}
                    type={TEXT_SUBHEADER}>{nome}</Text>
                <Text style={{ marginBottom: 20 }}>{!!MinhaListaDeSeguidores ? MinhaListaDeSeguidores : 'Nenhum seguidor'} {verificaQntdDeSeguidores(MinhaListaDeSeguidores)} . {!!QntdLista ? QntdLista : 'Nenhuma lista'} {verificaQntdDeLista(QntdLista)}</Text>
            </View>
        </AnimatedView>
    )
};

const Body = ({ indexEscolhido, setIndexEscolhido, listaDeColecoesDoUsuario }) => {

    const verificaQntdDeItensNaLista = (lista) => {
        if (lista === 0) return null;
        if (lista === 1) return 'Pedido de amizade';
        if (lista > 1) return 'Pedidos de amizades';
    };

    const flatList = useRef();

    return (
        <AnimatedView>
            <FlatList
                ref={flatList}
                initialScrollIndex={indexEscolhido}
                onScrollToIndexFailed={info => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatList.current?.scrollToIndex({ index: info.index, animated: true });
                    })
                }}
                horizontal
                data={listItemCategorias}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => <CardCategorias
                    data={item}
                    index={index}
                    indexEscolhido={indexEscolhido}
                    setIndexEscolhido={setIndexEscolhido} />}
            />
            {indexEscolhido === 1 ?
                <Text
                    style={{ paddingLeft: 20, marginTop: 20 }}>
                    {listaDeColecoesDoUsuario?.length} {verificaQntdDeItensNaLista(listaDeColecoesDoUsuario?.length)}</Text>
                : null}
        </AnimatedView>
    )
};

const MinhasListas = ({
    qntdLista,
    minhaListaDeSeguidores,
    listaDeColecoesDoUsuario,
    handlerAbreScreenDetalhes,
    dadosUsuario,
    pickImage,
    imageSelected,
    ICONE_PENCIL,
    salvaImagemNoDb,
    loading,
    indexEscolhido,
    setIndexEscolhido,
    aceitaPedidoDeAmizade,
    nomeBotaoAceitar,
    botaoSeguirDeVolta,
    handlerSegueUsuario,
    handlerUnfollowUsuario,
    IdUsersFollowing,
    excluiRequestFollow,
    onRefresh,
    refshing,
    qntDeSeguidoresPerfil
}) => {

    return (
        <AnimatedView>
            <FlatList
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refshing}
                    />
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => {
                    return (
                        <>
                            <Header />
                            <HeaderBody
                                dadosUsuario={dadosUsuario}
                                pickImage={pickImage}
                                imageSelected={imageSelected}
                                ICONE_PENCIL={ICONE_PENCIL}
                                salvaImagemNoDb={salvaImagemNoDb}
                                loading={loading}
                                qntdLista={qntdLista}
                                minhaListaDeSeguidores={minhaListaDeSeguidores}
                                qntDeSeguidoresPerfil={qntDeSeguidoresPerfil}
                            />
                            <Body
                                indexEscolhido={indexEscolhido}
                                setIndexEscolhido={setIndexEscolhido}
                                listaDeColecoesDoUsuario={listaDeColecoesDoUsuario}
                            />
                        </>
                    )
                }
                }
                data={listaDeColecoesDoUsuario}
                renderItem={({ item }) => {
                    if (indexEscolhido === 0) {
                        return (
                            <CardListasNoPerfil
                                listaDeColecoesDoUsuario={item}
                                handlerAbreScreenDetalhes={handlerAbreScreenDetalhes} />
                        )
                    } else if (indexEscolhido === 1) {
                        return (
                            <>
                                <CardPedidosRequested
                                    aceitaPedidoDeAmizade={aceitaPedidoDeAmizade}
                                    PedidosRequested={item}
                                    handlerAbreScreenDetalhes={handlerAbreScreenDetalhes}
                                    nomeBotaoAceitar={nomeBotaoAceitar}
                                    botaoSeguirDeVolta={botaoSeguirDeVolta}
                                    handlerSegueUsuario={handlerSegueUsuario}
                                    handlerUnfollowUsuario={handlerUnfollowUsuario}
                                    IdUsersFollowing={IdUsersFollowing}
                                    excluiRequestFollow={excluiRequestFollow}
                                />
                            </>
                        )
                    }

                }} />
        </AnimatedView>
    )
};

