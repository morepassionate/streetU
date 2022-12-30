import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Text } from './Text';
import Icone from '../components/Icone';
import colors from '../constants/colors';
import PopUpInfoColecao from '../helpers/PopUpInfoColecao';
import { AnimatedView } from './AnimatedView';
import { useNavigation } from '@react-navigation/native';
import { FirebaseContext } from '../contexts/FirebaseContext';

const css = StyleSheet.create({
    Row: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    SpaceTop: {
        marginTop: Platform.OS === 'ios' ? 10 : 40
    },
    SpaceLeft: {
        paddingLeft: 15
    },
    Coluna: {
        width: '90%'
    },
    Avatar: {
        width: 60,
        height: 60,
        borderRadius: 10
    },
    PaddingBox: {
        paddingLeft: 25,
        paddingRight: 25,
    },
    PositiontxtTitle: {
        textAlign: 'right',
        marginRight: 25,
        fontSize: 14
    },
    Divisor: {
        height: 2,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15
    },
    ImagensColecao: {
        height: 160,
        width: 101,
        marginTop: 20,
        marginRight: 15,
        borderRadius: 10,
    },
    TxtBotao: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '700'
    },
    TxtNomeUser: {
        marginRight: 15
    },
    BotaoArrowDown: {
        position: 'absolute',
        right: 20
    },
    inidicationFollowing:{
        width: 15,
        height: 15,
        borderRadius: 60,
        backgroundColor: colors.primary, 
        position: 'absolute',
        bottom: -5,
        right: 0
    }

});

const Row = [css.Row];
const Coluna = [css.Coluna];
const Avatar = [css.Avatar];
const Divisor = [css.Divisor];
const TxtBotao = [css.TxtBotao];
const SpaceTop = [css.SpaceTop];
const SpaceLeft = [css.SpaceLeft];
const PaddingBox = [css.PaddingBox];
const TxtNomeUser = [css.TxtNomeUser];
const ImagensColecao = [css.ImagensColecao];
const BotaoArrowDown = [css.BotaoArrowDown];
const PositiontxtTitle = [css.PositiontxtTitle];
const indicationFollowing = css.inidicationFollowing;

var IMG_RESIZE = "cover";

export const CardColecoes = ({
    DataListaDeColecoes, handlerAbreScreenDetalhes,
    handlerSegueUsuario, usersFollowing,
    handlerHeaderCard, UserId, handlerEscondeColecaoDoUser,
    idColecoesBloqueadas, handlerAtivaNotificacoes, idColecoesANotificar, DadosMeuPerfil,
    listaDeLojas
}) => {

    const idColecao = DataListaDeColecoes?.idColecao;
    const AvatarPerfil = DataListaDeColecoes?.AvatarPerfil;
    const TitleLista = !!DataListaDeColecoes ? DataListaDeColecoes?.TitleLista : "Aguardando...";
    const FotosLista = DataListaDeColecoes?.FotosLista;
    const StatusSeguir = DataListaDeColecoes?.seguindo;
    const Nome = DataListaDeColecoes?.Nome;
    const IdUserColecoes = DataListaDeColecoes?.idUser;
    const [IconName, setIconName] = useState('chevron-down-outline');
    const { GetIndexImagemSelecionada } = useContext(FirebaseContext);
    const [abreInfos, setAbreInfos] = useState(false);
    const ISLOJA = DataListaDeColecoes?.isLoja;

    var IdColecoesloqueadas = [];
    idColecoesBloqueadas?.map((item) => {
        IdColecoesloqueadas.push(item.id);
    });

    const result = IdColecoesloqueadas.includes(idColecao);
    const resultado = DadosMeuPerfil?.seguindo?.includes(IdUserColecoes)

    const abreModalInfo = () => {
        setAbreInfos(true)
    };

    const verificaIconInfos = () => {
    }; 

    useEffect(() => {
        verificaIconInfos(abreInfos);
    }, [abreInfos]);

    if (IdUserColecoes != UserId && !result) {
        return (
            <AnimatedView style={PaddingBox}>
                <Header
                    AvatarPerfil={AvatarPerfil}
                    TitleLista={TitleLista}
                    Nome={Nome}
                    StatusSeguir={StatusSeguir}
                    IconName={IconName}
                    abreModalInfo={abreModalInfo}
                    handlerHeaderCard={handlerHeaderCard}
                    DataListaDeColecoes={DataListaDeColecoes}
                    IdUserColecoes={IdUserColecoes}
                    UserId={UserId}
                    handlerSegueUsuario={handlerSegueUsuario}
                    usersFollowing={usersFollowing}
                    ISLOJA={ISLOJA}
                    resultado={resultado}
                />
                <Body
                    FotosLista={FotosLista}
                    DataListaDeColecoes={DataListaDeColecoes}
                    handlerAbreScreenDetalhes={handlerAbreScreenDetalhes}
                    GetIndexImagemSelecionada={GetIndexImagemSelecionada}
                    ISLOJA={ISLOJA}
                />
                <PopUpInfoColecao
                    modalVisible={abreInfos}
                    setModalVisible={setAbreInfos}
                    DataListaDeColecoes={DataListaDeColecoes}
                    handlerEscondeColecaoDoUser={handlerEscondeColecaoDoUser}
                    handlerAtivaNotificacoes={handlerAtivaNotificacoes}
                    idColecoesANotificar={idColecoesANotificar}
                    listaDeLojas={listaDeLojas}
                />
            </AnimatedView>
        );
    } else return null;

};

const Header = ({
    AvatarPerfil, TitleLista, Nome, StatusSeguir,
    IconName, abreModalInfo, handlerHeaderCard, DataListaDeColecoes,
    IdUserColecoes, UserId, handlerSegueUsuario, usersFollowing, ISLOJA,
    resultado
}) => {
    return (
        <>
            <TouchableOpacity onPress={() => handlerHeaderCard(DataListaDeColecoes)} style={[Row, SpaceTop]}>
                <View>
                    <Image
                        resizeMode={IMG_RESIZE}
                        style={Avatar}
                        source={{ uri: AvatarPerfil }} />
                         {resultado ?
                        <View style={indicationFollowing} />
                        :
                        null}
                </View>
                <View style={Coluna}>
                    <Text
                        style={PositiontxtTitle}>{TitleLista}</Text>
                    <Linha />
                    <Infos
                        Nome={Nome}
                        IconName={IconName}
                        StatusSeguir={StatusSeguir}
                        abreModalInfo={abreModalInfo}
                        IdUserColecoes={IdUserColecoes}
                        UserId={UserId}
                        handlerSegueUsuario={handlerSegueUsuario}
                        DataListaDeColecoes={DataListaDeColecoes}
                        usersFollowing={usersFollowing} />
                </View>
            </TouchableOpacity>
        </>
    )
};

const Body = ({ FotosLista, handlerAbreScreenDetalhes, DataListaDeColecoes, GetIndexImagemSelecionada, ISLOJA }) => {

    return (
        <>
            <FlatList
                horizontal
                data={FotosLista}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    //
                    return (
                        <TouchableOpacity onPress={() => [GetIndexImagemSelecionada(index), handlerAbreScreenDetalhes(DataListaDeColecoes)]}>
                            <Image style={ImagensColecao} source={{ uri: item.uri }} />
                        </TouchableOpacity>

                    )
                }}
            />
        </>
    );

};

const Linha = () => {
    return (
        <View style={Divisor} />
    )
};

const BotaoSeguir = ({
    StatusSeguir, IdUserColecoes, UserId, handlerSegueUsuario,
    DataListaDeColecoes, usersFollowing }) => {
    var idUserColecoes = [];
    var userIDSeguindo = [];

    idUserColecoes = IdUserColecoes;

    usersFollowing?.map((item) => {
        userIDSeguindo.push(item.id_user_sendo_seguido);
    });
    //console.log({idUserColecoes, userIDSeguindo})
    // <Text style={TxtBotao}>{result ? 'Seguindo' : 'Seguir'}</Text>
    //

    const result = userIDSeguindo.includes(idUserColecoes);

    return (
        <>
            {IdUserColecoes === UserId ? null :
                <TouchableOpacity onPress={() => handlerSegueUsuario(DataListaDeColecoes)}>
                </TouchableOpacity>

            }
        </>
    )
};

const Infos = ({
    Nome, IconName, StatusSeguir, abreModalInfo,
    IdUserColecoes, UserId, handlerSegueUsuario,
    DataListaDeColecoes, usersFollowing
}) => {

    return (
        <View style={[Row, SpaceLeft]}>
            <Text
                numberOfLines={1}
                style={TxtNomeUser}>{Nome}</Text>

            <BotaoSeguir
                StatusSeguir={StatusSeguir}
                IdUserColecoes={IdUserColecoes}
                UserId={UserId}
                handlerSegueUsuario={handlerSegueUsuario}
                DataListaDeColecoes={DataListaDeColecoes}
                usersFollowing={usersFollowing}
            />

            <Icone
                style={BotaoArrowDown}
                onPress={() => abreModalInfo()}
                nameIcone={IconName}
                tamanhoIcon={20}
                corIcone={colors.white} />

        </View>
    )
};

