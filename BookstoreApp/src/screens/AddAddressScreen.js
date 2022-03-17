import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Input, Button } from 'react-native-elements';
import { COLOR_BUTTON_PRIMARY, ERROR_OCCURED } from '../constants';
import { Picker } from '@react-native-community/picker';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { GET_PROVINCES, GET_DISTRICTS, GET_WARDS, CREATE_USER_ADDRESS } from '../api/userAddressApi';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showToast } from '../utils/common';

function AddAddressScreen(props) {
    const route = useRoute();
    const navigation = useNavigation();

    const { refetch, screen } = route.params;

    const [inputs, setInputs] = useState({
        fullName: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        ward: '',
    });

    const [createUserAddress, { loading: creatingUserAddress }] = useMutation(CREATE_USER_ADDRESS, {
        onCompleted(data) {
            refetch();
            showToast("Thêm thành công");
            if (screen) {
                navigation.navigate(screen);
            } else {
                navigation.navigate("AddressListScreen");
            }
        },
        onError(error) {
            showToast(ERROR_OCCURED);
        }
    })

    const { data: provinces = {}, loading: provinceLoading } = useQuery(GET_PROVINCES, {
        onError(error) {
            // message.error("")
            console.log(error)
        }
    });

    let [getDistricts, { loading: loadingDistricts, data: dataDistricts = {} }] = useLazyQuery(GET_DISTRICTS, {
        onError(error) {
            console.log(error)
        }
    })

    let [getWards, { loading: loadingWards, data: dataWards = {} }] = useLazyQuery(GET_WARDS, {
        onError(error) {
            console.log(error)
        }
    })

    useEffect(() => {
        if (inputs.province)
            getDistricts({
                variables: {
                    provinceId: inputs.province
                }
            })
        else {
            setInputs(prev => ({
                ...prev,
                district: ''
            }))
        }
    }, [inputs.province]);

    useEffect(() => {
        if (inputs.district)
            getWards({
                variables: {
                    districtId: inputs.district
                }
            })
        else {
            setInputs(prev => ({
                ...prev,
                ward: ''
            }))
        }
    }, [inputs.district]);

    function handleInputChanges(name, value) {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <View style={styles.container}>
            <HeaderBackAction title="Thêm địa chỉ mới" />
            <ScrollView style={[styles.scene]} >
                <Input
                    label="Họ tên"
                    value={inputs.fullName}
                    onChangeText={(val) => handleInputChanges('fullName', val)}
                    inputStyle={{ fontSize: 16 }}
                    labelStyle={{ fontSize: 14, color: '#000' }}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    placeholder="Họ tên"
                />
                <Input
                    label="Số điện thoại"
                    inputStyle={{ fontSize: 16 }}
                    labelStyle={{ fontSize: 14, color: '#000' }}
                    value={inputs.phone}
                    onChangeText={(val) => handleInputChanges('phone', val)}
                    keyboardType="number-pad"
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    placeholder="Số điện thoại"
                />
                <Input
                    label="Địa chỉ"
                    value={inputs.address}
                    onChangeText={(val) => handleInputChanges('address', val)}
                    inputStyle={{ fontSize: 16 }}
                    labelStyle={{ fontSize: 14, color: '#000' }}
                    inputContainerStyle={{ padding: 0, margin: 0, height: 32 }}
                    placeholder="Địa chỉ nhận hàng"
                />
                <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
                    <Text style={{ color: "#000", fontWeight: 'bold' }}>Tỉnh/Thành phố</Text>
                    <View style={{ borderBottomWidth: 0.2, resizeMode: 'contain' }}>
                        <Picker selectedValue={inputs.province} onValueChange={val => {
                            handleInputChanges('province', val);
                            setInputs(prev => ({
                                ...prev,
                                district: '',
                                ward: ''
                            }))
                        }}
                            style={styles.picker} itemStyle={styles.pickerItem}>
                            <Picker.Item label={`Chọn tỉnh/thành`} value={''}></Picker.Item>
                            {provinces.getProvinces && provinces.getProvinces.length && provinces.getProvinces.map(item => (
                                <Picker.Item key={item.id} label={item.name} value={item.id}></Picker.Item>
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
                    <Text style={{ color: "#000", fontWeight: 'bold' }}>Quận/Huyện</Text>
                    {loadingDistricts ? <ActivityIndicator animating /> : <View style={{ borderBottomWidth: 0.2, resizeMode: 'contain' }}>
                        <Picker selectedValue={inputs.district} onValueChange={val => {
                            handleInputChanges('district', val);
                            setInputs(prev => ({
                                ...prev,
                                ward: ''
                            }))
                        }}
                            style={styles.picker} itemStyle={styles.pickerItem}>
                            <Picker.Item label={`Chọn quận/huyện`} value={''}></Picker.Item>
                            {dataDistricts.getDistricts && dataDistricts.getDistricts.length && dataDistricts.getDistricts.map(item => (
                                <Picker.Item key={item.id} label={item.name} value={item.id}></Picker.Item>
                            ))}
                        </Picker>
                    </View>}
                </View>
                <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
                    <Text style={{ color: "#000", fontWeight: 'bold' }}>Phường/Xã</Text>
                    {loadingWards ? <ActivityIndicator animating /> : <View style={{ borderBottomWidth: 0.2, resizeMode: 'contain' }}>
                        <Picker selectedValue={inputs.ward} onValueChange={val => {
                            handleInputChanges('ward', val);
                        }}
                            style={styles.picker} itemStyle={styles.pickerItem}>
                            <Picker.Item label={`Chọn phường/xã`} value={''}></Picker.Item>
                            {dataWards.getWards && dataWards.getWards.length && dataWards.getWards.map(item => (
                                <Picker.Item key={item.id} label={item.name} value={item.id}></Picker.Item>
                            ))}
                        </Picker>
                    </View>}
                </View>
            </ScrollView>
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' }}>
                <Button onPress={() => createUserAddress({
                    variables: {
                        data: {
                            ...inputs
                        }
                    }
                })}
                    buttonStyle={{ backgroundColor: COLOR_BUTTON_PRIMARY }}
                    title="Thêm địa chỉ mới" loading={creatingUserAddress} />
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: 'flex',
        width: '100%',
        backgroundColor: '#ccc',
    },
    scene: {
        flex: 1,
        paddingHorizontal: 10,
        marginBottom: 8,
        paddingTop: 8,
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: COLOR_BUTTON_PRIMARY,
        width: '70%',
        alignSelf: 'center'
    },
    picker: {
        borderColor: '#000',
        borderBottomWidth: 1,
        marginVertical: 0,
        padding: 0,
        height: 32,
        color: '#000',
    },
    pickerItem: {
        fontSize: 10,
    }
});

export default AddAddressScreen;