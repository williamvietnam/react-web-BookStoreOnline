import React, { useState } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, View } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { showToast } from '../utils/common';
import { useToken } from '../hooks/customHooks';
import { useNavigation } from '@react-navigation/native';
import PopConfirm from '../components/atomics/PopConfirm';

function ScanScreen(props) {

    const [token] = useToken();
    const [loading, setLoading] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };
    const navigation = useNavigation();
    const [url, setUrl] = useState('');
    const onSuccess = e => {
        console.log(e);
        setUrl(e.data);
        setOverlayVisible(true);

    };
    return (
        <View style={styles.container}>
            <HeaderBackAction title="Quét QR" />
            <QRCodeScanner
                reactivate
                onRead={onSuccess}
                flashMode={RNCamera.Constants.FlashMode.auto}
            />
            <PopConfirm isVisible={overlayVisible}
                onBackdropPress={toggleOverlay}
                title="Xác nhận đã nhận hàng"
                text="Nhấn đồng ý để xác nhận rằng bạn đã nhận đầy đủ hàng?"
                loading={loading}
                onCancel={() => setOverlayVisible(false)}
                onConfirm={async () => {
                    console.log(url)
                    const orderId = url.substring(url.lastIndexOf('/')+1);
                    try {
                        setLoading(true);
                        const res = await fetch(url, {
                            bodyUsed: false,
                            method: 'POST',
                            body: null,
                            headers: {
                                "Authorization": 'Bearer ' + token
                            }
                        });
                        const resObj = await res.json();
                        setLoading(false);
                        if (resObj.status !== 200) {
                            showToast(resObj.message);
                        } else {
                            navigation.navigate("OrderDetailScreen", {
                                id: orderId,
                                canRefetch: true
                            })
                            showToast("Xác nhận đơn hàng thành công");
                        }
                    } catch (err) {
                        setLoading(false);
                        console.log(err);
                        showToast("Có lỗi xảy ra khi xác nhận đơn hàng của bạn");
                    }
                    setOverlayVisible(false);
                }}
            />
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%'
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
        height: 100
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});

export default ScanScreen;