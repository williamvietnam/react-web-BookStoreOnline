import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { TouchableHighlight, Text } from 'react-native';
import { COLOR_BUTTON_PRIMARY } from '../../constants';
import { useNavigation } from '@react-navigation/native';

function CartNavigation(props) {

    const {cart} = useSelector(state=>({
        cart: state.cart
    }));
    const navigation = useNavigation();

    return (
        <TouchableHighlight style={{ borderRadius: 100, padding: 8 }} onPress={()=>{navigation.navigate('CartScreen')}}
        underlayColor="rgba(255,255,255,0.2)" >
        <><Icon type="feather" size={18} name="shopping-cart" color="#fff" />
            {cart.cartTotalQty>0&&<Text style={{
                position: 'absolute', padding: 3,
                borderRadius: 100, color: '#fff',
                minWidth: 17, textAlign: 'center',
                right: 0, fontSize: 10, backgroundColor: COLOR_BUTTON_PRIMARY
            }}
        >{cart.cartTotalQty}</Text>}</>
    </TouchableHighlight>
    )
}

export default CartNavigation;