import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Divider, Image, Icon } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import { COLOR_BUTTON_PRIMARY, COLOR_BUTTON_LINK } from '../../../constants';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { calculateDiscount } from '../../../utils/common';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

function OrderConfirmation(props) {

    const { checkoutData, setCurrentPosition } = props;

    const { shippingMethod, paymentMethod, shippingAddress } = checkoutData;
    const { cart } = useSelector(state => ({
        cart: state.cart
    }));
    const { items, cartSubTotal } = cart;
    const { address, ward, district, province, fullName, phone } = shippingAddress;
    const fullAddress = `${address}, ${ward.name}, ${district.name}, ${province.name}`;
    const navigation = useNavigation();
    return (
        <ScrollView style={{
            borderColor: '#ccc',
            borderTopWidth: 1
        }}>
            <View style={styles.section}>
                <View style={styles.sectionHeaderCtn}>
                    <Text style={styles.sectionHeader}>Địa chỉ giao hàng</Text>
                    <TouchableOpacity onPress={() => setCurrentPosition(0)}>
                        <Text style={{ color: COLOR_BUTTON_LINK, fontSize: 12 }}>Thay đổi</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ marginBottom: 2 }}>{fullName}</Text>
                <Text style={{ ...styles.text, marginBottom: 2 }}>{phone}</Text>
                <Text style={{ ...styles.text, marginBottom: 2 }}>{fullAddress}</Text>
            </View>
            <Divider style={styles.sectionDivider} />
            <View style={styles.section}>
                <View style={styles.sectionHeaderCtn}>
                    <Text style={styles.sectionHeader}>Hình thức giao hàng</Text>
                    <TouchableOpacity onPress={() => setCurrentPosition(1)}>
                        <Text style={{ color: COLOR_BUTTON_LINK, fontSize: 12 }}>Thay đổi</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.text}>{shippingMethod.name}</Text>
            </View>
            <Divider style={styles.sectionDivider} />
            <View style={styles.section}>
                <View style={styles.sectionHeaderCtn}>
                    <Text style={styles.sectionHeader}>Hình thức thanh toán</Text>
                    <TouchableOpacity onPress={() => setCurrentPosition(2)}>
                        <Text style={{ color: COLOR_BUTTON_LINK, fontSize: 12 }}>Thay đổi</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.text}>{paymentMethod.name}</Text>
            </View>
            <Divider style={styles.sectionDivider} />
            <View style={{ ...styles.section, paddingHorizontal: 0 }}>
                <View style={{ ...styles.sectionHeaderCtn, paddingHorizontal: 12 }}>
                    <Text style={{ ...styles.sectionHeader }}>Thông tin đơn hàng</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate("CartScreen")}>
                        <Text style={{ color: COLOR_BUTTON_LINK, fontSize: 12 }}>Thay đổi</Text>
                    </TouchableOpacity>
                </View>
                {items.map(item => {
                    return <View style={{ ...styles.orderItem }} key={item.id}>
                        <TouchableOpacity style={styles.ctnLeft} onPress={() => {
                            navigation.navigate('BookDetailScreen', {
                                id: item.id
                            })
                        }}>
                            <Image containerStyle={styles.imgCtn} style={{
                                height: 70,
                                resizeMode: 'contain'
                            }} source={{ uri: item.thumbnail }} PlaceholderContent={<Icon type="antdesign" name="picture" />} />
                            <View style={styles.infoCtn}>
                                <Text style={styles.bookTitle}>{item.title}</Text>
                                <NumberFormat value={calculateDiscount(item.basePrice, item.discounts)[0]} suffix={`đ`}
                                    renderText={value => <Text style={styles.activePrice}>{value} <Text style={{ color: '#000', fontWeight: 'normal', fontSize: 12 }}>x {item.qty}</Text></Text>}
                                    displayType={'text'} thousandSeparator={true} />
                            </View>
                        </TouchableOpacity>
                    </View>
                })}
                <View style={{ ...styles.section, display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Tạm tính</Text>
                    <NumberFormat value={cartSubTotal} suffix={`đ`}
                        renderText={value => <Text>{value}</Text>}
                        displayType={'text'} thousandSeparator={true} />
                </View>
                <View style={{ ...styles.section, display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Phí vận chuyển</Text>
                    <NumberFormat value={shippingMethod.id==="FAST_DELIVERY"?16000:0} suffix={`đ`}
                        renderText={value => <Text>{value}</Text>}
                        displayType={'text'} thousandSeparator={true} />
                </View>
                <Divider style={styles.sectionDivider} />
                <View style={{ ...styles.section, display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Thành tiền</Text>
                    <NumberFormat value={cartSubTotal+(shippingMethod.id==="FAST_DELIVERY"?16000:0)} suffix={`đ`}
                        renderText={value => <Text style={styles.activePrice}>{value}</Text>}
                        displayType={'text'} thousandSeparator={true} />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    sectionDivider: {
        height: 6,
        backgroundColor: '#ccc'
    },
    text: {
        color: '#626063'
    },
    sectionHeader: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '700'
    },
    fs15: {
        fontSize: 15
    },
    orderItem: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    ctnLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    imgCtn: {
        paddingVertical: 4,
        display: 'flex',
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginRight: 8
    },
    infoCtn: {
    },
    bookTitle: {
        maxWidth: width - 110,
        marginBottom: 8
    },
    activePrice: {
        color: COLOR_BUTTON_PRIMARY,
        fontSize: 16,
        fontWeight: '700'
    },
    sectionHeaderCtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default OrderConfirmation;