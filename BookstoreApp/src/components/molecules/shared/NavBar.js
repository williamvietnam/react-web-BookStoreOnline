import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import SearchBar from '../../atomics/SearchBar';
import CartNavigation from '../../atomics/CartNavigation';

const {width,height} = Dimensions.get('window');

const IS_IPHONE_X = height === 812 || height === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 50;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
    navContainer: {
        height: HEADER_HEIGHT,
        marginRight: 10,
    },
    statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
    },
    navBar: {
        height: NAV_BAR_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
});

function NavBar() {
    return (
        <View style={styles.navContainer}>
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
                <SearchBar />
                <CartNavigation />
            </View>
        </View>
    )
}

export default NavBar;