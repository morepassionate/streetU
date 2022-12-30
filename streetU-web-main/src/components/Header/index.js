import { Box, Container, Image, Text } from '@chakra-ui/react';
import React from 'react';

export default function Header({ dadosPerfil }) {
  const imgPerfil = dadosPerfil?.user_foto_avatar;
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

      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <Text fontSize={'30'} fontWeight={'semibold'} color={'white'}>Street</Text>
        <Text fontSize={'33'} fontWeight={'semibold'} color={'red'}>U</Text>

      </Box>
      <Image
        src={imgPerfil}
        objectFit={'cover'}
        borderRadius={40}
        boxSize={'40px'} />
    </Box>
  );
}