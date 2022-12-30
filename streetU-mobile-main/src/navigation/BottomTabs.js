import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SideMenu } from './SideMenu';
import { Buscar } from '../screens/Buscar';
import { Listas } from '../screens/Listas';
import { Mapa } from '../screens/Mapa';
import Icone from '../components/Icone';
import colors from '../constants/colors'; 
import { MainHome } from '../screens/MainHome';
 
const Tab = createMaterialBottomTabNavigator(); 

var COR_TAB_BAR_BOTTOM = '#000';

export const BottomTabs = () => {

    const bar = {
        height: 80,
        backgroundColor: COR_TAB_BAR_BOTTOM, 
        alignItems: 'center', 
        paddingTop: 5, 
    }

    return (
        <Tab.Navigator
            initialRouteName='Inicio'
            barStyle={bar}
            activeColor={colors.primary}
            inactiveColor={colors.white}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let cor;

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home-outline' : 'home-outline';

                    } else if (route.name === 'Buscar') {
                        iconName = focused ? 'search-outline' : 'search-outline';

                    } else if (route.name === 'Listas') {
                        iconName = focused ? 'bookmark-outline' : 'bookmark-outline';

                    } else if (route.name === 'Mapa') {
                        iconName = focused ? 'location-outline' : 'location-outline';
                    }

                    return <Icone nameIcone={iconName} corIcone={color} tamanhoIcon={25} />
                },
            })}
        >
            <Tab.Screen
                name="Inicio"
                component={MainHome}
                options={{
                    headerTitle: 'Inicio',
                    headerShown: true, 
                }} />
            <Tab.Screen
                name="Buscar"
                component={Buscar}
                options={{
                    headerTitle: 'Buscar',
                    headerShown: false,
                }} />
            <Tab.Screen
                name="Listas"
                component={Listas}
                options={{
                    headerTitle: 'Listas',
                    headerShown: false,
                }} />
            <Tab.Screen
                name="Mapa"
                component={Mapa}
                options={{
                    headerTitle: 'Mapa', 
                    title: 'Mapa',
                    headerShown: true, 
                }} />
        </Tab.Navigator>
    );
}