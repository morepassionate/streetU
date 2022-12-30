import React, { useContext } from 'react';
import { View } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { Main } from '../navigation/Main';
import { StackApp } from '../navigation/StackApp';

export const Rota = () => {
    const { usuario } = useContext(UserContext);

    return (
        usuario ? <StackApp /> : <Main />
    )
}