import React, { useContext, useRef } from 'react';
import { Box, Checkbox, Container, Image, Input, Text } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react'
import BoxResponsivo from '../../components/BoxResponsivo';
import { PretoInput } from '../../variables/colors';
import { useState } from 'react';
import { Close, ChevronForwardOutline } from 'react-ionicons';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alerta';
import Alerta from '../../components/Alerta';
import { useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { NovaColecao } from '../../objeto/NovaColecao';
import { db } from '../../util/Firebase';
import { Spinner } from '@chakra-ui/react';
import { collection, doc, setDoc } from 'firebase/firestore';
import Load from '../../components/Load';

export default function CreateList({route}) {

  const navigation = useNavigate();
  const [titleLista, setTitleLista] = useState(null);
  const [descLista, setDescLista] = useState(null);
  const [errorImgEmpty, setErrorImgEmpty] = useState(false);
  const [dadosDePerfilDoUser, setDadosDePerfilDoUser] = useState(null)
  const hiddenFileInput = useRef(null);
  const [isPublic, setIsPublic] = useState(false);
  const { usuario, dadosAtualizadosDoPerfil } = useContext(UserContext);
  const lojas = [];
  const listaVazia = [];
  const visivel = false;
  const UserUid = usuario?.uid;
  const fotoAdd = dadosAtualizadosDoPerfil?.user_foto_avatar;
  const [startLoading, setStartLoading] = useState(false);
  const [mostraAlerta, setMostraAlerta] = useState(false); 

  useEffect(() => {
    setTimeout(() => {
      setErrorImgEmpty(false)
    }, 5000);

    return clearTimeout();
  }, [errorImgEmpty]);

  useEffect(() => {
    _RequestDataDoUsuario();
  }, []);

  useEffect(() => {
    if (mostraAlerta) {
      setTimeout(() => {
        navigation('/SaveImage');
      }, 3000);
    }
  }, [mostraAlerta]);

  const _RequestDataDoUsuario = () => {
    var refDataUser = db.collection('usuarios').doc(UserUid);
    refDataUser.onSnapshot((doc) => {
      if (doc.exists) return setDadosDePerfilDoUser(doc.data());
    });
  };

  const stateLoading = () => setStartLoading(startLoading ? false : true);

  const mostraAlert = () => setMostraAlerta(true);

  const handlerGoBack = () => navigation('/SaveImage');

  const handlerNextTela = () => {
    SalvaNoFirestore();
    // if (!!fotoAdd) {
    //     navigation('/SaveImage');
    // } else {
    //     setErrorImgEmpty(true)
    // }
  };

  const clearState = () => {
    setTitleLista(null);
    setDescLista(null);
  }

  const SalvaNoFirestore = () => {
    stateLoading();
    const NewLista = NovaColecao(UserUid, null, fotoAdd, descLista, listaVazia, usuario.displayName, usuario.displayName, isPublic, titleLista, 0, 0, false, visivel, dadosDePerfilDoUser?.user_tipo)
    const ref_colecao = doc(collection(db, "colecoes"));
    Object.assign(NewLista, { idColecao: ref_colecao.id });
    setDoc(ref_colecao, NewLista).then(() => {
      setStartLoading(false);
      mostraAlert();
      clearState();
    });
  };

  return (
    <div>
      <Header
        handlerNextTela={handlerNextTela}
        handlerGoBack={handlerGoBack} />
      <div className='BG'>
        {errorImgEmpty ?
          <Alerta
            typeAlert={'error'}
            titleDesc={'Você precisa selecionar uma imagem !'}
          /> : null}
        {mostraAlerta && (
          <Alerta
            typeAlert={'success'}
            titleDesc={'Lista criada com sucesso !'} />
        )}
        {startLoading ?
          <BoxResponsivo>
            <Spinner alignItems={'center'} justifyContent={'center'} marginLeft={'45%'} marginTop={'30%'} color={'white'} size='lg' />
          </BoxResponsivo>
          :
          <BoxResponsivo>
            <Image objectFit={'cover'} src={fotoAdd} className='IMGBUTTONBORDERLESS' />
            <input type="file" style={{ display: 'none' }} />
            <Text fontWeight={'semibold'} color={'white'} mb='8px'>TÍTULO</Text>
            <Input
              variant="filled"
              backgroundColor={PretoInput}
              placeholder='Dê um título para sua lista'
              color={'white'}
              type='default'
              value={titleLista}
              onChange={e => setTitleLista(e.target.value)}
            />
            <Text mt={'5'} fontWeight={'semibold'} color={'white'} mb='8px'>DESCRIÇÃO</Text>
            <Textarea
              backgroundColor={PretoInput}
              variant="filled"
              color={'white'}
              value={descLista}
              onChange={e => setDescLista(e.target.value)}
              placeholder='Fale mais sobre a sua lista'
              size='sm'
            />
            <Checkbox
              color={'white'}
              colorScheme={'red'}
              alignSelf={'center'}
              isChecked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              defaultChecked>Tornar privado</Checkbox>
          </BoxResponsivo>
        }
      </div>
    </div>
  );
};
const Header = ({ handlerGoBack, handlerNextTela }) => {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      maxW={'100%'}
      h={'55'}
      pl={4}
      pr={4}
      backgroundColor={'#26292b'}>
      <button
        onClick={() => handlerGoBack()}
      >
        <Close color={'white'} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handlerNextTela();
        }}>
        <ChevronForwardOutline color={'white'} />
      </button>
    </Box>
  )
};