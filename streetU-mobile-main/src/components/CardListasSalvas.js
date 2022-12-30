import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import colors from '../constants/colors';
import { AnimatedView } from './AnimatedView';
import { Divisor } from './Divisor';
import { Text } from './Text';

const { width } = Dimensions.get('screen');

const css = StyleSheet.create({
    containerCard: {
        flexDirection: 'row',
        width: width,
        paddingBottom: 15,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15
    },
    coluna: {
        flexDirection: 'column',
        width: '78%',
    },
    Avatar: {
        width: 77,
        height: 82,
        borderRadius: 10,
    },
    spaceLeft: {
        marginLeft: 10
    },
    TxtRight: {
        textAlign: 'right',
        marginLeft: 10,
        marginRight: 10
    },
    Outline: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.white,
        alignSelf: 'flex-end',
        alignItems: 'center',
        marginTop: 20
    }
});

const coluna = [css.coluna];
const Avatar = [css.Avatar];
const Outline = [css.Outline];
const TxtRight = [css.TxtRight];
const card = [css.containerCard];
const spaceLeft = [css.spaceLeft];

export const CardListasSalvas = ({ DataListaDeColecoes, handlerSalvaColecaoEmLista }) => {

    const AvatarPerfil = DataListaDeColecoes?.AvatarPerfil;
    const TitleLista = DataListaDeColecoes?.TitleLista;
    const Views = DataListaDeColecoes?.Views;  

    return (
        <TouchableOpacity onPress={()=> handlerSalvaColecaoEmLista(DataListaDeColecoes)}>
            <Card>
                <Thumbnail AvatarPerfil={AvatarPerfil} />
                <View style={[coluna, spaceLeft]}>
                    <Text style={TxtRight}>{TitleLista}</Text>
                    <Divisor duration={800} />

                    <View style={Outline}>
                        <Text style={TxtRight}>{Views} views</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    )
}

const Thumbnail = ({ AvatarPerfil }) => {
    return (
        <Image style={Avatar} source={{ uri: AvatarPerfil }} />
    )
}

const Card = ({ children }) => {
    return (
        <AnimatedView duration={1600} style={card}>
            {children}
        </AnimatedView>
    )
}

