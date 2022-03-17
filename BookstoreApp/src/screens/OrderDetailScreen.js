import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ORDER_BY_ID, UPDATE_ORDER_STATUS } from '../api/orderApi';
import { showToast, getOrderStatusText } from '../utils/common';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, TouchableOpacity, Dimensions } from 'react-native';
import moment from 'moment';
import { Divider, Image, Icon, Button } from 'react-native-elements';
import { DATE_TIME_VN_24H, COLOR_BUTTON_PRIMARY } from '../constants';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import NumberFormat from 'react-number-format';
import PopConfirm from '../components/atomics/PopConfirm';

const { width } = Dimensions.get('window');

function OrderDetailScreen(props) {
    const route = useRoute();
    const navigation = useNavigation();
    const { id,canRefetch } = route.params;
    const { loading, data = { getOrderById: {} }, refetch } = useQuery(GET_ORDER_BY_ID, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            id
        }
    });

    const [updateOrderStatus, { error: errorUpdatingOrderStatus, loading: updatingOrderStatus }] = useMutation(UPDATE_ORDER_STATUS, {
        onError(error) {
            showToast("Có lỗi xảy ra, vui lòng thử lại sau");
        },
        onCompleted() {
            showToast("Cập nhật trạng thái đơn hàng thành công");
            refetch();
            setOverlayVisible(false);
        }
    });

    const [overlayVisible, setOverlayVisible] = useState(false);
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };
    useFocusEffect(useCallback(()=>{
        if (canRefetch){
            refetch();
        }
    },[navigation]));

    const { createdAt,orderNumber, orderStatus, grandTotal, subTotal, recipientFullName, orderSteps,
        recipientPhone, recipientWard = {}, recipientDistrict = {},
        recipientProvince = {}, recipientAddress, items = [], paymentMethod = {}, shippingMethod = {} } = data.getOrderById;
    const fullAddress = `${recipientAddress}, ${recipientWard.name}, ${recipientDistrict.name}, ${recipientProvince.name}`;

    if (loading) return (
        <View style={{ paddingTop: 150, height: '100%' }}>
            <ActivityIndicator animating />
        </View>
    )

    return (
        <View style={styles.container}>
            <HeaderBackAction title="Chi tiết đơn hàng" />
            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.fs15}>Mã đơn hàng: {orderNumber}</Text>
                    <Text style={styles.text}>Ngày đặt hàng: {moment(createdAt).format(DATE_TIME_VN_24H)}</Text>
                    <Text style={styles.text}>Trạng thái: {getOrderStatusText(orderStatus)}</Text>
                    {orderStatus!=="Canceled" &&<Button containerStyle={styles.buttonOrderStatus} title="Theo dõi đơn hàng" onPress={()=>navigation.navigate("OrderStatusScreen", {
                        id
                    })}></Button>}
                </View>
                <Divider style={styles.sectionDivider} />
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Địa chỉ giao hàng</Text>
                    <Text style={{ marginBottom: 2 }}>{recipientFullName}</Text>
                    <Text style={{ ...styles.text, marginBottom: 2 }}>{recipientPhone}</Text>
                    <Text style={{ ...styles.text, marginBottom: 2 }}>{fullAddress}</Text>
                </View>
                <Divider style={styles.sectionDivider} />
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Hình thức giao hàng</Text>
                    <Text style={styles.text}>{shippingMethod.name}</Text>
                </View>
                <Divider style={styles.sectionDivider} />
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Hình thức thanh toán</Text>
                    <Text style={styles.text}>{paymentMethod.name}</Text>
                </View>
                <Divider style={styles.sectionDivider} />
                <View style={{ ...styles.section, paddingHorizontal: 0 }}>
                    <Text style={{ ...styles.sectionHeader, paddingHorizontal: 12 }}>Thông tin đơn hàng</Text>
                    {items.map(item => {
                        return <View style={{ ...styles.orderItem }} key={item.id}>
                            <TouchableOpacity style={styles.ctnLeft} onPress={() => {
                                if (item.item) {
                                    navigation.navigate('BookDetailScreen', {
                                        id: item.item.id
                                    })
                                }
                            }}>
                                {item.item ? <Image containerStyle={styles.imgCtn} style={{
                                    height: 70,
                                    resizeMode: 'contain'
                                }} source={{ uri: item.item?.thumbnail }} PlaceholderContent={<Icon type="antdesign" name="picture" />} /> :
                                    <View style={{ ...styles.imgCtn, backgroundColor: '#ccc', alignItems: 'center' }}>
                                        <Icon style={{ height: 70 }} iconStyle={{ alignSelf: 'center', marginTop: 25, marginLeft: 17 }}
                                            type="antdesign" name="picture" /></View>}
                                <View style={styles.infoCtn}>
                                    <Text style={styles.bookTitle}>{item.item ? item.item.title : 'Sản phẩm có thể đã bị xóa'}</Text>
                                    <NumberFormat value={item.price} suffix={`đ`}
                                        renderText={value => <Text style={styles.activePrice}>{value} <Text style={{ color: '#000', fontWeight: 'normal', fontSize: 12 }}>x {item.quantity}</Text></Text>}
                                        displayType={'text'} thousandSeparator={true} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    })}
                    <View style={{ ...styles.section, display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Tạm tính</Text>
                        <NumberFormat value={subTotal} suffix={`đ`}
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
                        <NumberFormat value={grandTotal} suffix={`đ`}
                            renderText={value => <Text style={styles.activePrice}>{value}</Text>}
                            displayType={'text'} thousandSeparator={true} />
                    </View>
                </View>
            </ScrollView>
            {orderStatus !== "Completed" && orderStatus !== "Canceled" &&
                <View style={styles.cancelOrderCtn}>
                    <Button onPress={()=>setOverlayVisible(true)}
                    buttonStyle={{ backgroundColor: COLOR_BUTTON_PRIMARY }}
                        loading={updatingOrderStatus}
                        title="HỦY ĐƠN HÀNG"></Button>
                </View>}
            <PopConfirm isVisible={overlayVisible}
                onBackdropPress={toggleOverlay}
                title="Hủy đơn hàng"
                text="Bạn thực sự muốn hủy đơn hàng này?"
                loading={updatingOrderStatus}
                onCancel={() => setOverlayVisible(false)}
                onConfirm={() => updateOrderStatus({
                    variables: {
                        orderId: id,
                        orderStatus: "Canceled"
                    }
                })}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor: '#fff'
    },
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
    cancelOrderCtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderTopWidth: 1
    },
    buttonOrderStatus: {
        width: '50%',
        marginTop: 12,
        alignSelf: 'center'
    }
})

export default OrderDetailScreen;