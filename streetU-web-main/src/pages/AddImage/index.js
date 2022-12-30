import React, { useRef } from 'react';
import { Box, Container, Image, Input, Text } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react'
import BoxResponsivo from '../../components/BoxResponsivo';
import './style.css';
import { PretoInput } from '../../variables/colors';
import { useState } from 'react';
import { Close, ChevronForwardOutline } from 'react-ionicons';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alerta';
import Alerta from '../../components/Alerta';
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

export default function AddImage() {

  const navigation = useNavigate();
  const [titleImg, setTitleImg] = useState(null);
  const [descImg, setDescImg] = useState(null);
  const [linkImg, setLinkImg] = useState('https://stackoverflow.com/questions/41080481/in-reactjs-how-to-invoke-link-click-via-button-press');
  const [fotoAdd, setFotoAdd] = useState(null);
  const [errorImgEmpty, setErrorImgEmpty] = useState(false);
  const hiddenFileInput = useRef(null);
  const { getImageUrl } = useContext(UserContext);


  const percebeClick = () => {
    hiddenFileInput.current.click()
  };

  const handlerChooseImage = (event) => {
    var file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFotoAdd(reader.result)
      }
    }
    reader.readAsDataURL(file);
  };

  const handlerGoBack = () => navigation('/Home');

  const handlerNextTela = () => {
    if (!!fotoAdd) {
      navigation('/SaveImage');
      getImageUrl(fotoAdd, titleImg, descImg);
    } else {
      setErrorImgEmpty(true)
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorImgEmpty(false)
    }, 5000);

    return clearTimeout();
  }, [errorImgEmpty]);

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
        <BoxResponsivo>
          {fotoAdd ?
            <Image objectFit={'cover'} onClick={() => percebeClick()} src={fotoAdd} className='IMGBUTTONBORDERLESS' />
            :
            <button
              onClick={() => percebeClick()}
              className='IMGBUTTON'>
              <Text mt={'-20px'} fontSize={'80px'} color={'white'}>+</Text>
            </button>
          }

          <input type="file" ref={hiddenFileInput} onChange={handlerChooseImage} style={{ display: 'none' }} />
          <Text fontWeight={'semibold'} color={'white'} mb='8px'>TÍTULO</Text>
          <Input
            variant="filled"
            backgroundColor={PretoInput}
            placeholder='Dê um título à foto'
            color={'white'}
            type='default'
            value={titleImg}
            onChange={e => setTitleImg(e.target.value)}
          />
          <Text mt={'5'} fontWeight={'semibold'} color={'white'} mb='8px'>DESCRIÇÃO</Text>
          <Textarea
            backgroundColor={PretoInput}
            variant="filled"
            color={'white'}
            value={descImg}
            onChange={e => setDescImg(e.target.value)}
            placeholder='Fale mais sobre a foto'
            size='sm'
          />
        </BoxResponsivo>
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
}