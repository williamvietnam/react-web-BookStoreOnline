import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { COLOR_PRIMARY, COLOR_BUTTON_LINK, COLOR_BUTTON_PRIMARY } from '../constants';
import StepIndicator from 'react-native-step-indicator';
import { Icon, Button } from 'react-native-elements';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CheckoutAddress from '../components/molecules/checkout/CheckoutAddress';
import AddressListCheckout from '../components/organisms/checkout/AddressListCheckout';
import CheckoutShippingMethod from '../components/organisms/checkout/CheckoutShippingMethod';
import CheckoutPaymentMethod from '../components/organisms/checkout/CheckoutPaymentMethod';
import OrderConfirmation from '../components/organisms/checkout/OrderConfirmation';
import { showToast } from '../utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../redux/actions/cartAction';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ORDER } from '../api/orderApi';

const { width, height } = Dimensions.get('window');

const labels = ["Địa chỉ giao hàng", "Phương thức giao hàng", "Phương thức thanh toán", "Xác nhận & Đặt hàng"];
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: COLOR_BUTTON_LINK,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: 'green',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: 'green',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: 'green',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: COLOR_BUTTON_LINK,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: COLOR_BUTTON_LINK
}

function calculateTitle(currentPosition) {
    switch (currentPosition) {
        case 0: return "Địa chỉ giao hàng";
        case 1: return "Phương thức giao hàng";
        case 2: return "Phương thức thanh toán";
        case 3: return "Xác nhận & Đặt hàng"
    }
}
function CheckoutScreen(props) {



    const dispatch = useDispatch();
    const [checkoutData, setCheckoutData] = useState({
        paymentMethod: {
            id: 'COD',
            name: 'Thanh toán tiền mặt khi nhận hàng'
        },
        shippingMethod: {
            id: 'STD_DELIVERY',
            name: 'Giao hàng tiêu chuẩn'
        },
        shippingAddress: {}
    });
    const [currentPosition, setCurrentPosition] = useState(0)
    const navigation = useNavigation();

    function onClickBack() {
        if (currentPosition === 0) {
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        } else if (currentPosition > 3) {
            return;
        } else {
            setCurrentPosition(prev => prev - 1);
        }
    }

    function onNext() {
        if (currentPosition >= 3) return;
        setCurrentPosition(prev => prev + 1)
    }

    function isBtnNextDisabled() {
        switch (currentPosition) {
            case 0:
                if (!checkoutData.shippingAddress.id) {
                    return true
                }
                return false;
            case 1:
                if (!checkoutData.shippingMethod.id) {
                    return true
                }
                return false;
            case 2:
                if (!checkoutData.paymentMethod.id) {
                    return true
                }
                return false;
        }
    }

    const [createOrder, { loading: creatingOrder, data: dataCreateOrder = {} }] = useMutation(CREATE_ORDER, {
        onError(error) {
            console.log(error.toString());
            showToast("Có lỗi xảy ra khi đặt hàng")
        },
        onCompleted(data) {
            if (data.createOrder) {
                showToast("Đặt hàng thành công");
                navigation.navigate('OrderDetailScreen', {
                    id: data.createOrder.id
                })
                // history.push(`/auth/account/order/${data.createOrder.id}`);
                dispatch(resetCart());
            }
        }
    });

    const { cart } = useSelector(state => ({
        cart: state.cart
    }));

    useFocusEffect(useCallback(() => {
        if (cart.cartTotalQty === 0) {
            navigation.navigate("TabScreen", {
                screen: 'Cá nhân'
            })
        }
    }));

    const onSubmit = () => {
        createOrder({
            variables: {
                data: {
                    shippingMethod: checkoutData.shippingMethod.id,
                    paymentMethod: checkoutData.paymentMethod.id,
                    shippingAddress: checkoutData.shippingAddress.id,
                    items: cart.items.map(item => ({
                        book: item.id,
                        quantity: item.qty
                    }))
                }
            }
        });
    }

    return (
        <View style={styles.container}>
            <HeaderBackAction
                onClickBack={onClickBack}
                title={calculateTitle(currentPosition)} />
            <View style={styles.stepsCtn}>
                <StepIndicator
                    stepCount={4}
                    customStyles={customStyles}
                    currentPosition={currentPosition}
                    labels={labels}
                />
            </View>
            {currentPosition === 0 && <AddressListCheckout
                shippingAddress={checkoutData.shippingAddress}
                setCheckoutData={setCheckoutData} />}
            {currentPosition === 1 && <CheckoutShippingMethod
                shippingMethod={checkoutData.shippingMethod}
                setCheckoutData={setCheckoutData} />}
            {currentPosition === 2 && <CheckoutPaymentMethod
                paymentMethod={checkoutData.paymentMethod}
                setCheckoutData={setCheckoutData} />}
            {currentPosition === 3 && <OrderConfirmation setCurrentPosition={setCurrentPosition}
                checkoutData={checkoutData} />}
            {currentPosition != 3 ? <View style={styles.btnNextCtn}>
                <Button onPress={onNext} disabled={isBtnNextDisabled()}
                    title="Tiếp theo"></Button>
            </View> : <View style={styles.btnNextCtn}>
                    <Button onPress={onSubmit} loading={creatingOrder}
                        buttonStyle={{ backgroundColor: COLOR_BUTTON_PRIMARY }}
                        title="Đặt Hàng"></Button>
                </View>}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#fff',
        height: '100%'
    },
    stepsCtn: {
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    btnNextCtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: '#ccc',
        borderTopWidth: 1
    }
});

export default CheckoutScreen;
