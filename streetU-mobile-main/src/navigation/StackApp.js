import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { SideMenu } from './SideMenu';
import { DetalhesItemLista } from '../screens/DetalhesItemLista';
import { CriarLista } from '../screens/CriarLista';
import { BottomTabs } from './BottomTabs';
import { PerfilPublico } from '../screens/PerfilPublico';
import { PerfilDaLoja } from '../screens/PerfilDaLoja';
import { EscolheFotosDaColecao } from '../screens/EscolheFotosDaColecao';
import { MenuGrid } from '../screens/MenuGrid';

const App = createStackNavigator();

export const StackApp = () => (
    <App.Navigator
        initialRouteName='SideMenu'
        screenOptions={{
            headerShown: false
        }}>
        <App.Screen name='SideMenu' component={SideMenu} />
        <App.Screen name='MenuGrid' component={MenuGrid} />
        <App.Screen name='DetalhesItemLista' component={DetalhesItemLista} />
        <App.Screen name='CriarNovaLista' component={CriarLista} />
        <App.Screen name='PerfilPublico' component={PerfilPublico} />
        <App.Screen name='PerfilDaLoja' component={PerfilDaLoja} />
        <App.Screen name='EscolheFotosDaColecao' component={EscolheFotosDaColecao} />
    </App.Navigator>
)