import React, { useState, useRef } from 'react'
import { TouchableOpacity, View, StyleSheet, Text, TextInput } from 'react-native';
import { Image, Icon, Overlay, Input, Text as RNText } from 'react-native-elements';
import { calculateDiscount } from '../../../utils/common';
import NumberFormat from 'react-number-format';
import { COLOR_BUTTON_PRIMARY, COLOR_PRIMARY } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { removeItemFromCartSuccessfully, changeCartItemQtyAsync } from '../../../redux/actions/cartAction';
import { useApolloClient } from '@apollo/react-hooks';

function CartItem(props) {

    const { book, hideBorderBottom } = props;
    const { id, title, thumbnail, basePrice, discounts = [], qty } = book;
    const [discountedPrice, discountRate, discountAmount] = calculateDiscount(basePrice, discounts);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const client = useApolloClient();
    const [overlayVisible, setOverlayVisible] = useState(false);
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };
    const [qtyToAdd, setQtyToAdd] = useState(qty);
    return (
        <View style={{ ...styles.container, borderBottomWidth: hideBorderBottom ? 0 : 1 }}>
            <TouchableOpacity style={styles.ctnLeft} onPress={() => {
                navigation.navigate('BookDetailScreen', {
                    id
                })
            }}>
                <Image containerStyle={styles.imgCtn} style={{
                    height: 70,
                    resizeMode: 'contain'
                }} source={{ uri: thumbnail }} PlaceholderContent={<Icon type="antdesign" name="picture" />} />
                <View style={styles.infoCtn}>
                    <Text style={styles.bookTitle}>{title}</Text>
                    <NumberFormat value={discountedPrice} suffix={`đ`}
                        renderText={value => <Text style={styles.activePrice}>{value}</Text>}
                        displayType={'text'} thousandSeparator={true} />
                    {discountRate > 0 && <NumberFormat value={basePrice} suffix={`đ`}
                        renderText={value => <Text style={styles.oldPrice}>{value}</Text>} displayType={'text'}
                        thousandSeparator={true} />}
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 8,
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{
                            backgroundColor: '#ccc',
                            height: 28,
                            paddingHorizontal: 12
                        }} onPress={() => dispatch(changeCartItemQtyAsync(client, book, qty - 1))}>
                            <Text style={{ textAlignVertical: 'center', fontSize: 20 }}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity value={qty.toString()}
                            style={{
                                backgroundColor: '#ddd',
                                paddingVertical: 6,
                                height: 28,
                                paddingHorizontal: 12
                            }}
                            onPress={() => setOverlayVisible(true)}
                        ><Text style={{ fontSize: 12 }}>{qty}</Text></TouchableOpacity>
                        <Overlay isVisible={overlayVisible}
                            overlayStyle={{ paddingHorizontal: 24, alignItems: 'center' }}
                            onBackdropPress={toggleOverlay}>
                            <RNText h4 h4Style={{ fontSize: 20 }}>Nhập số lượng sách cần mua</RNText>
                            <Input 
                                keyboardType='number-pad'
                                onChangeText={(txt) => {
                                    const val = Math.abs(parseInt(txt));
                                    if (isNaN(val)){
                                        setQtyToAdd(1)
                                    }else{
                                        setQtyToAdd(val);
                                    }
                                }}
                                containerStyle={{ width: 100 }} />
                            <TouchableOpacity onPress={() => {
                                dispatch(changeCartItemQtyAsync(client, book, qtyToAdd));
                                setOverlayVisible(false);
                            }}
                                style={{ alignSelf: 'flex-end' }}>
                                <Text style={{ color: COLOR_PRIMARY, fontWeight: '700' }}>ĐỒNG Ý</Text>
                            </TouchableOpacity>
                        </Overlay>
                        <TouchableOpacity style={{
                            backgroundColor: '#ccc',
                            paddingVertical: 4,
                            height: 28,
                            paddingHorizontal: 12
                        }} onPress={() => dispatch(changeCartItemQtyAsync(client, book, qty + 1))}>
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.ctnRight}>
                <TouchableOpacity onPress={() => dispatch(removeItemFromCartSuccessfully(id))}>
                    <Icon type="antdesign" size={17} name="close"></Icon>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12
    },
    ctnLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    ctnRight: {
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
        maxWidth: 275,
        marginBottom: 8
    },
    activePrice: {
        color: COLOR_BUTTON_PRIMARY,
        fontSize: 16,
        fontWeight: '700'
    },
    oldPrice: {
        color: '#626063',
        textDecorationLine: 'line-through'
    }
});

export default CartItem;