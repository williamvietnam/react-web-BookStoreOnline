import React, { useState, useEffect } from 'react';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { View, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { COLOR_PRIMARY, COLOR_BUTTON_PRIMARY, COLOR_BUTTON_LINK, DATE_VN } from '../constants';
import { Input, Icon, Button, CheckBox } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { useToken } from '../hooks/customHooks';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_USER } from '../api/authApi';
import { showToast } from '../utils/common';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

function AccountInfoScreen(props) {
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [, userInfo,] = useToken();
    const { username, email, birthdate, gender, fullName, avatar, phone } = userInfo;
    const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER, {
        async onCompleted(data) {
            showToast("Cập nhật thông tin thành công.")
            await AsyncStorage.setItem('userInfo', JSON.stringify(data.updateUser));
            navigation.navigate("TabScreen", {
                screen: 'Cá nhân'
            });
        },
        onError(error) {
            showToast("Cập nhật thất bại, vui lòng kiểm tra lại thông tin.")
        }

    })
    const [inputs, setInputs] = useState({
        username,
        email,
        birthdate,
        gender,
        phone,
        fullName,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    useEffect(() => {
        setInputs(prev => ({
            ...prev,
            username,
            email,
            birthdate,
            gender,
            phone,
            fullName,
        }))
    }, [email]);

    const handleInputChange = (name, value) => {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const [validataions, setValidations] = useState({
        confirmPwdMatched: true,
        isPwdValid: true
    })

    const onUpdateUser = (e) => {
        setValidations({
            confirmPwdMatched: inputs.newPassword === inputs.confirmNewPassword,
            isPwdValid: inputs.newPassword.length >= 8 ? true : false
        })
        if (showChangePassword && (!validataions.isPwdValid || !validataions.confirmPwdMatched || !inputs.currentPassword.length)) return;
        updateUser({
            variables: {
                data: {
                    birthdate: inputs.birthdate,
                    gender: inputs.gender,
                    changePassword: showChangePassword,
                    phone: inputs.phone,
                    fullName: inputs.fullName,
                    password: inputs.newPassword,
                    currentPassword: inputs.currentPassword
                }
            }
        })
    }

    return (
        <View style={styles.container}>
            <HeaderBackAction title="Thông tin cá nhân" />
            <ScrollView style={[styles.scene]} >
                <Input
                    label="Họ tên"
                    inputStyle={{ fontSize: 13 }}
                    labelStyle={{ fontSize: 14 }}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    placeholder="Họ tên"
                    value={inputs.fullName}
                    onChangeText={val => handleInputChange("fullName", val)}
                    leftIcon={<Icon type='materialicon' size={20} name='person' />}
                />
                <Input
                    label="Số điện thoại"
                    inputStyle={{ fontSize: 13 }}
                    labelStyle={{ fontSize: 14 }}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    placeholder="Số điện thoại"
                    value={inputs.phone}
                    onChangeText={val => handleInputChange("phone", val)}
                    leftIcon={<Icon type='materialicon' size={20} name='phone' />}
                />
                <Input
                    label="Email"
                    disabled
                    value={inputs.email}
                    inputStyle={{ fontSize: 13 }}
                    labelStyle={{ fontSize: 14 }}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    placeholder="Email"
                    leftIcon={<Icon type='materialicon' size={20} name='email' />}
                />
                <Input
                    label="Username"
                    disabled
                    value={inputs.username}
                    inputStyle={{ fontSize: 13 }}
                    labelStyle={{ fontSize: 14 }}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    placeholder="Username"
                    leftIcon={<Icon type='materialicon' size={20} name='person' />}
                />
                <Input
                    placeholder="Ngày sinh"
                    label="Ngày sinh"
                    labelStyle={{ fontSize: 14 }}
                    inputStyle={{ fontSize: 13 }}
                    value={moment(inputs.birthdate).format(DATE_VN)}
                    onFocus={() => setShowDatePicker(true)}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    leftIcon={<Icon type='materialicon' size={20} name='date-range' />}
                />
                <DateTimePickerModal isVisible={showDatePicker}
                    value={inputs.birthdate}
                    onConfirm={(date) => {
                        setShowDatePicker(false);
                        setInputs(prev => ({
                            ...prev,
                            birthdate: date
                        }));
                    }}
                    mode="date" onCancel={() => setShowDatePicker(false)} />
                <View style={{ display: 'flex', flexDirection: 'row' }}><CheckBox
                    containerStyle={{ padding: 0, marginBottom: 24, borderWidth: 0, backgroundColor: '#fff' }}
                    title='Nam'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    onPress={() => setInputs(prev => ({
                        ...prev,
                        gender: true
                    }))}
                    checked={inputs.gender}
                />
                    <CheckBox
                        containerStyle={{ padding: 0, marginBottom: 24, borderWidth: 0, backgroundColor: '#fff' }}
                        title='Nữ'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() => setInputs(prev => ({
                            ...prev,
                            gender: false
                        }))}
                        checked={!inputs.gender}
                    />

                </View>
                <CheckBox
                    containerStyle={{ padding: 0, marginBottom: 24, borderWidth: 0, backgroundColor: '#fff' }}
                    title='Đổi mật khẩu'
                    checkedIcon='check-square'
                    uncheckedIcon='square-o'
                    checked={showChangePassword}
                    onPress={() => setShowChangePassword(prev => !prev)}
                />
                {showChangePassword && <><Input
                    placeholder="Mật khẩu hiện tại"
                    labelStyle={{ fontSize: 14 }}
                    inputStyle={{ fontSize: 13 }}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    secureTextEntry={secureTextEntry}
                    value={inputs.currentPassword}
                    onChangeText={(val) => handleInputChange("currentPassword", val)}
                    errorMessage="Vui lòng điền vào trường này"
                    errorStyle={{
                        opacity: inputs.currentPassword && inputs.currentPassword.length > 0 ? 0 : 1
                    }}
                    leftIcon={<Icon type='materialicon' size={20} name='lock' />}
                    rightIcon={<TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
                        <Icon type='font-awesome-5' name={secureTextEntry ? 'eye' : 'eye-slash'} size={20} />
                    </TouchableWithoutFeedback>}
                />
                    <Input
                        placeholder="Mật khẩu mới"
                        labelStyle={{ fontSize: 14 }}
                        inputStyle={{ fontSize: 13 }}
                        inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                        renderErrorMessage
                        value={inputs.newPassword}
                        errorMessage={"Mật khẩu phải chứa ít nhất 8 ký tự"}
                        errorStyle={{
                            opacity: validataions.isPwdValid ? 0 : 1
                        }}
                        onChangeText={(val) => handleInputChange("newPassword", val)}
                        secureTextEntry={secureTextEntry}
                        leftIcon={<Icon type='materialicon' size={20} name='lock' />}
                        rightIcon={<TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
                            <Icon type='font-awesome-5' name={secureTextEntry ? 'eye' : 'eye-slash'} size={20} />
                        </TouchableWithoutFeedback>}
                    />
                    <Input
                        placeholder="Xác nhận mật khẩu mới"
                        labelStyle={{ fontSize: 14 }}
                        inputStyle={{ fontSize: 13 }}
                        inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                        secureTextEntry={secureTextEntry}
                        value={inputs.confirmNewPassword}
                        onChangeText={(val) => handleInputChange("confirmNewPassword", val)}
                        errorMessage={"Xác nhận mật khẩu không trùng khớp"}
                        errorStyle={{
                            opacity: validataions.confirmPwdMatched ? 0 : 1
                        }}
                        leftIcon={<Icon type='materialicon' size={20} name='lock' />}
                        rightIcon={<TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
                            <Icon type='font-awesome-5' name={secureTextEntry ? 'eye' : 'eye-slash'} size={20} />
                        </TouchableWithoutFeedback>}
                    /></>}
            </ScrollView>
            <View style={styles.buttonCtn}>
                <Button buttonStyle={styles.button} loading={updatingUser}
                    onPress={onUpdateUser}
                    title="LƯU THAY ĐỔI"></Button>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: 'flex',
        backgroundColor: '#fff'
    },
    scene: {
        flex: 1,
        paddingHorizontal: 10,
        height: '100%',
        paddingVertical: 8,
    },
    buttonCtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderTopWidth: 1
    },
    button: {
        backgroundColor: COLOR_BUTTON_PRIMARY,
        width: '100%',
        alignSelf: 'center'
    }
});

export default AccountInfoScreen;