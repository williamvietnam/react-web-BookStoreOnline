import React from 'react';
import { View, FlatList, StyleSheet, ScrollView, Text } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/molecules/cart/CartItem';
import { Divider, Button } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import { COLOR_BUTTON_PRIMARY } from '../constants';
import Empty from '../components/atomics/Empty';
import { useNavigation } from '@react-navigation/native';
import { useToken } from '../hooks/customHooks';

function CartScreen(props) {

    const { cart } = useSelector(state => ({
        cart: state.cart
    }));
    const dispatch = useDispatch();
    const { items, adding, cartTotalQty, cartSubTotal } = cart;

    const renderCartItem = ({ item, index }) => {
        return <CartItem book={item} key={item.id}
            hideBorderBottom={index === items.length - 1} />
    }

    const navigation = useNavigation();
    const [, , tokenValid] = useToken();

    return (
        <View style={styles.container}>
            <HeaderBackAction title={`Giỏ hàng (${cartTotalQty})`} />
            <FlatList style={styles.section} ListEmptyComponent={
                <View style={{ marginTop: 50 }}>
                    <Empty emptyText="Bạn chưa có sản phẩm nào trong giỏ hàng" />
                </View>
            }
                data={items} renderItem={renderCartItem}></FlatList>
            {/* <ScrollView style={styles.ScrollView}>
                <View style={styles.section}>
                    {items.map((item, index) => <CartItem book={item} key={item.id}
                        hideBorderBottom={index === items.length - 1} />)}
                </View>
                <Divider style={styles.sectionDivider} />
                <View style={{
                    ...styles.section,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingVertical: 8
                }}>
                    <Text>Tạm tính</Text>
                    <NumberFormat value={cartSubTotal} suffix={`đ`}
                        renderText={value => <Text style={styles.oldPrice}>{value}</Text>} displayType={'text'}
                        thousandSeparator={true} />
                </View>
                <Divider style={styles.sectionDivider} />
            </ScrollView> */}
            {items.length > 0 && <><Divider style={styles.sectionDivider} />
                <View style={{
                    ...styles.section,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingVertical: 8
                }}>
                    <Text>Tạm tính</Text>
                    <NumberFormat value={cartSubTotal} suffix={`đ`}
                        renderText={value => <Text style={styles.oldPrice}>{value}</Text>} displayType={'text'}
                        thousandSeparator={true} />
                </View>
                <Divider style={styles.sectionDivider} />
                <View style={{
                    backgroundColor: '#fff',
                    // borderTopWidth: 1,
                    borderColor: '#ccc'
                }}>
                    <View style={{
                        ...styles.section,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        paddingVertical: 8
                    }}>
                        <Text>Thành tiền</Text>
                        <NumberFormat value={cartSubTotal} suffix={`đ`}
                            renderText={value => <Text style={styles.grandTotal}>{value}</Text>} displayType={'text'}
                            thousandSeparator={true} />
                    </View>
                    <View style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        paddingBottom: 12
                    }}><Button onPress={() => {
                        if (!tokenValid) {
                            navigation.navigate("LoginSignupScreen", {
                                from: {
                                    stack: 'CartScreen'
                                }
                            });
                        } else {
                            navigation.navigate("CheckoutScreen");
                        }
                    }}
                        buttonStyle={{ backgroundColor: COLOR_BUTTON_PRIMARY }}
                        title="Tiến Hành Đặt Hàng"></Button></View>
                </View>
            </>}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    section: {
        paddingHorizontal: 12
    },
    sectionDivider: {
        height: 6,
        backgroundColor: '#ccc'
    },
    ScrollView: {
        backgroundColor: '#fff',
    },
    subTotalCtn: {

    },
    grandTotal: {
        color: COLOR_BUTTON_PRIMARY,
        fontWeight: '700',
        fontSize: 18
    }
})

export default CartScreen;