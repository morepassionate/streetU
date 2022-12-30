import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import colors from '../constants/colors';


export const SnackbarAlert = ({ visibleSnack, onDismissSnackBar, txtSnack }) => {
    const navigation = useNavigation();
    return (
        <Snackbar
            style={{marginBottom: '10%'}}
            visible={visibleSnack}
            onDismiss={onDismissSnackBar}
            action={{
                labelStyle: { color: colors.primary },
                label: 'Ver listas',
                onPress: () => {
                    navigation.navigate('Listas')
                }
            }}
        >
            {txtSnack}
        </Snackbar>
    );
}