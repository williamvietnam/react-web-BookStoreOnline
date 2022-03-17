import React, { useEffect } from 'react';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import { Dimensions, useWindowDimensions, StyleSheet, View, Text, Image } from 'react-native';
import HomeScreenContent from '../components/organisms/HomeScreenContent';
import NavBar from '../components/molecules/shared/NavBar';
import { COLOR_PRIMARY } from '../constants';
import { useDispatch } from 'react-redux';
import {initCart} from '../redux/actions/cartAction';
import AsyncStorage from '@react-native-community/async-storage';

const images = {
    logo: require('../assets/images/logo.png'),
    background: require('../assets/images/header_bg_2.jpg'), // Put your own image here
};

const { width, height } = Dimensions.get('window');

const IS_IPHONE_X = height === 812 || height === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 50;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    logo: {
        width: 60,
        height: 35
    }
});

const HomeScreen = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        async function getCartData() {
            const bsCartJSON = await AsyncStorage.getItem('bs_cart');
            let cartItems = [];
            try {
                cartItems = JSON.parse(bsCartJSON);
                if (!Array.isArray(cartItems)) {
                    cartItems = [];
                }
            } catch{
                cartItems = [];
            }
            dispatch(initCart(cartItems));
        }
        getCartData();
    });

    return (
        <View style={styles.container}>
            <ReactNativeParallaxHeader
                headerMinHeight={HEADER_HEIGHT}
                headerMaxHeight={125}
                extraScrollHeight={20}
                navbarColor={COLOR_PRIMARY}
                title={<View style={{ marginTop: 45 }}><Image source={images.logo} style={styles.logo} /></View>}
                backgroundImage={images.background}
                backgroundImageScale={1.2}
                renderNavBar={() => <NavBar />}
                renderContent={() => <HomeScreenContent />}
                alwaysShowTitle={false}
                containerStyle={styles.container}
                contentContainerStyle={styles.contentContainer}
                innerContainerStyle={styles.container}
                scrollViewProps={{
                    onScrollBeginDrag: () => console.log('onScrollBeginDrag'),
                    onScrollEndDrag: () => console.log('onScrollEndDrag'),
                }}
            />
        </View>
    );
}

export default HomeScreen;