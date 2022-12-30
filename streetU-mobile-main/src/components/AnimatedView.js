import React from 'react';
import { View , StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

const ViewAnimated = Animatable.createAnimatableComponent(View);

export const AnimatedView = ({ duration, children, ...rest }) => {
    return (
        <ViewAnimated animation={'fadeIn'} duration={duration} {...rest}>
            {children}
        </ViewAnimated>
    )
}
