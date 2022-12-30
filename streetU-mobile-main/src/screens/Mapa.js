import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import Background, { BackgroundSemAVoiding } from '../components/Background';
import { Header } from '../components/Header';
import MapView from 'react-native-maps';
import { Storys } from '../helpers/Storys';
import { DataStorys } from '../../DATAFAKE';
import { AnimatedView } from '../components/AnimatedView';
import * as Location from 'expo-location';

const css = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? '80%' : '90%',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    marginBottom: 15

  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const container = [css.container];
const map = [css.container];

export const Mapa = () => {

  const [InitialRegiao, setInitialRegiao] = useState(null);
  const [locationUser, setLocationUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('A permissão para acessar o local foi negada!');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocationUser(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (!!locationUser && locationUser !== null) {
      setInitialRegiao({
        latitude: locationUser?.latitude,
        longitude: locationUser?.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    }
  }, [locationUser]);

  return (
    <BackgroundSemAVoiding>
      <Header />
      <Storys DataStorys={DataStorys} />
      <Map InitialRegiao={InitialRegiao} />
    </BackgroundSemAVoiding>
  );
}

const Map = ({ InitialRegiao }) => {

  return (
    InitialRegiao !== null ?
      <AnimatedView style={container}>
        <MapView
          initialRegion={InitialRegiao}
          showsUserLocation={true}
          zoomEnabled={true}
          style={map} />
      </AnimatedView> : null
  )
}