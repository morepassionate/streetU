import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

export default function BoxResponsivo({ children }) {
    return (
        <Box
            w={['full', 'xl']}
            mt={[0, '5vh']}
            p={5}
            mx='auto'
            alignItems={'center'}
        >
            <VStack
                spacing={4}
                align='flex-start'
                w='full'>
            {children}

            </VStack>

        </Box>
    );
}