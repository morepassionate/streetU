import { set } from 'date-fns';
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions, ImageBackground, FlatList, Image, ScrollView, TouchableOpacity, Platform, Pressable, Animated } from 'react-native';
import Icone from '../components/Icone';
import colors from '../constants/colors';
const { width, height } = Dimensions.get('screen');
import ProgressBar from 'react-native-progress-bar-horizontal';

const css = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: '92%',
        height: '80%',
        marginTop: Platform.OS === 'ios' ? '40%' : '28%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    imgStory: {
        width: width / 4 * 3.6 + 8.5,
        height: Platform.OS === 'ios' ? height / 3 * 1.9 + 50 : height / 4 * 2.5 + 40,
        borderRadius: 30,
    },
    imgPerfil: {
        width: 150.93,
        height: 90.72,
        borderRadius: 15,
        position: 'absolute',
        bottom: -20,
        right: 0,
        left: width / 4 * 1.1 + 2
    },
    PressLeft:{
        height: '90%',
        width: '45%',
        position: 'absolute',
        left: 0
    },
    PressRight:{
        height: '90%',
        width: '45%',
        position: 'absolute',
        right: 0
    },

});

const modalView = [css.modalView];
const centeredView = [css.centeredView];
const imgStory = [css.imgStory];
const imgPerfil = [css.imgPerfil];
const PressLeft = [css.PressLeft];
const PressRight = [css.PressRight];

var indexDaLista = 0;

export const ScreenOpenStory = ({ modalVisible, setModalVisible, storys, abreScreenStorys, indexImg, setIndexImg }) => {
    const imgRef = useRef();
    const [indexed, setIndex] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            imgRef.current?.scrollToOffset({
                offset: indexImg * width / 4 * 3.68,
                animated: true
            });
        }, 400)
    }, [modalVisible, indexImg]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (indexImg > indexDaLista) {
                abreScreenStorys();
            } else if (modalVisible) {
                setIndexImg(indexImg + 1)
            }
        }, 11000);

        return () => {
            clearTimeout(timer);
        }
    }, [indexImg]);

    const scrollToIndex = (index) => {
        setIndex(0);
        if (index > indexDaLista || index < 0) {
            abreScreenStorys()
        } else {
            setIndexImg(index)
            imgRef.current?.scrollToOffset({
                offset: index * width / 4 * 3.68,
                animated: true
            });
        }
    }

    return (
        <View style={centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={modalView}>
                    <FlatList
                        horizontal
                        ref={imgRef}
                        data={storys}
                        pagingEnabled
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            indexDaLista = index
                            return (
                                <>
                                    <View>
                                        <Image
                                            resizeMode='cover'
                                            source={{ uri: item.story_image }}
                                            style={imgStory} />
                                        <TouchableOpacity>
                                            <Image
                                                resizeMode='cover'
                                                source={{ uri: item.image_perfil_loja }}
                                                style={imgPerfil}
                                            />
                                        </TouchableOpacity>
                                        <Progress height={2} index={indexed} setIndex={setIndex}/>
                                        <GoLeft scrollToIndex={scrollToIndex} indexImg={indexImg}/>
                                        <GoRight scrollToIndex={scrollToIndex} indexImg={indexImg}/>
                                        <Icone
                                            nameIcone={'close'}
                                            tamanhoIcon={25}
                                            corIcone={colors.primary}
                                            onPress={() => abreScreenStorys()}
                                            style={{ position: 'absolute', right: 15, top: 10 }}
                                        />
                                    </View>
                                </>
                            )
                        }}
                    />
                </View>
            </Modal>
        </View>
    )
}

const Progress = ({ height, index, setIndex }) => {

    const [wid, setWid] = useState(10);

    useEffect(() => {
        const interval = setInterval(() => {
            if (wid === 450) return setIndex(0);
            setIndex(index + 1)
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [index]);

    useEffect(() => {
        setWid(index * 250 / 5)
    }, [index]);

    return (
        <View style={{ position: 'absolute', bottom: 60 }}>
            <View style={{
                height,
                width: width,
                backgroundColor: colors.cinzaTxt,
                borderRadius: height,
                overflow: 'hidden'
            }}>
                <Animated.View style={{
                    height, width: wid, borderRadius: 30, backgroundColor: colors.primary
                }} />

            </View>
        </View>
    )
};

const GoLeft = ({scrollToIndex, indexImg}) => {
    return (
        <TouchableOpacity
            style={PressLeft}
            onPress={() => scrollToIndex(indexImg - 1)} />
    )
};

const GoRight = ({scrollToIndex, indexImg}) => {
    return (
        <TouchableOpacity
            style={PressRight}
            onPress={() => scrollToIndex(indexImg + 1)} />
    )
}; 