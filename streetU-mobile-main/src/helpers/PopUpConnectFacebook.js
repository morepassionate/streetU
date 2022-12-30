import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Text } from '../components/Text';
import { Button } from '../components/Button';

const css = StyleSheet.create({
    BottomSheetStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
    },
    ViewInsideBottom: {
        padding: 25
    }
})

const BottomSheetStyle = [css.BottomSheetStyle];
const BackgroundBottomSheet = [{ backgroundColor: 'black' }];
const ViewInsideBottom = [css.ViewInsideBottom];
const fontWeight = [{ fontWeight: '700' }];

export const PopUpConnectFacebook = ({ title, subtitle, refBottom, titleButton, onPress, fechaModal, ...rest }) => {
    return (
        <BottomSheet
            ref={refBottom}
            backgroundStyle={BackgroundBottomSheet}
            style={BottomSheetStyle}
            enablePanDownToClose={true}
            {...rest}
        >
            <View style={ViewInsideBottom}>
                <Text style={fontWeight} type={'header'}>{title}</Text>
                <Text style={fontWeight} type={'subheader'}>{subtitle}</Text>
                <Button>{titleButton}</Button>
                <Button onPress={() => fechaModal()} type={'outline'}>Agora não</Button>
            </View>
        </BottomSheet>
    )
}