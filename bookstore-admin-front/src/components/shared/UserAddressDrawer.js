import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, Form, message, Select } from 'antd';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { GET_PROVINCES, GET_DISTRICTS, GET_WARDS, CREATE_USER_ADDRESS, UPDATE_USER_ADDRESS } from '../../api/userAddressApi';
import TextArea from 'antd/lib/input/TextArea';
import { ERROR_OCCURED } from '../../constants';
const { Option } = Select;

function UserAddressDrawer(props) {
    const { drawerVisible, setDrawerVisible, refetchUserAddresses, isCreating=true,userId, edittingAddress={
        fullName: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        id: ''
    }} = props;
    const [inputs, setInputs] = useState({...edittingAddress});

    useEffect(()=>{
        setInputs({
            ...edittingAddress
        })
    },[edittingAddress.id]);

    const [createUserAddress, { loading: creatingUserAddress }] = useMutation(CREATE_USER_ADDRESS, {
        onCompleted(data) {
            refetchUserAddresses();
            setDrawerVisible(false)
        },
        onError(error) {
            message.error(ERROR_OCCURED);
        }
    });

    const [updateUserAddress, { loading: updatingUserAddress }] = useMutation(UPDATE_USER_ADDRESS, {
        onCompleted(data) {
            refetchUserAddresses();
            setDrawerVisible(false)
        },
        onError(error) {
            message.error(ERROR_OCCURED);
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

    const onClose = () => {
        // this.setState({
        //   visible: false,
        // });
    };

    return (
        <Drawer
            title={isCreating?"Thêm địa giao hàng mới":"Cập nhật địa chỉ giao hàng"}
            width={400}
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Form layout="vertical" onSubmit={(e) => {
                e.preventDefault();
                if (isCreating) {
                    createUserAddress({
                        variables: {
                            user: userId,
                            data: {
                                ...inputs
                            }
                        }
                    })
                }else{
                    updateUserAddress({
                        variables: {
                            id: inputs.id,
                            data: {
                                fullName: inputs.fullName,
                                phone: inputs.phone,
                                address: inputs.address,
                                province: inputs.province,
                                district: inputs.district,
                                ward: inputs.ward
                            }
                        }
                    })
                }
            }}>
                <Form.Item
                    name="fullName"
                    label="Tên người nhận"
                    rules={[{ required: true, message: 'Tên người nhận không được để trống' }]}
                >
                    <Input placeholder="Nhập họ tên" name="fullname" value={inputs.fullName} onChange={(e) => { e.persist(); setInputs(prev => ({ ...prev, fullName: e.target.value })) }} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
                >
                    <Input placeholder="Nhập số điện thoại" name="phone" value={inputs.phone}
                        style={{ width: '100%' }} onChange={(e) => { e.persist(); setInputs(prev => ({ ...prev, phone: e.target.value })) }}
                    />
                </Form.Item>
                <Form.Item
                    name="province"
                    label="Chọn tỉnh/thành phố"
                    rules={[{ required: true, message: 'Trường này không được để trống' }]}
                >
                    <Select name="province" loading={provinceLoading} value={inputs.province} onChange={(value) => {
                        setInputs(prev => ({ ...prev, province: value }))
                    }}>
                        <Option value="">Chọn tỉnh/thành phố</Option>
                        {provinces.getProvinces && provinces.getProvinces.length && provinces.getProvinces.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="district"
                    label="Chọn quận/huyện"
                    rules={[{ required: true, message: 'Trường này không được để trống' }]}
                >
                    <Select loading={loadingDistricts} value={inputs.district} onChange={(value) => {
                        setInputs(prev => ({ ...prev, district: value }))
                    }}>
                        <Option value="">Chọn quận/huyện</Option>
                        {inputs.province && dataDistricts.getDistricts && dataDistricts.getDistricts.length && dataDistricts.getDistricts.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ward"
                    label="Chọn phường/xã"
                    rules={[{ required: true, message: 'Trường này không được để trống' }]}
                >
                    <Select loading={loadingWards} value={inputs.ward} onChange={(value) => {
                        setInputs(prev => ({ ...prev, ward: value }))
                    }}>
                        <Option value="">Chọn phường/xã</Option>
                        {inputs.district && dataWards.getWards && dataWards.getWards.length && dataWards.getWards.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Trường này không được để trống' }]}
                >
                    <TextArea rows={3} placeholder="Ví dụ: Số 24, phố Bạch Mai" name="address" value={inputs.address}
                        onChange={(e) => { e.persist(); setInputs(prev => ({ ...prev, address: e.target.value })) }} />
                </Form.Item>
                {isCreating&&<Button htmlType="submit" loading={creatingUserAddress} type="primary">Thêm</Button>}
                {!isCreating&&<Button htmlType="submit" loading={updatingUserAddress} type="primary">Cập nhật</Button>}
            </Form>
        </Drawer>
    )
}

export default UserAddressDrawer;