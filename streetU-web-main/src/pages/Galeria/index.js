import { Box, Image, SimpleGrid } from '@chakra-ui/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Close } from 'react-ionicons';
import { useNavigate } from 'react-router-dom';
import Alerta from '../../components/Alerta';
import { UserContext } from '../../context/UserContext';
import { db } from '../../util/Firebase';
import './styledGaleria.css';

export default function Galeria() {

  const navigation = useNavigate();
  const [msgAtv, setMsgAtv] = useState(false);
  const [imagensGaleria, setImagensGaleria] = useState([]);
  const { imagemUrl, listenerCadastro, setImagemUrl, setTitle, setDesc, usuario } = useContext(UserContext);

  useEffect(() => {
    if (listenerCadastro) {
      setMsgAtv(true);
    }
  }, [listenerCadastro]);

  useEffect(() => {
    if (msgAtv) {
      setTimeout(() => {
        setMsgAtv(false);
      }, 4000);
    }
  }, [msgAtv]);

  useEffect(() => {
    recuperaAsImagensDaGaleria();
  }, []);

  const recuperaAsImagensDaGaleria = async () => {
    const q = query(collection(db, "galeria"), where('idLojaOrigem', '==', usuario.uid));
    await onSnapshot(q, (querySnapshot) => {
      const listaDeImagens = [];
      querySnapshot.forEach((doc)=>{
        listaDeImagens.push(doc.data());
      });
      setImagensGaleria(listaDeImagens);
    })
  };

  const container = {
    width: '100%',
    height: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  };

  const goBack = () => {
    setImagemUrl(null);
    setTitle('');
    setDesc('');
    setMsgAtv(false);
    navigation('/Home');
  }
  console.log(imagensGaleria)

  return (
    <div>
      <div className='BG'>
        <Header
          handlerNextTela={''}
          handlerGoBack={goBack} />
        <div style={container}>
          {msgAtv && (
            <>
              {
                listenerCadastro.sucess === true ?
                  <Alerta
                    typeAlert={'success'}
                    titleDesc={'Imagem salva na galeria com sucesso!'}
                  />
                  :
                  <Alerta
                    typeAlert={'error'}
                    titleDesc={'Houve algum problema!'}
                  />
              }
            </>
          )}
          <SimpleGrid style={{ alignSelf: 'center', marginTop: 20, margin: 15 }} spacing={5} columns={3}>
            {imagensGaleria?.map((item) => {
              return (
                <button>
                  <Box width={'111px'} height={'160px'} >
                    <Image
                      objectFit={'cover'}
                      src={item.uri} style={{ height: '100%', width: '100%', borderRadius: 10 }} />
                  </Box>
                </button>
              )
            })}
          </SimpleGrid>
        </div>
      </div>
    </div>
  );
}
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