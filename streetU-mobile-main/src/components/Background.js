import React from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('screen');

const css = StyleSheet.create({
    ContainerBackground: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    KeyView: {
        flex: 1,
        width: width,
        height: height,
    }
})

var COLORS_GRADIENT = ['#42484D', '#161717EB', '#000'];

export default function Background({ children, behavior }) {
    return (
        <LinearGradient style={css.ContainerBackground} colors={COLORS_GRADIENT}>
            <KeyboardAvoidingView style={css.KeyView} behavior={behavior}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

export const BackgroundSemAVoiding = ({ children }) => {
    return (
        <LinearGradient style={css.ContainerBackground} colors={COLORS_GRADIENT}>
            <View>
                {children}
            </View>
        </LinearGradient>
    );
}