import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { COLOR_PRIMARY, COLOR_BUTTON_PRIMARY, COLOR_BUTTON_LINK, DATE_VN } from '../constants';
import { Input, Icon, Button, CheckBox } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN, SIGNUP } from '../api/authApi';
import { showToast } from '../utils/common';
import AsyncStorage from '@react-native-community/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useToken } from '../hooks/customHooks';

const Login = (props) => {

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const { route } = props;
    const navigation = useNavigation();
    console.log(route.params)
    const [login, { loading: loggingIn }] = useMutation(LOGIN, {
        onError(err) {
            showToast("Có lỗi xảy ra, vui lòng thử lại sau" + err.message);
        },
        // fetchPolicy: 'no-cache',
        async onCompleted(res) {
            console.log(res)
            if (res.login.statusCode === 200) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(res.login.user));
                await AsyncStorage.setItem('token', res.login.token);
                if (route.params && route.params.from) {
                    navigation.navigate(route.params.from.stack, route.params.from.screen ? {
                        screen: route.params.from.screen,
                        params: route.params.from.params
                    } : route.params.from.params);
                } else {
                    navigation.navigate("TabScreen", {
                        screen: "Cá nhân"
                    })
                }
            } else if (res.login.statusCode === 400) {
                showToast(res.login.message);
            } else if (res.login.statusCode === 405) {
                showToast(res.login.message);
                // await AsyncStorage.setItem('userInfo', JSON.stringify(res.login.user));
                // history.push('/email-activation');
                // dispatch(loginFailed());
            }
        }
    });

    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: false,
        password: false
    });

    function onLoginPressed() {
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
        if (!inputs.password) {
            setErrors(prev => ({
                ...prev,
                password: true
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                password: false
            }));
        }
        if (!inputs.email || !inputs.password) return;
        console.log(inputs)
        login({
            variables: {
                data: {
                    email: inputs.email,
                    password: inputs.password
                }
            }
        })
    }

    const pwdRef = useRef();

    return (
        <ScrollView style={[styles.scene]} >
            <Input
                label="Email/Username"
                inputStyle={{ fontSize: 13 }}
                labelStyle={{ fontSize: 14 }}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                value={inputs.email}
                onChangeText={(email) => setInputs(prev => ({
                    ...prev,
                    email
                }))}
                errorStyle={{
                    opacity: errors.email ? 1 : 0
                }}
                onSubmitEditing={() => pwdRef.current.focus()}
                renderErrorMessage
                errorMessage="Email không được để trống"
                placeholder="Email/Username"
                leftIcon={<Icon type='materialicon' size={20} name='email' />}
            />
            <Input
                placeholder="Mật khẩu"
                label="Mật khẩu"
                labelStyle={{ fontSize: 14 }}
                inputStyle={{ fontSize: 13 }}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                onChangeText={(password) => setInputs(prev => ({
                    ...prev,
                    password
                }))}
                ref={pwdRef}
                renderErrorMessage
                errorStyle={{
                    opacity: errors.password ? 1 : 0
                }}
                onSubmitEditing={onLoginPressed}
                secureTextEntry={secureTextEntry}
                errorMessage="Mật khẩu không được để trống"
                leftIcon={<Icon type='materialicon' size={20} name='lock' />}
                rightIcon={<TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
                    <Icon type='font-awesome-5' name={secureTextEntry ? 'eye' : 'eye-slash'} size={20} />
                </TouchableWithoutFeedback>}
            />
            <Button loading={loggingIn} onPress={onLoginPressed}
                buttonStyle={styles.button} title="ĐĂNG NHẬP"></Button>
            <TouchableOpacity style={{ alignSelf: 'center', marginTop: 18 }} onPress={()=>navigation.navigate("ForgotPasswordScreen")}>
                <Text style={{ color: COLOR_BUTTON_LINK }}>Quên mật khẩu?</Text>
            </TouchableOpacity>
        </ScrollView>)
};

const Signup = (props) => {

    const { route } = props;
    const navigation = useNavigation();
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [inputs, setInputs] = useState({
        birthdate: undefined,
        gender: true,
        fullName: '',
        phone: '',
        email: '',
        username: '',
        password: ''
    });

    function handleInputChange(name,value){
        setInputs(prev=>({
            ...prev,
            [name]: value
        }))
    }

    const [signup, {loading}] = useMutation(SIGNUP, {
        onError(){
            showToast("Có lỗi xảy ra khi tạo tài khoản");
        },
        async onCompleted(data){
            if (data.signUp&&data.signUp.statusCode!==200){
                showToast(data.signUp.message);
            }else{
                await AsyncStorage.setItem('userInfo', JSON.stringify(data.signUp.user));
                await AsyncStorage.setItem('token', data.signUp.token);
                if (route.params && route.params.from) {
                    navigation.navigate(route.params.from.stack, route.params.from.screen ? {
                        screen: route.params.from.screen,
                        params: route.params.from.params
                    } : route.params.from.params);
                } else {
                    navigation.navigate("TabScreen", {
                        screen: "Cá nhân"
                    })
                }
            }
        }
    });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
        username: false
    });

    function onSignupPressed() {
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
        if (!inputs.password) {
            setErrors(prev => ({
                ...prev,
                password: true
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                password: false
            }));
        }
        if (!inputs.username) {
            setErrors(prev => ({
                ...prev,
                username: true
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                username: false
            }));
        }
        if (!inputs.email || !inputs.password||!inputs.username) return;
        signup({
            variables: {
                data: {
                    ...inputs,
                }
            }
        })
    }

    return (
        <ScrollView style={[styles.scene]} >
            <Input
                label="Họ tên"
                inputStyle={{ fontSize: 13 }}
                labelStyle={{ fontSize: 14 }}
                value={inputs.fullName}
                onChangeText={(val)=>handleInputChange('fullName',val)}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                placeholder="Họ tên"
                leftIcon={<Icon type='materialicon' size={20} name='person' />}
            />
            <Input
                label="Số điện thoại"
                inputStyle={{ fontSize: 13 }}
                labelStyle={{ fontSize: 14 }}
                value={inputs.phone}
                onChangeText={(val)=>handleInputChange('phone',val)}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                placeholder="Số điện thoại"
                leftIcon={<Icon type='materialicon' size={20} name='phone' />}
            />
            <Input
                label="Email"
                inputStyle={{ fontSize: 13 }}
                labelStyle={{ fontSize: 14 }}
                value={inputs.email}
                onChangeText={(val)=>handleInputChange('email',val)}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                placeholder="Email"
                renderErrorMessage
                errorStyle={{
                    opacity: errors.email ? 1 : 0
                }}
                errorMessage="Email không được để trống"
                leftIcon={<Icon type='materialicon' size={20} name='email' />}
            />
            <Input
                label="Username"
                inputStyle={{ fontSize: 13 }}
                labelStyle={{ fontSize: 14 }}
                value={inputs.username}
                onChangeText={(val)=>handleInputChange('username',val)}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                placeholder="Username"
                renderErrorMessage
                errorStyle={{
                    opacity: errors.username ? 1 : 0
                }}
                errorMessage="Username không được để trống"
                leftIcon={<Icon type='materialicon' size={20} name='person' />}
            />
            <Input
                placeholder="Mật khẩu"
                label="Mật khẩu"
                labelStyle={{ fontSize: 14 }}
                inputStyle={{ fontSize: 13 }}
                value={inputs.password}
                renderErrorMessage
                errorStyle={{
                    opacity: errors.password ? 1 : 0
                }}
                errorMessage="Mật khẩu không được để trống"
                onChangeText={(val)=>handleInputChange('password',val)}
                inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                secureTextEntry={secureTextEntry}
                leftIcon={<Icon type='materialicon' size={20} name='lock' />}
                rightIcon={<TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
                    <Icon type='font-awesome-5' name={secureTextEntry ? 'eye' : 'eye-slash'} size={20} />
                </TouchableWithoutFeedback>}
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
                containerStyle={{ padding: 0, marginBottom: 24, backgroundColor: '#fff',borderWidth: 0  }}
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
                    containerStyle={{ padding: 0, marginBottom: 24, backgroundColor: '#fff',borderWidth: 0 }}
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
            <Button buttonStyle={styles.button} 
            onPress={onSignupPressed}
            loading={loading}
             title="ĐĂNG KÝ"></Button>
        </ScrollView>
    )
};

const initialLayout = { width: Dimensions.get('window').width };

function LoginSignupScreen(props) {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'login', title: 'ĐĂNG NHẬP' },
        { key: 'signup', title: 'ĐĂNG KÝ' },
    ]);

    const route = useRoute();
    const navigation = useNavigation();

    const renderScene = SceneMap({
        login: () => <Login route={route} />,
        signup: () => <Signup route={route} />,
    });

    const [,,tokenValid] = useToken();

    if (tokenValid){
        navigation.navigate("TabScreen", {
            screen: 'Cá nhân'
        })
    }

    return (
        <View style={{ height: '100%', backgroundColor: '#fff' }}>
            <HeaderBackAction title="Đăng nhập / Đăng ký" />
            <TabView sceneContainerStyle={{ height: '100%' }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={props => <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: COLOR_PRIMARY, height: 3 }}
                    style={{ backgroundColor: '#d7d9db' }}
                    labelStyle={{ color: '#000', fontWeight: '700' }}
                />}
                initialLayout={initialLayout}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        paddingHorizontal: 10,
        marginVertical: 8,
        height: '100%',
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: COLOR_BUTTON_PRIMARY,
        width: '70%',
        alignSelf: 'center'
    }
});

export { LoginSignupScreen as default, Login, Signup };