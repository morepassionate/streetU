import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Main } from './navigation/Main';
import { LogBox, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { AppRoute } from './navigation/AppRoute';
import { UserProvider } from './contexts/UserContext';
import { Rota } from './rota/Rota';
import { FirebaseProvider } from './contexts/FirebaseContext'; 

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning: ...']);
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const carregaFonts = async () => {
    try {
      await Font.loadAsync({
        'CircularStd': require('../fonts/circular-std-medium-500.ttf'),
      });
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  }

  const verificaInicioApp = async () => {
    if (!appIsReady) {
      return null
    } else {
      await SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    carregaFonts();
  }, []);

  useEffect(() => {
    verificaInicioApp();
  }, [appIsReady]);

  return (
    <>
      <StatusBar style='light' hidden={true} />
      <NavigationContainer >
        <UserProvider>
          <FirebaseProvider>
            <Rota />
          </FirebaseProvider>
        </UserProvider>
      </NavigationContainer>
    </>
  );
}
