import { Box, Container, Image, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { ChevronForwardOutline, Close } from 'react-ionicons';
import { useNavigate } from 'react-router-dom';
import BoxResponsivo from '../../components/BoxResponsivo';
import { UserContext } from '../../context/UserContext';
import { db } from '../../util/Firebase';
import './style.css';

export default function SaveImage() {
  const navigation = useNavigate();
  const { imagemUrl, saveImagemInFirebase, listenerCadastro, usuario, dadosAtualizadosDoPerfil } = useContext(UserContext);
  const [lista, setDataMinhasListas] = useState([]);

  const ContainerHeaderContent = {
    display: 'flex',
    height: 170,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
  };
  const CardList = {
    width: 160,
    height: 150,
    borderWidth: 3,
    marginBottom: 30,
    alignSelf: 'center',
    borderColor: 'white',
    justifyContent: 'center',
    borderRadius: 10
  };
  const Boxing = {
    height: 180,
    width: 160,
    flexDirection: 'column',
  };
  const container = {
    width: '100%',
    height: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: 10
  };
  const ContainerText = {
    display: 'flex',
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: 80,
    position: 'relative'
  };

  useEffect(() => {
    recuperaMinhaListas();
  }, []);

  const handlerGoBack = () => navigation('/addImage');
  const goCreateList = () => navigation('/createList');
  const goGaleria = () => navigation('/galeria');
  const handlerNextTela = () => { };

  const saveImgInGaleria = () => {
    goGaleria();
    saveImagemInFirebase(imagemUrl, dadosAtualizadosDoPerfil?.user_foto_avatar, dadosAtualizadosDoPerfil?.user_name);
  }

  const recuperaMinhaListas = async () => {
    db.collection('colecoes')
      .where('idUser', '==', usuario.uid)
      .orderBy("DataCriacaoColecao", "desc")
      .onSnapshot((querySnapshot) => {
        let MinhasListas = [];
        querySnapshot.forEach((doc) => {
          MinhasListas.push({ ...doc.data(), id: doc.id });
          setDataMinhasListas(MinhasListas);
        });
      });
  }

  return (
    <div>
      <Header
        handlerNextTela={handlerNextTela}
        handlerGoBack={handlerGoBack} />
      <div className='BG'>
        <div style={container}>
          <div style={ContainerHeaderContent}>
            <div style={Boxing}>
              <button
                onClick={() => saveImgInGaleria()}
                style={CardList}>
                <img style={{ marginLeft: 15 }} src={require('../../assets/galeria.png')} />
              </button>
              <Text fontSize={'15px'} color={'white'} mt={'-5'} >Galeria</Text>
            </div>
            <div style={{ width: 20 }} />
            <div style={Boxing}>
              <button
                onClick={() => goCreateList()}
                style={CardList}>
                <Text mt={'-20px'} fontSize={'80px'} color={'white'}>+</Text>
              </button>
              <Text fontSize={'15px'} color={'white'} mt={'-5'}>Nova lista</Text>
            </div>
          </div>
          <div style={{
            alignItems: 'center',
            alignSelf: 'center',
            width: 350,
            marginTop: 30,
          }}>
            <text style={{ color: 'white', fontSize: 18 }}>LISTAS</text>
            <div style={{ height: 1, width: '100%', backgroundColor: 'white', marginBottom: 15 }} />
            <div >
              <SimpleGrid spacing={5} columns={2}>
                {lista.map((item) => {
                  return (
                    <button>
                      <Box height={'150px'} >
                        <Image objectFit={'cover'} src={item.AvatarPerfil} style={{ height: '120px', width: '100%', borderRadius: 10 }} />
                        <Text style={{ textAlign: 'left', marginLeft: 5, fontSize: 13, marginTop: 5 }} fontSize={'10px'} color={'white'}>{item.TitleLista}</Text>
                      </Box>
                    </button>
                  )
                })}
              </SimpleGrid>
            </div>
          </div>
        </div>
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
    </Box>
  )
}