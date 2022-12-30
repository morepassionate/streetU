import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { ActivityIndicator } from 'react-native-paper';
import colors from '../constants/colors';

const css = StyleSheet.create({
    SpaceTop: {
        marginTop: 10,
        marginBottom: 10
    }
});

const SpaceTop = css.SpaceTop;

export const Loading = ({ TxtLoading }) => {
    return (
        <View style={SpaceTop}>
            <ActivityIndicator size='small' animating={true} color={colors.white} />
            <Text>{TxtLoading}</Text>
        </View>
    )
}