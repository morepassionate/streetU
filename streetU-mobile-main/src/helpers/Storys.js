import React from 'react';
import { View, StyleSheet, Platform, FlatList, Image, Touchable, TouchableOpacity } from 'react-native';
import { AnimatedView } from '../components/AnimatedView';
import { Text } from '../components/Text';
import { testStorys } from '../../DATAFAKE';
import InstaStory from 'react-native-insta-story';
import { useState } from 'react';
import { useEffect } from 'react';
import { ScreenOpenStory } from './ScreenOpenStory';
import { useRef } from 'react';

const css = StyleSheet.create({
    PaddingInBox: {
        paddingLeft: 20,
        paddingRight: 20
    },
    containerStorys: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100
    },
    PaddingX: {
        paddingHorizontal: 20
    },
    SpaceRight: {
        marginRight: 10
    }
});

const containerStorys = [css.containerStorys];
const PaddingInBox = [css.PaddingInBox];
const PaddingX = [css.PaddingX];
const SpaceRight = [css.SpaceRight];


export const Storys = () => {

    const [storiesImage, setStoriesImage] = useState([]);
    const [abreScreenStory, setAbreScreenStory] = useState(false);
    const [indexImg, setIndexImg] = useState(null);


    useEffect(() => {
        setStoriesImage(testStorys)
    }, []);

    const abreScreenStorys = (index) => {
        setIndexImg(index)
        setAbreScreenStory(abreScreenStory ? false : true);
    };

    return (
        <View style={[containerStorys, PaddingInBox]}>
            <Text style={[SpaceRight,{marginTop: -23}]}>Lojas</Text>
            <FlatList
                horizontal 
                data={storiesImage}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <>
                            <TouchableOpacity onPress={() => abreScreenStorys(index)}>
                                <Image
                                    resizeMode='cover'
                                    style={{ width: 60, height: 60, borderRadius: 60, marginRight: 15 }}
                                    source={{ uri: item.story_image }} />
                                <ScreenOpenStory
                                    modalVisible={abreScreenStory}
                                    abreScreenStorys={abreScreenStorys}
                                    setModalVisible={setAbreScreenStory}
                                    storys={storiesImage}
                                    indexImg={indexImg} 
                                    setIndexImg={setIndexImg} />
                            </TouchableOpacity>
                        </>
                    )
                }}
            />
        </View>
    )
}




{/* <InstaStory
            data={testStorys}
            duration={10}
            onStart={item => console.log(item)}
            onClose={item => console.log('close: ', item)}
            avatarTextStyle={{ color: 'white' }}
            style={{ marginTop: 25 }}
        /> */}