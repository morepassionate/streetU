import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Switch, Pressable, TextInput, Alert } from 'react-native';
import { BackgroundSemAVoiding } from '../components/Background';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { auth, db, storage } from '../util/Firebase';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AnimatedView } from '../components/AnimatedView';
import colors from '../constants/colors';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import { BotaoSwitch } from '../components/BotaoSwitch';

const css = StyleSheet.create({
  avatar: {
    height: 160,
    width: 160,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 20
  },
  txt_name: {
    textAlign: 'center',
    fontSize: 25,
    color: colors.white,
    width: 180,
  },
  icon_pencil: {
    position: 'absolute',
    right: '23%',
    top: 150
  },
  ImagensColecao: {
    height: 160,
    width: 101,
    marginTop: 20,
    marginRight: 15,
    borderRadius: 10,
  },
  ContainerListaColecoes: {
    paddingLeft: 25,
    marginBottom: 25
  },
  txtTitleLista: {
    textAlign: 'right',
    marginRight: 15,
  },
  txtViews: {
    textAlign: 'right',
    marginRight: 15,
    marginTop: 5,
    fontSize: 13
  },
  centralizaView: {
    alignItems: 'center',

  },
  pencil: {
    width: 22,
    height: 22
  },
  ContainerBody: {
    padding: 15,
    paddingRight: 20,
  },
  fontTitle: {
    fontSize: 25,
    color: colors.white
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  rowSemSpace: {
    flexDirection: 'row',
    marginTop: -10,
    alignItems: 'center',
  },
  SpaceTop: {
    marginTop: 15
  },
  SpaceBottom: {
    marginBottom: 20
  },
  fontSize: {
    fontSize: 17,
    marginTop: 10
  },
  ToggleSelect: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: colors.white,
    marginRight: 10
  },
  ToggleSelectDesativado: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: colors.cinzaTxt,
    marginRight: 10
  },
  PositionSwitch: {
    position: 'absolute',
    right: 0,
    top: -22
  },
  BotaoPencil: {
    position: 'absolute',
    right: '23%',
    top: -5
  }
});

const txt_name = css.txt_name;
const avatar = css.avatar;
const icon_pencil = css.icon_pencil;
const centralizaView = css.centralizaView;
const pencil = css.pencil;
const ContainerBody = css.ContainerBody;
const fontTitle = css.fontTitle;
const row = css.row;
const ContainerListaColecoes = css.ContainerListaColecoes;
const SpaceTop = css.SpaceTop;
const SpaceBottom = css.SpaceBottom;
const fontSize = css.fontSize;
const rowSemSpace = css.rowSemSpace;
const ToggleSelect = css.ToggleSelect;
const ToggleSelectDesativado = css.ToggleSelectDesativado;
const PositionSwitch = css.PositionSwitch;
const BotaoPencil = css.BotaoPencil;

var REF_COLECAO_USER = 'usuarios';
var SIZE_ICONE = 25;
var COR_ICONE = colors.white;
var TEXT_SUBHEADER = "subheader";
var HEADER = "header";

export const Configuracoes = ({ navigation }) => {

  const { usuario } = useContext(UserContext);
  const { _RequestMinhasListas, dataMinhasListas } = useContext(FirebaseContext);
  const [dadosDePerfilDoUser, setDadosDePerfilDoUser] = useState(null);
  const [listaDeColecoesDoUsuario, setListaDeColecoesDoUsuario] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [ICONE_PENCIL, SET_ICONE_PENCIL] = useState('camera-outline');
  const [loading, setLoading] = useState(false);
  const [AtivaModoEdicao, setAtivaModoEdicao] = useState(null);
  const perfil_publico = dadosDePerfilDoUser?.perfil_publico;
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState(null);

  const ativeLoading = () => setLoading(true);
  const desativeLoading = () => setLoading(false);

  const AtModoEdicao = () => setAtivaModoEdicao(true);

  useEffect(() => {
    if (imageSelected !== null) return SET_ICONE_PENCIL('checkmark-outline');
    if (imageSelected === null) return SET_ICONE_PENCIL('camera-outline');
  }, [imageSelected]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      _RequestDataDoUsuario();
      _RequestMinhasListas(usuario.uid);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setListaDeColecoesDoUsuario(dataMinhasListas)
  }, [dataMinhasListas]);

  useEffect(() => {
    _RequestDataDoUsuario();
  }, [imageSelected]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageSelected(result.uri);
    }
  };

  const _RequestDataDoUsuario = () => {
    var refDataUser = db.collection(REF_COLECAO_USER).doc(usuario.uid);
    refDataUser.get().then((doc) => {
      if (doc.exists) {
        setDadosDePerfilDoUser(doc.data());
      } else {
      }
    }).catch((error) => {
    });
  };

  async function updateUser(nome) {
    return updateProfile(auth.currentUser, { displayName: nome });
}

  //FUNÇÃO QUE SALVA IMAGEM DE AVATAR NO FIRESTORE E ATUALIZA O AVATAR DO PERFIL NAS COLEÇÕES
  const salvaImagemNoDb = async () => {
    ativeLoading();
    const ref_user = db.collection("usuarios").doc(usuario.uid);

    const img = await fetch(imageSelected);
    const bytes = await img.blob();
    const caminho = 'avatarUsuario/' + `${usuario.uid}.png`;
    const storageRef = ref(storage, caminho);

    uploadBytes(storageRef, bytes).then(() => {
      getDownloadURL(storageRef).then(async (url) => {
        ref_user.update({
          user_foto_avatar: url
        }).then(() => {
          db.collection('colecoes').where('idUser', '==', usuario.uid).get().then(async (snapshots) => {
            const updatesDadosPerfilNasColecoes = [];
            snapshots.forEach((doc) =>
              updatesDadosPerfilNasColecoes.push(doc.ref.update({
                AvatarPerfil: url
              }))
            )
            await Promise.all(updatesDadosPerfilNasColecoes);
          });
          desativeLoading();
          setImageSelected(null);
        });
      });
    });
  }

  //FUNÇÃO QUE FAZ UPDATE DO NOME DE PERFIL NO FIRESTORE
  const DeModoEdicao = (close) => {
    if (close === 'close') return setAtivaModoEdicao(false);
    if (close !== 'close' || close === null || close === undefined) {
      const ref_user = db.collection("usuarios").doc(usuario.uid);
      ref_user.update({
        user_name: nome
      }).then(() => {
        updateUser(nome)
        _RequestDataDoUsuario();
        setAtivaModoEdicao(false)
        Alert.alert('Alteração concluída', "Nome de perfil foi salvo com sucesso!");
      });
    }
  };

  const SalvaPrivacidadeDaConta = () => {
    if (valor === null) {
      setValor(perfil_publico === true ? false : true);
    } else {
      setValor(valor ? false : true);
    }
  };

  useEffect(() => {
    if (valor === null) return;
    if (valor !== null) return updateDataPerfilFirestore();
  }, [valor]);

  const updateDataPerfilFirestore = () => {
    const ref_user = db.collection("usuarios").doc(usuario.uid);
    ref_user.update({
      perfil_publico: valor
    }).then(() => {
      Alert.alert('Alteração concluída', "Privacidade do perfil foi alterada com sucesso!")
    });
  }

  return (
    <BackgroundSemAVoiding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <HeaderAvatar
          dadosUsuario={dadosDePerfilDoUser}
          pickImage={pickImage}
          imageSelected={imageSelected}
          ICONE_PENCIL={ICONE_PENCIL}
          salvaImagemNoDb={salvaImagemNoDb}
          loading={loading}
          AtModoEdicao={AtModoEdicao}
          DeModoEdicao={DeModoEdicao}
          AtivaModoEdicao={AtivaModoEdicao}
          name={nome}
          setNome={setNome}
        />
        <Body
          dadosDePerfilDoUser={dadosDePerfilDoUser}
          valor={valor === null ? perfil_publico : valor}
          setValor={SalvaPrivacidadeDaConta}
        />
        <SelectedSetting
          dadosDePerfilDoUser={dadosDePerfilDoUser}
          UserId={usuario.uid}
        />
      </ScrollView>
    </BackgroundSemAVoiding>
  );
}

const Row = ({ children, type, }) => {
  return (
    <View style={type === 'semSpace' ? rowSemSpace : row}>
      {children}
    </View>
  )
}

const HeaderAvatar = ({
  dadosUsuario, pickImage, imageSelected,
  ICONE_PENCIL, salvaImagemNoDb, loading,
  AtModoEdicao, DeModoEdicao, AtivaModoEdicao,
  name, setNome }) => {

  const nome = dadosUsuario?.user_name;
  const avatar_perfil = dadosUsuario?.user_foto_avatar;

  return (
    <AnimatedView>

      <Image
        style={avatar}
        source={{ uri: imageSelected === null ? avatar_perfil : imageSelected }} />
      {loading ?
        <Loading />
        :
        <Icone
          style={icon_pencil}
          nameIcone={ICONE_PENCIL}
          tamanhoIcon={SIZE_ICONE}
          corIcone={COR_ICONE}
          onPress={() => { imageSelected === null ? pickImage() : salvaImagemNoDb() }}
        />
      }
      {AtivaModoEdicao ?
        <Icone
          style={{ position: 'absolute', left: 20, right: 30 }}
          nameIcone={'close'}
          tamanhoIcon={SIZE_ICONE}
          corIcone={COR_ICONE}
          onPress={() => DeModoEdicao('close')}
        />
        :
        null
      }
      <View style={centralizaView}>
        {AtivaModoEdicao ?
          <>
            <TextInput
              placeholder={nome}
              placeholderTextColor={colors.white}
              value={name}
              onChangeText={(txt) => setNome(txt)}
              style={[fontTitle, { marginTop: -10, width: 180, marginBottom: 10, marginLeft: 15 }]}
            />
            <Icone
              style={[BotaoPencil, { marginTop: -3 }]}
              nameIcone={'checkmark-circle-outline'}
              tamanhoIcon={SIZE_ICONE}
              corIcone={COR_ICONE}
              onPress={() => DeModoEdicao()} />
          </>
          :
          <>
            <Text
              style={txt_name}
              numberOfLines={1}
              type={TEXT_SUBHEADER}>{nome}</Text>
            <TouchableOpacity onPress={() => AtModoEdicao()} style={BotaoPencil}>
              <Image
                source={require('../../assets/iconePencil.png')}
                style={pencil}
              />
            </TouchableOpacity>
          </>
        }
      </View>
    </AnimatedView>
  )
};

const Body = ({ dadosDePerfilDoUser, setValor, valor }) => {
  const user_email = dadosDePerfilDoUser?.user_email;

  return (
    <AnimatedView style={ContainerBody}>
      <Text style={fontTitle} type={HEADER}>Definições de conta</Text>
      <Row>
        <Text type={TEXT_SUBHEADER}>Perfil público</Text>
        <Switch
          style={PositionSwitch}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={valor ? colors.white : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setValor}
          value={valor}
        />
      </Row>
      <Row>
        <Text style={{ marginTop: 2 }} type={TEXT_SUBHEADER}>Email:</Text>
        <Text style={{ marginTop: 1 }} type={TEXT_SUBHEADER}>{user_email}</Text>
      </Row>
      <Text style={SpaceTop} type={TEXT_SUBHEADER}>Privacidade</Text>
    </AnimatedView>
  )
};

const ListItem = ({ title, onPress, chave, togglePrivacidade }) => {
  return (
    <Row type={'semSpace'}>
      <TouchableOpacity onPress={onPress} style={togglePrivacidade === chave ? ToggleSelect : ToggleSelectDesativado} />
      <Text style={[fontSize, { width: '80%' }]} type={TEXT_SUBHEADER}>{title}</Text>
    </Row>
  )
}

const SelectedSetting = ({ dadosDePerfilDoUser, UserId }) => {

  const [privacidadePerfil, setPrivacidadePerfil] = useState(null);
  const [privacidadeLista, setPrivacidadeLista] = useState(null);
  const [privacidadeGeolocalizacao, setPrivacidadeGeolocalizacao] = useState(null);

  const updateDataPrivacidadePerfil = (OqueSalvar) => {
    const ref_user = db.collection("usuarios").doc(UserId);
    ref_user.update({
      privacidade_perfil: OqueSalvar
    }).then(() => {
      Alert.alert('Alteração concluída', "Privacidade do perfil foi alterada com sucesso!")
    });
  };

  const updateDataPrivacidadeLista = (OqueSalvar) => {
    const ref_user = db.collection("usuarios").doc(UserId);
    ref_user.update({
      privacidade_lista: OqueSalvar
    }).then(() => {
      Alert.alert('Alteração concluída', "Privacidade da lista foi alterada com sucesso!")
    });
  };

  const updateDataPrivacidadeGeolocalizacao = (OqueSalvar) => {
    const ref_user = db.collection("usuarios").doc(UserId);
    ref_user.update({
      privacidade_geolocalizacao: OqueSalvar
    }).then(() => {
      Alert.alert('Alteração concluída', "Definições de geolocalização foi alterada com sucesso!")
    });
  }

  const handlerPrivacidadePerfil = (chave) => {
    setPrivacidadePerfil(chave);
    updateDataPrivacidadePerfil(chave);
  }

  const handlerPrivacidadeLista = (chave) => {
    setPrivacidadeLista(chave);
    updateDataPrivacidadeLista(chave);
  }

  const handlerPrivacidadeGeolocalizacao = (chave) => {
    setPrivacidadeGeolocalizacao(chave);
    updateDataPrivacidadeGeolocalizacao(chave);
  }

  return (
    <View style={ContainerListaColecoes}>
      <Text type={TEXT_SUBHEADER}>Foto e descrição de perfil visível para</Text>

      <ListItem
        chave={1}
        title={'Amigos'}
        togglePrivacidade={privacidadePerfil === null ? dadosDePerfilDoUser?.privacidade_perfil : privacidadePerfil}
        onPress={() => handlerPrivacidadePerfil(1)} />
      <ListItem
        chave={2}
        title={'Todos'}
        togglePrivacidade={privacidadePerfil === null ? dadosDePerfilDoUser?.privacidade_perfil : privacidadePerfil}
        onPress={() => handlerPrivacidadePerfil(2)} />
      <ListItem
        chave={3}
        title={'Todos, exceto'}
        togglePrivacidade={privacidadePerfil === null ? dadosDePerfilDoUser?.privacidade_perfil : privacidadePerfil}
        onPress={() => handlerPrivacidadePerfil(3)} />

      <Text style={SpaceTop} type={TEXT_SUBHEADER}>Lista</Text>
      <ListItem
        chave={1}
        title={'Amigos'}
        togglePrivacidade={privacidadeLista === null ? dadosDePerfilDoUser?.privacidade_lista : privacidadeLista}
        onPress={() => handlerPrivacidadeLista(1)} />
      <ListItem
        chave={2}
        title={'Todos'}
        togglePrivacidade={privacidadeLista === null ? dadosDePerfilDoUser?.privacidade_lista : privacidadeLista}
        onPress={() => handlerPrivacidadeLista(2)} />
      <ListItem
        chave={3}
        title={'Todos, exceto'}
        togglePrivacidade={privacidadeLista === null ? dadosDePerfilDoUser?.privacidade_lista : privacidadeLista}
        onPress={() => handlerPrivacidadeLista(3)} />

      <Text style={[SpaceTop,]} type={TEXT_SUBHEADER}>Permitir geolocalização</Text>
      <ListItem
        chave={1}
        title={'Durante o uso da aplicação'}
        togglePrivacidade={privacidadeGeolocalizacao === null ? dadosDePerfilDoUser?.privacidade_geolocalizacao : privacidadeGeolocalizacao}
        onPress={() => handlerPrivacidadeGeolocalizacao(1)} />
      <ListItem
        chave={2}
        title={'Sempre'}
        togglePrivacidade={privacidadeGeolocalizacao === null ? dadosDePerfilDoUser?.privacidade_geolocalizacao : privacidadeGeolocalizacao}
        onPress={() => handlerPrivacidadeGeolocalizacao(2)} />
      <ListItem
        chave={3}
        title={'Nunca (terá limitações na utilização da Aplicação)'}
        togglePrivacidade={privacidadeGeolocalizacao === null ? dadosDePerfilDoUser?.privacidade_geolocalizacao : privacidadeGeolocalizacao}
        onPress={() => handlerPrivacidadeGeolocalizacao(3)} />
    </View>
  )
}