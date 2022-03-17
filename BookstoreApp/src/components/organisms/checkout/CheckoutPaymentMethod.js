import React from 'react';
import { TouchableOpacity, Text, FlatList, View } from 'react-native';
import { Icon } from 'react-native-elements';

const paymentMethods = [{
    id: 'COD',
    name: 'Thanh toán tiền mặt khi nhận hàng'
}]

function CheckoutPaymentMethod(props) {

    const { paymentMethod, setCheckoutData } = props;

    function renderItem({ item }) {
        return <TouchableOpacity style={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: '#ccc',
            borderBottomWidth: 1,
        }}
        onPress={() => setCheckoutData(prev => ({ ...prev, paymentMethod: item }))}>
            <Text style={{fontWeight: '700'}}>{item.name}</Text>
            {paymentMethod.id === item.id && <Icon size={13} color={'green'} containerStyle={{
            }} type="antdesign" name='checkcircle'></Icon>}
        </TouchableOpacity>
    }

    return (
        <FlatList
            ListHeaderComponent={
                <View style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8, borderTopWidth: 1,
                    borderColor: '#ccc'
                }}>
                    <Text style={{ fontWeight: 'bold' }}>Chọn phương thức thanh toán</Text>
                </View>}
            renderItem={renderItem}
            data={paymentMethods}>

        </FlatList>
    )
}

export default CheckoutPaymentMethod;