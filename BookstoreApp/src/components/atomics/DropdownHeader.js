import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const IS_IPHONE_X = height === 812 || height === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 50;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
    dropDownCtn: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.8)',
        right: 0,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        top: HEADER_HEIGHT,
        zIndex: 30
    },
    dropDownItem: {
        display: 'flex',
        paddingVertical: 6,
        paddingHorizontal: 8,
        paddingRight: 26,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dropDownItemText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 13
    }
})

function DropDownHeader(props) {

    const navigation = useNavigation();
    const { hideHome, hideBook, hideBestSeller, hideAccount, showHeart } = props;
    return (
        <View style={styles.dropDownCtn}>
            {!hideHome && <TouchableOpacity style={styles.dropDownItem} onPress={() => navigation.navigate("TabScreen", {
                screen: 'Trang chủ'
            })}>
                <Icon type="antdesign" size={18} name="home" color="#fff" />
                <Text style={styles.dropDownItemText}>Trở về Trang chủ</Text>
            </TouchableOpacity>}
            {!hideBook && <TouchableOpacity style={styles.dropDownItem}
                onPress={() => navigation.navigate("TabScreen", {
                    screen: 'Sách'
                })}>
                <Icon type="feather" size={18} name="book" color="#fff" />
                <Text style={styles.dropDownItemText}>Sách</Text>
            </TouchableOpacity>}
            {!hideBestSeller && <TouchableOpacity style={styles.dropDownItem}
                onPress={() => navigation.navigate("TabScreen", {
                    screen: 'Bán chạy'
                })}>
                <Icon type="feather" size={18} name="star" color="#fff" />
                <Text style={styles.dropDownItemText}>Bán chạy</Text>
            </TouchableOpacity>}
            {showHeart && <TouchableOpacity style={styles.dropDownItem} onPress={showHeart}>
                <Icon type="feather" size={18} name="heart" color="#fff" />
                <Text style={styles.dropDownItemText}>Yêu thích</Text>
            </TouchableOpacity>}
            {!hideAccount && <TouchableOpacity style={styles.dropDownItem} onPress={() => navigation.navigate("TabScreen", {
                screen: "Cá nhân"
            })}>
                <Icon type="feather" size={18} name="user" color="#fff" />
                <Text style={styles.dropDownItemText}>Cá nhân</Text>
            </TouchableOpacity>}
        </View>
    )

}

export default DropDownHeader;