import React, { useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { FlatList, Image, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { Avatar, Divider } from 'react-native-paper';
import Background, { BackgroundSemAVoiding } from '../components/Background';
import { Buscador } from '../components/Buscador';
import { Header } from '../components/Header';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { UserContext } from '../contexts/UserContext';
import { db } from '../util/Firebase';

const css = StyleSheet.create({

  input: {
    fontSize: 18,
    width: '90%'
  },
  viewCard: { flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginTop: 20, marginBottom: 15 },
  divisor: { backgroundColor: colors.cinzaTxt, height: 1, marginLeft: 20, marginRight: 20, opacity: .2 }

});

const input = [css.input];
const viewCard = css.viewCard;
const divisor = css.divisor;

var PERFIL_DA_LOJA = 'PerfilDaLoja';

export const Buscar = ({ navigation }) => {
  const [txtBuscador, setTxtBuscador] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltered, setUsuariosFiltered] = useState([]);
  const [filtereProd, setFiltereProd] = useState([]);
  const [focus, setFocus] = useState();
  const { usuario } = useContext(UserContext);

  const UserId = usuario?.uid;

  useEffect(() => {
    const uns = navigation.addListener('focus', () => {
      onRefresh();
    });
    return uns;
  }, [navigation]);


  useEffect(() => {
    if (filtereProd.length > 0) {
      setUsuariosFiltered(filtereProd)
      setFocus(false);
    } else if (filtereProd.length === 0) {
      onRefresh()
    }
  }, [filtereProd]);

  const pesquisaUser = (text) => {
    setFiltereProd(
      usuarios?.filter((i) => i.user_name.toLowerCase().includes(text.toLowerCase()))
    )
  }

  const openList = () => {
    setFocus(true);
  }

  const onRefresh = () => {
    recuperaTodosOsUsers();
  }

  const recuperaTodosOsUsers = async () => {
    const docRef = collection(db, "usuarios");
    const docSnap = await getDocs(docRef);
    let users = [];
    docSnap.forEach((doc) => {
      users.push({ ...doc.data() });
    })
    setUsuarios(users);
  }

  const abrePerfil = (data) => {
    console.log(data)
    if (data?.user_tipo === 1) return navigation.navigate(PERFIL_DA_LOJA, { DadosDaLoja: data, goBackScreen: 'Inicio' });

  }

  return (
    <BackgroundSemAVoiding>
      <Header />
      <Buscador
      >
        <TextInput
          onFocus={openList}
          style={input}
          placeholderTextColor={colors.cinzaTxt}
          placeholder='O que está procurando?'
          onChangeText={(txt) => pesquisaUser(txt)} />
      </Buscador>
      <Body
        usuarios={usuariosFiltered}
        UserId={UserId}
        abrePerfil={abrePerfil}
      />
    </BackgroundSemAVoiding>
  );
}

const Body = ({ usuarios, UserId, abrePerfil }) => {
  return (
    <FlatList
      data={usuarios}
      renderItem={({ item }) => <CardUsers data={item} UserId={UserId} abrePerfil={abrePerfil} />}
    />
  )
}

const CardUsers = ({ data, UserId, abrePerfil }) => {
  const user_foto_avatar = { uri: data?.user_foto_avatar };
  const user_name = data?.user_name;
  const user_id = UserId === data?.user_id
  const tipoProfile = data?.user_tipo === 1
  const descProfile = data?.descricao_profile;

  return (
    <>
      {user_id ?
        null
        :
        <TouchableOpacity onPress={() => abrePerfil(data)}>
          <View style={viewCard}>
            <Avatar.Image source={user_foto_avatar} />
            <View>
              <Text style={{ marginLeft: 15 }}>{user_name}</Text>
              {tipoProfile ?
                <Text style={{ marginLeft: 15, fontSize: 13, opacity: 0.8 }}>{descProfile}</Text>
                :
                null}
            </View>
          </View>
          <Divider style={divisor} />
        </TouchableOpacity>
      }
    </>
  );
}