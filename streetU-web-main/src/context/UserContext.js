import React, { createContext, useEffect, useState } from 'react';
import { auth, db, storage } from '../util/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePhoneNumber, updateCurrentUser, updateProfile } from 'firebase/auth';
import { collection, doc, setDoc, getFirestore, arrayUnion } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const UserContext = createContext({});

export default function UserProvider({ children }) {

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listenerLogar, setListenerLogar] = useState(null);
  const [listenerCadastro, setListenerCadastro] = useState(null);

  const [imagemUrl, setImagemUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dadosAtualizadosDoPerfil, setDadosAtualizadosDoPerfil] = useState(null);

  const getImageUrl = (url, title, desc) => {
    setImagemUrl(url);
    setTitle(title);
    setDesc(desc);
  }

  async function updateUser(nome) {
    return updateProfile(auth.currentUser, { displayName: nome });
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
  };

  const entrarLogin = async (email, senha) => {
    setLoading(true)
    await auth.signInWithEmailAndPassword(email, senha).then(async ({ user }) => {
      setLoading(false);
      setUsuario(user);
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
  };

  const saveImagemInFirebase = async (imageSelected, logoLoja, nomeLojaOrigem) => {
    const ref_user = doc(collection(db, "galeria"));
    const img = await fetch(imageSelected);
    const bytes = await img.blob();
    const caminho = 'fotoGaleria/' + `${ref_user.id}.png`;
    const storageRef = ref(storage, caminho);

    uploadBytes(storageRef, bytes).then(() => {
      getDownloadURL(storageRef).then(async (url) => {
        const novaImg = {
          idLojaOrigem: usuario.uid,
          uri: url,
          idFoto: ref_user.id,
          title: title,
          descricaoFoto: desc,
          LogoLojaOrigem: logoLoja,
          LojaOrigem: nomeLojaOrigem,
        };
        await setDoc(ref_user, novaImg).then(async () => {
          setLoading(false);
          return setListenerCadastro({
            sucess: true,
            msg: null
          });
        }).catch(err => {
          setLoading(false);
          return setListenerCadastro({
            sucess: false,
            msg: 'Erro ao salvar a sua imagem!'
          });
        })
      });
    });
  };

  return (
    <UserContext.Provider value={{
      user: !!usuario, usuario, entrarLogin, criarConta, listenerCadastro, listenerLogar, loading,
      getImageUrl, imagemUrl, setImagemUrl, setTitle, setDesc, saveImagemInFirebase,
      dadosAtualizadosDoPerfil, setDadosAtualizadosDoPerfil
    }}>
      {children}
    </UserContext.Provider>
  );
}