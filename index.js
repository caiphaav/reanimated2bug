// In index.js of a new project
import { Navigation } from 'react-native-navigation';
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Button, } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useDerivedValue,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'whitesmoke'
    },
    overlay: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    toast: {
        height: 130,
        width: '100%',
        backgroundColor: "#ff7752",
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const Toast = function ({ componentId }) {
    const progress = useSharedValue(-1);
    const translateY = useDerivedValue(() => {
        return progress.value * 130;
    });
    const animatedStyles = useAnimatedStyle(() => {
        if (progress.value == 0) {
            progress.value = withTiming(-1, null, (isFinished) => {
                if (isFinished) {
                    Navigation.dismissOverlay(componentId);
                }
            });
        }
        return {
            transform: [{ translateY: translateY.value }],
        };
    });
    useEffect(() => {
        progress.value = withTiming(0);
    }, []);
    return (
        <View style={styles.overlay}>
            <Animated.View style={[styles.toast, animatedStyles]} >
                <Text>Toast text</Text>
            </Animated.View>
        </View>
    );
};

const HomeScreen = (props) => {
    const onPress = useCallback(() =>
        Navigation.showOverlay({
            component: {
                name: 'Toast',
                options: {
                    overlay: { interceptTouchOutside: false },
                },
            },
        }), [])
    return (
        <View style={styles.root}>
            <Text>Home Screen</Text>
            <Button title="make error" onPress={onPress} />
        </View>
    );
};
Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Toast', () => Toast);


Navigation.events().registerAppLaunchedListener(async () => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'Home'
                        }
                    }
                ]
            }
        }
    });
});