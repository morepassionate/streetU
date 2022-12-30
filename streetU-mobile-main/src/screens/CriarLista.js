import React, { useContext, useEffect, useState } from 'react';
import { StackActions } from '@react-navigation/native';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { View, StyleSheet, Switch } from 'react-native';
import { AnimatedView } from '../components/AnimatedView';
import { BackgroundSemAVoiding } from '../components/Background';
import { BotaoSwitch } from '../components/BotaoSwitch';
import { BotaoVoltar } from '../components/BotaoVoltar';
import { Button } from '../components/Button';
import { TextInput } from '../components/Form';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from '../contexts/UserContext';
import { novaColecao } from '../objetos/Colecoes';
import { Loading } from '../components/Loading';

var lojas = [];
var listaVazia = [];
var visivel = false;
var uuid = require('random-uuid-v4');
var db = getFirestore();

const css = StyleSheet.create({
    containerBody: {
        paddingLeft: 20,
        paddingRight: 20,
    }
});

const containerBody = [css.containerBody];

export const CriarLista = ({ navigation }) => {

    const [dadosRequestUser, setDadosRequestUser] = useState();
    const [tituloColecao, setTituloColecao] = useState('');
    const [descColecao, setDescColecao] = useState('');
    const [erroTitulo, setErroTitulo] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [erroDesc, setErroDesc] = useState(true);
    const [loading, setLoading] = useState(false);
    const { _RequestDataDoUsuario, dadosDePerfilDoUser } = useContext(FirebaseContext);
    const { usuario } = useContext(UserContext);
    const AvatarPerfil = dadosRequestUser?.user_foto_avatar;
    const NomeUser = dadosRequestUser?.user_name;
    const user_tipo = dadosRequestUser?.user_tipo;
    const UserUid = usuario.uid;

    const ativaLoading = () => setLoading(true);
    const desativeLoading = () => setLoading(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            _RequestDataDoUsuario(UserUid);
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        setDadosRequestUser(dadosDePerfilDoUser);
    }, [dadosDePerfilDoUser]);

    const mudaStateDoSwitch = () => setIsEnabled(prevState => !prevState);

    const verificaTipoUser = (tipo) => {
        switch (tipo) {
            case 0:
                return false;
            case 1:
                return true;
        }
    }

    const SalvaNoFirestore = () => {
        ativaLoading();
        const NewLista = novaColecao(UserUid, null, AvatarPerfil, descColecao, listaVazia, lojas, NomeUser, isEnabled, tituloColecao, 0, 0, false, visivel, verificaTipoUser(user_tipo));
        const ref_colecao = doc(collection(db, "colecoes"));
        const id_ref_colecao = ref_colecao.id;
        Object.assign(NewLista, { idColecao: id_ref_colecao });
        setDoc(ref_colecao, NewLista).then(() => {
            navigation.navigate("Listas");
            desativeLoading();
        });
    }

    const verificaTitulo = (txt) => {
        if (txt === '') {
            return setErroTitulo('Defina um título para a sua lista');
        } else if (txt !== '') {
            return setErroTitulo(false);
        }
    }

    const verificaDesc = (txt) => {
        if (txt === '') {
            return setErroDesc('Defina a descrição para a sua lista');
        } else if (txt !== '') {
            return setErroDesc(false);
        }
    }

    const verificaInicioDaCriacaoDaLista = () => {
        if (!erroTitulo && !erroDesc && !!dadosRequestUser) return SalvaNoFirestore(); 
    }

    const handlerVoltarParaMinhasListas = () => {
        navigation.navigate("Listas");
    }

    const handlerSubmitBotao = () => {
        verificaTitulo(tituloColecao);
        verificaDesc(descColecao);
        verificaInicioDaCriacaoDaLista();
    }

    return (
        <BackgroundSemAVoiding>
            <AnimatedView style={containerBody}>
                <HeaderBotoes
                    handlerVoltarParaMinhasListas={handlerVoltarParaMinhasListas} />
                <Body
                    erroTitulo={erroTitulo}
                    erroDesc={erroDesc}
                    descColecao={descColecao}
                    tituloColecao={tituloColecao}
                    setDescColecao={setDescColecao}
                    setTituloColecao={setTituloColecao}
                />
                <BotaoSwitch
                    txtSwitch={isEnabled ? 'Está lista é privada' : 'Está lista é pública'}
                    valor={isEnabled}
                    acaoToggle={mudaStateDoSwitch}
                />
                <Footer
                    loading={loading}
                    handlerSubmitBotao={handlerSubmitBotao} />
            </AnimatedView>
        </BackgroundSemAVoiding>
    )
}

const HeaderBotoes = ({ handlerVoltarParaMinhasListas }) => {
    return (
        <BotaoVoltar acaoOnPress={handlerVoltarParaMinhasListas} />
    )
};

const Body = ({
    descColecao,
    tituloColecao,
    setDescColecao,
    setTituloColecao,
    erroDesc,
    erroTitulo
}) => {
    return (
        <View>
            <TextInput
                label="Titulo da coleção"
                placeholder="Titulo da coleção"
                keyboardType="default"
                autoCapitalize="none"
                valor={tituloColecao}
                onChangeText={(txt) => setTituloColecao(txt)}
                errorText={erroTitulo}
            />
            <TextInput
                label="Descrição da coleção"
                placeholder="Descrição da coleção"
                keyboardType="default"
                autoCapitalize="none"
                valor={descColecao}
                onChangeText={(txt) => setDescColecao(txt)}
                errorText={erroDesc}
            />
        </View>
    )
};

const Footer = ({ handlerSubmitBotao, loading }) => {
    return (
        <>
            {loading ? <Loading /> : <Button onPress={() => handlerSubmitBotao()}>Criar nova coleção</Button>}
        </>
    )
};