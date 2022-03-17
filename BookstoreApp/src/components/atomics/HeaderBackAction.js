import React from 'react';
import { Icon, Badge } from 'react-native-elements';
import { View, Dimensions, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { COLOR_PRIMARY, COLOR_BUTTON_PRIMARY } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import CartNavigation from './CartNavigation';

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
        overflow: 'visible',
        display: "flex",
        flexDirection: 'row',
        backgroundColor: COLOR_PRIMARY,
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700'
    },
    headerLeft: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'visible'
    },
})


function HeaderBackAction(props) {
    const { title, showRight, onClickMore, showRightOptions = {}, hideBack, onClickBack } = props;
    const navigation = useNavigation();
    const { hideSearch, hideMore, hideHome, hideCart } = showRightOptions;

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {!hideBack && <TouchableHighlight style={{ borderRadius: 100, padding: 8, marginRight: 12 }}
                    underlayColor="rgba(255,255,255,0.2)" onPress={() => {
                        if (!onClickBack) {
                            if (navigation.canGoBack())
                                navigation.goBack()
                        }else{
                            onClickBack();
                        }
                    }}>
                    <Icon type="antdesign" size={18} name="arrowleft" color="#fff" />
                </TouchableHighlight>}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            {showRight && <View style={styles.headerRight}>
                {!hideSearch && <TouchableHighlight style={{ borderRadius: 100, padding: 8 }}
                    underlayColor="rgba(255,255,255,0.2)" onPress={() => {
                        navigation.navigate("TabScreen", {
                            screen: "Tìm kiếm"
                        });
                    }}>
                    <Icon type="antdesign" size={18} name="search1" color="#fff" />
                </TouchableHighlight>}
                {!hideHome && <TouchableHighlight style={{ borderRadius: 100, padding: 8 }}
                    underlayColor="rgba(255,255,255,0.2)" onPress={() => navigation.navigate("TabScreen", {
                        screen: "Trang chủ"
                    })}>
                    <Icon type="antdesign" size={18} name="home" color="#fff" />
                </TouchableHighlight>}
                {!hideCart && <CartNavigation />}
                {!hideMore && <TouchableHighlight style={{ borderRadius: 100, padding: 8 }}
                    underlayColor="rgba(255,255,255,0.2)" onPress={onClickMore}>
                    <Icon type="feather" size={18} name="more-horizontal" color="#fff" />
                </TouchableHighlight>}
            </View>}
        </View>
    )

}

export default HeaderBackAction;