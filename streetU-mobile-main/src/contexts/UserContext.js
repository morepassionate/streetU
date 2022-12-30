import React, { createContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { auth, db, storage } from '../util/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePhoneNumber, updateCurrentUser, updateProfile } from 'firebase/auth';
import { collection, doc, setDoc, getFirestore } from 'firebase/firestore';
import { novoUser } from '../objetos/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listenerLogar, setListenerLogar] = useState(null);
    const [listenerCadastro, setListenerCadastro] = useState(null);

    useEffect(() => {
        const getDataInCache = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@user_data')
                jsonValue != null ? JSON.parse(jsonValue) : null;
                return setUsuario(JSON.parse(jsonValue));
            } catch (e) {
                console.log(e);
            }
        }
        getDataInCache();
    }, []);

    async function updateUser(nome) {
        return updateProfile(auth.currentUser, { displayName: nome });
    }

    const cleanCache = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    const saveDataInCache = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@user_data', jsonValue)
        } catch (e) {
            console.log(e);
        }
    }

    const criarConta = async (nome, email, senha, novoUsuario, imageSelected) => {
        setLoading(true);
        await auth.createUserWithEmailAndPassword(email, senha).then(async ({ user }) => {
            Object.assign(novoUsuario, { user_id: user.uid });
            const ref_user = db.collection("usuarios").doc(user.uid);

            await db.collection('usuarios').
                doc(user.uid).set(novoUsuario).then(() => {
                    return updateUser(nome).then(async () => {

                        const img = await fetch(imageSelected);
                        const bytes = await img.blob();
                        const caminho = 'avatarUsuario/' + `${user.uid}.png`;
                        const storageRef = ref(storage, caminho);

                        uploadBytes(storageRef, bytes).then(() => {
                            getDownloadURL(storageRef).then(async (url) => {
                                ref_user.update({
                                    user_foto_avatar: url
                                }).then(async () => {
                                    await user.reload();
                                    setLoading(false);
                                    setUsuario(user);
                                    return setListenerCadastro({
                                        sucess: true,
                                        msg: null
                                    });
                                }).catch(err => {
                                    setLoading(false);
                                    return setListenerCadastro({
                                        sucess: false,
                                        msg: 'Erro ao salvar a sua imagem de perfil !'
                                    });
                                })
                            });
                        });
                    });
                });

        }).catch((error) => {
            setLoading(false);

            if (error.code === 'auth/email-already-in-use') {
                return setListenerCadastro({
                    sucess: false,
                    msg: 'Já existe uma conta com esse endereço de e-mail!'
                });
            }

            if (error.code === 'auth/invalid-email') {
                return setListenerCadastro({
                    sucess: false,
                    msg: 'Digite um e-mail real. Esse e-mail que você digitou é invalido'
                });
            }

            if (error.code === 'auth/weak-password') {
                return setListenerCadastro({
                    sucess: false,
                    msg: 'Senha Fraca. Insira uma senha maior e mais segura'
                });
            }

            return setListenerCadastro({
                sucess: false,
                msg: error
            });

        });
    }

    const entrarLogin = async (email, senha) => {
        setLoading(true)
        await auth.signInWithEmailAndPassword(email, senha).then(async ({ user }) => {
            setLoading(false);
            setUsuario(user);
            saveDataInCache(user);
            return setListenerLogar({
                sucess: true,
                msg: null
            });

        }).catch((error) => {
            setLoading(false);

            if (error.code === 'auth/invalid-email') {
                return setListenerLogar({
                    sucess: false,
                    msg: 'Digite um e-mail real. Esse e-mail que você digitou é invalido'
                });
            }

            if (error.code === 'auth/user-disabled') {
                return setListenerLogar({
                    sucess: false,
                    msg: 'Usuário bloqueado. Usuário correspondente ao e-mail fornecido foi desabilitado'
                });
            }

            if (error.code === 'auth/user-not-found') {
                //nenhum usuario encontrado 
                return setListenerLogar({
                    sucess: false,
                    msg: 'Nenhum usuário encontrado'
                });
            }

            if (error.code === 'auth/wrong-password') {
                return setListenerLogar({
                    sucess: false,
                    msg: 'Senha incorreta, você inseriu a senha errada !'
                });
            }
        });
    }

    const logOut = async () => {
        cleanCache('@user_data');
        await setUsuario(null);
    }

    return (
        <UserContext.Provider value={{ usuario: !!usuario, usuario, criarConta, listenerCadastro, entrarLogin, listenerLogar, loading, logOut }}>
            {children}
        </UserContext.Provider>
    )
}