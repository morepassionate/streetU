import React from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Icone({ nameIcone, tamanhoIcon, corIcone, ...rest }) {
    return (
        <Ionicons name={nameIcone} size={tamanhoIcon} color={corIcone} {...rest} />
    )
}