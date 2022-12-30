import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { Text } from './Text';

const css = StyleSheet.create({
    ImgStoryStyle: {
        width: 60,
        height: 60,
        borderRadius: 60,
    },
    BotaoStoryVisto: {
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginBottom: 5
    },
    BotaoStoryNaoVisto: {
        backgroundColor: colors.primary,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        width: 65,
        height: 65,
    },
    Centralizacao: {
        alignItems: 'center'
    },
    txtStory: {
        fontSize: 12,
        marginLeft: -10
    }
});

const txtStory = [css.txtStory];
const Centralizacao = [css.Centralizacao];
const ImgStoryStyle = [css.ImgStoryStyle];
const BotaoStoryVisto = [css.BotaoStoryVisto];
const BotaoStoryNaoVisto = [css.BotaoStoryNaoVisto];

export const CircleStory = ({ DataStorys, MostrarNomes, handlerAbreStory }) => {

    const StoryPostado = DataStorys?.StoryPostado;
    const visto = DataStorys?.visto;
    const NomeLoja = DataStorys?.NomeLoja;

    const verificaSeStoryFoiVisto = (visto) => {
        switch (visto) {
            case true:
                return BotaoStoryVisto
                break;
            case false:
                return BotaoStoryNaoVisto
                break;
        }
    }

    return (
        <Container>
            <TouchableOpacity
                onPress={() => handlerAbreStory(DataStorys)}
                style={verificaSeStoryFoiVisto(visto)}>
                <Image
                    resizeMode='cover'
                    style={ImgStoryStyle}
                    source={{ uri: StoryPostado }} />
            </TouchableOpacity>
            <TextNames
                NomeLoja={NomeLoja}
                MostrarNomes={MostrarNomes} />
        </Container>
    );
}

const Container = ({ children }) => {
    return (
        <View style={Centralizacao}>
            {children}
        </View>
    )
}

const TextNames = ({ NomeLoja, MostrarNomes }) => {

    const verificaCondicoesNames = (txt) => {
        switch (txt) {
            case true:
                return NomeLoja;
                break;
            case false:
                return null;
                break;
        }
    }

    return (
        <Text style={txtStory}>{verificaCondicoesNames(MostrarNomes)}</Text>

    )
}
