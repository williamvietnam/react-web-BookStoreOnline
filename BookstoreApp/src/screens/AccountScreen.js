import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, Icon, Divider, Button } from 'react-native-elements';
import { COLOR_PRIMARY } from '../constants';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { useNavigation } from '@react-navigation/native';
import isTokenValid from '../utils/tokenValidation';
import { useToken } from '../hooks/customHooks';
import AsyncStorage from '@react-native-community/async-storage';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#ccc'
    },
    section: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 8,
        display: "flex",
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    avaCtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12
    },
    ava: {
        marginRight: 14,
        backgroundColor: COLOR_PRIMARY
    },
    accountItemCtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: width,
    },
    accountItemLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountItemIcon: {
        marginRight: 12
    },
    text: {
        color: "#444145",
    },
    divider: { backgroundColor: '#ccc', height: 1, width: '100%' },
    logoutBtn: {
        backgroundColor: '#fff',
        borderWidth: 1
    },
    logoutBtnCtn: {
        paddingHorizontal: 12,
        paddingVertical: 8
    }
});

function AccountScreen(props) {
    const navigation = useNavigation();
    const [, userInfo = {}, tokenValid] = useToken();
    function navigateToLogin() {
        navigation.navigate("LoginSignupScreen")
    }
    if (tokenValid) {
        return (<View style={styles.container}>
            <HeaderBackAction hideBack title="Cá nhân" showRight showRightOptions={{
                hideSearch: true,
                hideHome: true,
                hideMore: true
            }} />
            <TouchableOpacity style={styles.section} onPress={() => {
                navigation.navigate("AccountInfoScreen")
            }}>
                <View style={styles.avaCtn}>
                    <Avatar source={{ uri: userInfo?.avatar }}
                        size="medium"
                        containerStyle={styles.ava}
                        rounded ></Avatar>
                    <View>
                        <Text style={{ fontSize: 15 }}>{userInfo?.fullName ?? userInfo?.username}</Text>
                        <Text style={{ color: "#a29da3", fontSize: 12 }}>{userInfo.email}</Text>
                    </View>
                </View>
                <Icon type="antdesign" name='right' size={12} color={COLOR_PRIMARY}></Icon>
            </TouchableOpacity>
            <View style={{
                ...styles.section,
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingHorizontal: 0,
                paddingVertical: 0
            }}>
                <TouchableOpacity style={styles.accountItemCtn} onPress={()=>navigation.navigate("OrderListScreen")}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="receipt" color="#a29da3"></Icon>
                        <Text style={styles.text}>Quản lý đơn hàng</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity onPress={()=>navigation.navigate('AddressListScreen')}
                 style={styles.accountItemCtn}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="address-book" color="#a29da3"></Icon>
                        <Text style={styles.text}>Quản lý địa chỉ</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity style={styles.accountItemCtn} onPress={()=>navigation.navigate('WishListScreen')}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="heart" color="#a29da3"></Icon>
                        <Text style={styles.text}>Sản phẩm yêu thích</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity style={styles.accountItemCtn} onPress={()=>navigation.navigate('MyReviewScreen')}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="comment-dots" color="#a29da3"></Icon>
                        <Text style={styles.text}>Nhận xét của tôi</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
            </View>
            <View style={{
                ...styles.section,
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingHorizontal: 0,
                paddingVertical: 0
            }}>
                <TouchableOpacity style={styles.accountItemCtn} onPress={()=>navigation.navigate("ScanScreen")}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="material-community" containerStyle={styles.accountItemIcon} size={22} name="qrcode-scan" color="#a29da3"></Icon>
                        <Text style={styles.text}>Quét QR</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.logoutBtnCtn}>
                <Button title="ĐĂNG XUẤT" onPress={async () => {
                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('userInfo');
                    navigation.navigate("TabScreen", {
                        screen: "Trang chủ"
                    });
                }}
                    buttonStyle={styles.logoutBtn}
                    raised
                    type="outline"></Button>
            </View>
        </View>)
    }
    return (
        <View style={styles.container}>
            <HeaderBackAction hideBack title="Cá nhân" showRight showRightOptions={{
                hideSearch: true,
                hideHome: true,
                hideMore: true
            }} />
            <TouchableOpacity style={styles.section} onPress={navigateToLogin}>
                <View style={styles.avaCtn}>
                    <Avatar icon={{ name: 'user', type: 'font-awesome' }}
                        size="medium"
                        containerStyle={styles.ava}
                        rounded ></Avatar>
                    <View>
                        <Text style={{ color: "#a29da3", fontSize: 12 }}>Chào mừng bạn đến với BookStore</Text>
                        <Text style={{ color: COLOR_PRIMARY, fontSize: 18 }}>Đăng nhập/Đăng ký</Text>
                    </View>
                </View>
                <Icon type="antdesign" name='right' size={12} color={COLOR_PRIMARY}></Icon>
            </TouchableOpacity>
            <View style={{
                ...styles.section,
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingHorizontal: 0,
                paddingVertical: 0
            }}>
                <TouchableOpacity style={styles.accountItemCtn} onPress={navigateToLogin}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="receipt" color="#a29da3"></Icon>
                        <Text style={styles.text}>Quản lý đơn hàng</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity style={styles.accountItemCtn} onPress={navigateToLogin}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="address-book" color="#a29da3"></Icon>
                        <Text style={styles.text}>Quản lý địa chỉ</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity style={styles.accountItemCtn} onPress={navigateToLogin}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="heart" color="#a29da3"></Icon>
                        <Text style={styles.text}>Sản phẩm yêu thích</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity style={styles.accountItemCtn} onPress={navigateToLogin}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="font-awesome-5" containerStyle={styles.accountItemIcon} size={22} name="comment-dots" color="#a29da3"></Icon>
                        <Text style={styles.text}>Nhận xét của tôi</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
            </View>
            <View style={{
                ...styles.section,
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingHorizontal: 0,
                paddingVertical: 0
            }}>
                <TouchableOpacity style={styles.accountItemCtn} onPress={navigateToLogin}>
                    <View style={styles.accountItemLeft}>
                        <Icon type="material-community" containerStyle={styles.accountItemIcon} size={22} name="qrcode-scan" color="#a29da3"></Icon>
                        <Text style={styles.text}>Quét QR</Text>
                    </View>
                    <Icon type="antdesign" name='right' size={10} color="#a29da3"></Icon>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export default AccountScreen;