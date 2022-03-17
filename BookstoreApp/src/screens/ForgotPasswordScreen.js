import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { Input, Button, Icon } from 'react-native-elements';
import { COLOR_BUTTON_PRIMARY } from '../constants';
import { useMutation } from '@apollo/react-hooks';
import { SEND_PASSWORD_VIA_EMAIL } from '../api/authApi';
import { showToast } from '../utils/common';

function ForgotPasswordScreen(props) {

    const [inputs, setInputs] = useState({
        email: '',
    })
    const [errors, setErrors] = useState({
        email: false,
    });

    const [sendPasswordViaEmail, { loading }] = useMutation(SEND_PASSWORD_VIA_EMAIL, {
        onError() {
            showToast("Có lỗi xảy ra, vui lòng thử lại sau")
        },
        onCompleted(data) {
            if (data.sendPasswordViaEmail) {
                if (data.sendPasswordViaEmail.statusCode !== 200) {
                    showToast(data.sendPasswordViaEmail.message)
                } else {
                    showToast("Vui lòng kiểm tra hộp thư của bạn");
                }
            }
        }
    })

    return (
        <View style={styles.container}>
            <HeaderBackAction title="Quên mật khẩu" />
            <View style={styles.innerCtn}>
                <Input
                label="Email"
                inputStyle={{ fontSize: 13 }}
                labelStyle={{ fontSize: 14 }}
                value={inputs.email}
                onChangeText={(val) => setInputs({ email: val })}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                placeholder="Email"
                renderErrorMessage
                errorStyle={{
                    opacity: errors.email ? 1 : 0
                }}
                errorMessage="Email không được để trống"
                leftIcon={<Icon type='materialicon' size={20} name='email' />}
            />
                <Button onPress={() => {
                    if (!inputs.email) {
                        setErrors(prev => ({
                            ...prev,
                            email: true
                        }));
                    } else {
                        setErrors(prev => ({
                            ...prev,
                            email: false
                        }));
                    }
                    if (!inputs.email) return;
                    sendPasswordViaEmail({
                        variables: {
                            email: inputs.email
                        }
                    })
                }}
                    loading={loading}
                    titleStyle={{width: '100%'}}
                    loadingStyle={{ width: '100%' }}
                    buttonStyle={{ width: '75%', backgroundColor: COLOR_BUTTON_PRIMARY }}
                    title="LẤY LẠI MẬT KHẨU"
                ></Button>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        backgroundColor: '#fff',
    },
    innerCtn: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        alignItems: 'center'
    }
})

export default ForgotPasswordScreen;