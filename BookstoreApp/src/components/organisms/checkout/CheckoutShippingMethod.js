import React from 'react';
import { TouchableOpacity, Text, FlatList, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';

const shippingMethods = [{
    id: 'STD_DELIVERY',
    name: 'Giao hàng tiêu chuẩn'
},{
        id: 'FAST_DELIVERY',
        name: 'Giao hàng nhanh trong 4h'
}]

function CheckoutShippingMethod(props) {

    const { shippingMethod, setCheckoutData } = props;

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
        onPress={() => setCheckoutData(prev => ({ ...prev, shippingMethod: item }))}>
            <Text style={{fontWeight: '700'}}>{item.name}</Text>
            {shippingMethod .id=== item.id && <Icon size={13} color={'green'} containerStyle={{
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
                    <Text style={{ fontWeight: 'bold' }}>Chọn phương thức giao hàng</Text>
                </View>}
            renderItem={renderItem}
            data={shippingMethods}>

        </FlatList>
    )
}

export default CheckoutShippingMethod;