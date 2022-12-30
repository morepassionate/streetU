import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { db } from '../util/Firebase';

export const FirebaseContext = createContext({});

var REF_COLECAO_USER = 'usuarios';

export const FirebaseProvider = ({ children }) => {

    const [dataColecao, setDataColecao] = useState();
    const [dataMinhasListas, setDataMinhasListas] = useState();
    const [dadosDePerfilDoUser, setDadosDePerfilDoUser] = useState();
    const [usuariosQueSigo, setUsuariosQueSigo] = useState();
    const [pedidosRequested, setPedidosRequested] = useState();
    const [indexImagemSelected, setIndexImagemSelected] = useState(0);

    const _RequestTodasAsColecoes = () => {
        db.collection('colecoes').where('visivel', '==', true)
            .orderBy("DataCriacaoColecao", "asc").onSnapshot((querySnapshot) => {
                let ListaColecoes = [];
                querySnapshot.forEach((doc) => {
                    ListaColecoes.push({ ...doc.data(), id: doc.id });
                    setDataColecao(ListaColecoes);
                });
            });
    };

    const _RequestMinhasListas = (UserUid) => {
        db.collection('colecoes').where('idUser', '==', UserUid)
            .orderBy("DataCriacaoColecao", "desc").onSnapshot((querySnapshot) => {
                let MinhasListas = [];
                querySnapshot.forEach((doc) => {
                    MinhasListas.push({ ...doc.data(), id: doc.id });
                    setDataMinhasListas(MinhasListas);
                });
            });
    };

    const _RequestDataDoUsuario = (UserUid) => {
        var refDataUser = db.collection(REF_COLECAO_USER).doc(UserUid);
        refDataUser.onSnapshot((doc) => {
            if (doc.exists) return setDadosDePerfilDoUser(doc.data());
        });
    };

    const _RequestUsuariosQueEstouSeguindo = (UserUid) => {
        db.collection('seguindo').where('id_user_seguidor', '==', UserUid)
            .orderBy('data_criacao', "desc").onSnapshot((querySnapshot) => {
                let usersQueSigo = [];
                querySnapshot.forEach((doc) => {
                    usersQueSigo.push({ ...doc.data(), id: doc.id });
                    setUsuariosQueSigo(usersQueSigo);
                });
            });
    };

    const _RequestPedidosParaSeguir = (UserUid) => {
        db.collection('seguindo').where('id_user_sendo_seguido', '==', UserUid).where('show', '==', true)
            .orderBy('data_criacao', "desc").onSnapshot((querySnapshot) => {
                let pedidosRequested = [];
                querySnapshot.forEach((doc) => {
                    pedidosRequested.push({ ...doc.data(), id: doc.id });
                    setPedidosRequested(pedidosRequested);
                });
            });
    };

    const GetIndexImagemSelecionada = (indexImg) => {
        setIndexImagemSelected(indexImg)
    };

    const clearState = () => {
        setDataMinhasListas(null);
    };

    const clearStateProfile = () => {
        setDadosDePerfilDoUser(null);
    };

    return (
        <FirebaseContext.Provider value={{
            _RequestUsuariosQueEstouSeguindo,
            _RequestTodasAsColecoes,
            _RequestDataDoUsuario,
            _RequestMinhasListas,
            _RequestPedidosParaSeguir,
            dadosDePerfilDoUser,
            dataMinhasListas,
            usuariosQueSigo,
            dataColecao,
            pedidosRequested,
            setDataMinhasListas,
            GetIndexImagemSelecionada,
            indexImagemSelected,
            clearState,
            clearStateProfile
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}