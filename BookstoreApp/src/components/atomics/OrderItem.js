import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { getOrderStatusText } from '../../utils/common';
import { useNavigation } from '@react-navigation/native';

function OrderItem(props) {

    const { order } = props;
    const navigation = useNavigation();

    const { id, orderNumber, createdAt, orderStatus, items = [] } = order;

    return (
        <TouchableOpacity style={styles.container} onPress={
            ()=>{
                navigation.navigate("OrderDetailScreen",{
                    id
                })
            }
        }>
            <View style={styles.titleCtn}>
                {items.map(b => {
                    return <Text style={styles.title}>{b.item?b.item.title:'(Sản phẩm không tồn tại)'}</Text>
                })}
            </View>
            <Text style={styles.text}>Mã đơn hàng: {orderNumber}</Text>
            <Text style={styles.text}>Ngày đặt hàng: {moment(createdAt).format(DATE_TIME_VN_24H)}</Text>
            <Text style={styles.text}>Trạng thái: {getOrderStatusText(orderStatus)}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderBottomWidth: 1
    },
    titleCtn: {
        marginBottom: 8
    },
    title: {
        fontSize: 15,
        fontWeight: '700'
    },
    text: {
        color: '#626063'
    }
})

export default OrderItem;