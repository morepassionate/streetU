import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { Splash } from '../screens/Splash';
import { ResetPassword } from '../screens/ResetPassword';
import { Image, StatusBar, View, StyleSheet, Pressable } from 'react-native';
import { Cadastro } from '../screens/Cadastro'; 

const css = StyleSheet.create({
  SvgBack: {
    height: 30,
    marginLeft: 20,
    marginTop: '10%',
    width: 30
  }
})

const SvgBack = [css.SvgBack];
const MainStack = createStackNavigator();
const DestinoSvgArrow = require('../../assets/arrow.png'); 


const ArrowBack = () => {
  return (
    <Pressable>
      <Image style={SvgBack} source={DestinoSvgArrow} />
    </Pressable>
  )
}


export const Main = () => ( 

  <MainStack.Navigator
    initialRouteName='Splash'
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: 'horizontal'
    }}>
    <MainStack.Screen
      name="Splash"
      component={Splash}
      options={{
        headerTitle: 'Splash'
      }}
    />
    <MainStack.Screen
      name="Login"
      component={Login}
      options={{
        headerTitle: 'Login'
      }}
    />
    <MainStack.Screen
      name="Resetpassword"
      component={ResetPassword}
      options={{
        headerTitle: '',
        headerShown: false, 
      }}
    />
    <MainStack.Screen
      name="Cadastro"
      component={Cadastro}
      options={{
        headerTitle: '',
        headerShown: false,
        headerTransparent: true, 
      }}
    />

  </MainStack.Navigator>
);
