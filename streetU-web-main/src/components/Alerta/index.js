import React from 'react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';

export default function Alerta({ typeAlert, titleDesc }) {
    return (
        <Alert status={typeAlert}>
            <AlertIcon /> 
            <AlertDescription>{titleDesc}</AlertDescription>
        </Alert>
    );
}