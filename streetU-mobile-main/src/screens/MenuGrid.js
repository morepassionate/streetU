import React, { useContext } from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet, StatusBar } from 'react-native';
import Icone from '../components/Icone';
import { Text } from '../components/Text';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('screen');
import { UserContext } from '../contexts/UserContext';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { Avatar } from 'react-native-paper';
import { useEffect } from 'react';
import { useState } from 'react'; 

var COR = colors.white;
var TAMANHO = 25; 
var BOTAO_REDONDO_VOLTAR = "arrow-forward-circle-outline"; 

const css = StyleSheet.create({
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        justifyContent: 'space-between',
        paddingLeft: 13
    },
    titleBotao: {
        fontSize: 20,
        color: colors.white,
        paddingTop: 25
    },

});

const botao = css.botao;
const titleBotao = css.titleBotao;
const SpaceRight = { marginRight: 20 };
const background = { width: width, height: height, backgroundColor: 'black', paddingTop: StatusBar.currentHeight || '10%', padding: 10 };

export function MenuGrid() {
    const { _RequestDataDoUsuario, dadosDePerfilDoUser } = useContext(FirebaseContext);
    const { usuario } = useContext(UserContext);
    const [requestedDataUser, setRequestedDataUser] = useState(null);

    useEffect(() => {
        _RequestDataDoUsuario(usuario.uid);
    }, []);

    useEffect(() => {
        setRequestedDataUser(dadosDePerfilDoUser);
    }, [dadosDePerfilDoUser]);

    return (
        <View style={background}>
            <BotaoVoltarInicio/>
            <CardProfile requestedDataUser={requestedDataUser} />  
            <ListButton nameScreen={'Configuracoes'} name={'Configurações'} IconeNome={'settings-outline'} />
            <ListButton nameScreen={'Sair'} name={'Sair'} IconeNome={'log-in-outline'} />
        </View>
    )
};

const ListButton = ({ name, IconeNome, nameScreen }) => {
    const navigation = useNavigation();
    const { logOut } = useContext(UserContext);

    const handler = () => {
        if (name === 'Sair') {
            return logOut();
        } else {
            return navigation.navigate(nameScreen);
        }
    };

    return (
        <TouchableOpacity style={botao} onPress={() => handler()}>
            <Text style={titleBotao} type={'subheader'}>{name}</Text>
            <Icone style={SpaceRight} nameIcone={IconeNome} tamanhoIcon={TAMANHO} corIcone={COR} />
        </TouchableOpacity>
    )
};

const CardProfile = ({ requestedDataUser }) => {
    const navigation = useNavigation();
    const avatarProfile = requestedDataUser?.user_foto_avatar;
    const nomeProfile = requestedDataUser?.user_name;

    const goMeuPerfil = () => {
        navigation.navigate('MeuPerfil');
    };

    return (
        <TouchableOpacity
            onPress={() => goMeuPerfil()}
            style={{
                height: 70,
                width: '93%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center', 
            }}>
            <Avatar.Image source={{ uri: avatarProfile ? avatarProfile : 'https://mod.go.ke/wp-content/uploads/2021/04/default-profile-pic.png' }} />
            <View style={{
                marginLeft: 15
            }}>
                <Text>{nomeProfile}</Text>
                <Text
                    style={{
                        fontSize: 13
                    }}>ver perfil</Text>
            </View>
            <Icone
                nameIcone={'chevron-forward-outline'}
                tamanhoIcon={20}
                corIcone={colors.white}
                style={{
                    position: 'absolute',
                    right: 10
                }}
            />
        </TouchableOpacity>
    )
};

const BotaoVoltarInicio = () => {
    const navigation = useNavigation();

    const goInicio = () => {
        navigation.navigate('Inicio');
    };

    return(
       <TouchableOpacity 
       onPress={()=> goInicio()}
       style={{
        flexDirection: 'row-reverse',
        marginLeft: 20
       }}>
         <Icone
            nameIcone={BOTAO_REDONDO_VOLTAR}
            corIcone={colors.white}
            tamanhoIcon={30}
            style={{
                marginLeft: 10,
                marginBottom: 20
            }}
        />
        <Text style={{
            marginTop: 7,
            marginLeft: 15
        }}>Voltar ao inicio</Text>
       </TouchableOpacity>
    )
}

