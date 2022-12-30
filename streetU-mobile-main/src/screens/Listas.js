import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import Background, { BackgroundSemAVoiding } from '../components/Background';
import { Header } from '../components/Header';
import { Text } from '../components/Text';
import { AnimatedView } from '../components/AnimatedView';
import { Divisor } from '../components/Divisor';
import { DataListaDeColecoes } from '../../DATAFAKE';
import { CardLista } from '../components/CardLista';
import Icone from '../components/Icone';
import colors from '../constants/colors';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';

const css = StyleSheet.create({
  headerTitle: {
    paddingLeft: 18,
    paddingTop: 15,
    paddingRight: 18,
  },
  txtTitle: {
    marginBottom: 10,
    fontSize: 25
  },
  BodyFlatlist: {
    height: '100%'
  },
  iconeDeCriarLista: {
    position: 'absolute',
    right: 30,
    top: 15
  }
});

const txtTitle = [css.txtTitle];
const headerTitle = [css.headerTitle];
const BodyFlatlist = [css.BodyFlatlist];
const iconeDeCriarLista = [css.iconeDeCriarLista];

var ICONE_CRIAR_NOVA_LISTA = "add-circle-outline";
var COR_ICONE = colors.white;
var TAMANHO_ICONE = 30;

export const Listas = ({ navigation }) => {

  const { usuario } = useContext(UserContext);
  const { _RequestMinhasListas, dataMinhasListas, clearState } = useContext(FirebaseContext);
  const [DataMinhasListas, setDataMinhasListas] = useState();
  const UserUid = usuario.uid;

  const handlerAbreScreenDetalhes = (data) => {
    if (data.FotosLista.length === 0) return Alert.alert('Espere um pouco', 'Sua lista está vazia!');
    if (data.FotosLista.length > 0) return navigation.navigate('DetalhesItemLista', { DataListaDeColecoes: data, goBackScreen: 'Listas' });
  }

  const handlerAbreScreenDeCriarLista = () => {
    navigation.navigate('CriarNovaLista');
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      clearState();
      _RequestMinhasListas(UserUid);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setDataMinhasListas(dataMinhasListas);
  }, [dataMinhasListas]);

  console.log(dataMinhasListas);

  return (
    <BackgroundSemAVoiding>
      <Header />
      <Title
        handlerAbreScreenDeCriarLista={handlerAbreScreenDeCriarLista} />
      <Body
        handlerAbreScreenDetalhes={handlerAbreScreenDetalhes}
        DataMinhasListas={DataMinhasListas} />
    </BackgroundSemAVoiding>
  );
}

const Title = ({ handlerAbreScreenDeCriarLista }) => {
  return (
    <AnimatedView duration={1000} style={headerTitle}>
      <Text style={txtTitle} type={'header'}>Listas</Text>
      <Icone
        corIcone={COR_ICONE}
        style={iconeDeCriarLista}
        tamanhoIcon={TAMANHO_ICONE}
        nameIcone={ICONE_CRIAR_NOVA_LISTA}
        onPress={() => handlerAbreScreenDeCriarLista()}
      />
      <Divisor />
    </AnimatedView>
  )
}

const Body = ({ handlerAbreScreenDetalhes, DataMinhasListas }) => {
  return (
    <AnimatedView duration={1000} style={headerTitle} >
      <FlatList
        data={DataMinhasListas}
        keyExtractor={item => item.id}
        contentContainerStyle={BodyFlatlist}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          console.log(item);
          return (
            <CardLista
              handlerAbreScreenDetalhes={handlerAbreScreenDetalhes}
              DataListaDeColecoes={item}
            />
          )
        }}
      />
    </AnimatedView>
  )
}
