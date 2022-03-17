import React from 'react';
import { Header as RNHeader, Icon } from 'react-native-elements';
import { StyleSheet, Dimensions, View, TouchableHighlight } from 'react-native';
import NavBar from '../../molecules/shared/NavBar';
import CartNavigation from '../../atomics/CartNavigation';
import SearchBar from '../../atomics/SearchBar';
import { COLOR_PRIMARY } from '../../../constants';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const IS_IPHONE_X = height === 812 || height === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 50;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        maxHeight: HEADER_HEIGHT,
        marginTop: 0,
        paddingTop: 0,
        display: "flex",
        flexDirection: 'row',
        backgroundColor: COLOR_PRIMARY,
        alignItems: 'center',
        paddingRight: 10,
    },
    headerRight: {
        display: "flex",
        justifyContent: 'center'
    }
})

function Header(props) {
    const { hideCart, searchBarRef, style = {}, onClickBack, showMore, onClickMore,
        showBackBtn, searchKeyword, setSearchKeyWord, showCancel } = props;
    const navigation = useNavigation();

    return (
        <View style={{ ...styles.header, ...style }}>
            {showBackBtn && <TouchableHighlight style={{ borderRadius: 100, padding: 8 }}
                underlayColor="rgba(255,255,255,0)" onPress={() => {
                    if (onClickBack) {
                        onClickBack();
                    } else if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                }}>
                <Icon type="antdesign" size={18} name="arrowleft" color="#fff" />
            </TouchableHighlight>}
            <SearchBar searchBarRef={searchBarRef} searchKeyword={searchKeyword} showCancel={showCancel}
                setSearchKeyWord={setSearchKeyWord} />
            {!hideCart && <CartNavigation />}
            {showMore && <TouchableHighlight style={{ borderRadius: 100, padding: 8 }}
                underlayColor="rgba(255,255,255,0.2)" onPress={onClickMore}>
                <Icon type="feather" size={18} name="more-horizontal" color="#fff" />
            </TouchableHighlight>}
        </View>
    )
}

export default Header;