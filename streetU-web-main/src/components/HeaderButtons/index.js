import { Box } from '@chakra-ui/react';
import React from 'react'; 
import { Close, ChevronForwardOutline } from 'react-ionicons';
import './style.css';

export const HeaderButtons = () => {
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

            <Close color={'white'} />
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '';
                }}>
                <ChevronForwardOutline color={'white'} />
            </button>
        </Box>
    )
}