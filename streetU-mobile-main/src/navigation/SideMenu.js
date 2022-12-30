import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainHome } from '../screens/MainHome';
import { Image, StatusBar, View, StyleSheet, Pressable, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Icone from '../components/Icone';
import colors from '../constants/colors';
import { BottomTabs } from './BottomTabs';
import { Pro } from '../screens/Pro';
import { Configuracoes } from '../screens/Configuracoes';
import { Sair } from '../screens/Sair';
import { MeuPerfil } from '../screens/MeuPerfil';
import { UserContext } from '../contexts/UserContext';

const { width, height } = Dimensions.get('screen');
const css = StyleSheet.create({
    SvgLogo: {
        height: 30,
        marginLeft: 20,
        marginTop: '10%',
        marginBottom: 15
    },
    SvgConfig: {
        height: 20,
        marginTop: '5%',
        marginRight: Platform.OS === 'ios' ? '-10%' : '-5%',
        marginBottom: 15

    }
});
const Drawer = createDrawerNavigator();

export const SideMenu = () => {
    const { logOut } = useContext(UserContext);

    return (
        <Drawer.Navigator
            initialRouteName='MainHome'

            screenOptions={({ route }) => ({
                drawerContentStyle: { backgroundColor: 'black' },
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                drawerActiveTintColor: colors.white,
                drawerInactiveTintColor: '#888888',
                drawerLabelStyle: {
                    fontSize: 18,
                    marginLeft: -20
                },
                swipeEnabled:false
            })
            }>
            <Drawer.Screen
                name="Bottom"
                component={BottomTabs}
                options={{
                    headerTitle: '',
                    title: 'Inicio',
                    headerShown: false,
                    drawerIcon: ({ color }) => (
                        <Icone nameIcone={'home-outline'} corIcone={color} tamanhoIcon={20} />
                    ),
                }} />

            <Drawer.Screen
                name="MeuPerfil"
                component={MeuPerfil}
                options={{
                    headerTitle: '',
                    title: 'Meu perfil',
                    headerShown: false,
                    drawerIcon: ({ color }) => (
                        <Icone nameIcone={'person-outline'} corIcone={color} tamanhoIcon={20} />
                    ),
                }} />

            <Drawer.Screen
                name="Pro"
                component={Pro}
                options={{
                    headerTitle: '',
                    title: 'Torne-se PRO',
                    headerShown: false,
                    drawerIcon: ({ color }) => (
                        <Icone nameIcone={'star-outline'} corIcone={color} tamanhoIcon={20} />
                    )
                }} />

            <Drawer.Screen
                name="Configuracoes"
                component={Configuracoes}
                options={{
                    headerTitle: '',
                    title: 'Configurações',
                    headerShown: false,
                    drawerIcon: ({ color }) => (
                        <Icone nameIcone={'settings-outline'} corIcone={color} tamanhoIcon={20} />
                    )
                }} />

            <Drawer.Screen
                name="Sair"
                component={Sair}
                options={{
                    headerTitle: '',
                    title: 'Sair',
                    headerShown: false,
                    drawerIcon: ({ color }) => (
                        <Icone nameIcone={'log-in-outline'} corIcone={color} tamanhoIcon={25} onPress={() => logOut()} />
                    )
                }} />
        </Drawer.Navigator>
    );
}