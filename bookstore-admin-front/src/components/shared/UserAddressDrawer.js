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
            title={isCreating?"Th??m ?????a giao h??ng m???i":"C???p nh???t ?????a ch??? giao h??ng"}
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
                    label="T??n ng?????i nh???n"
                    rules={[{ required: true, message: 'T??n ng?????i nh???n kh??ng ???????c ????? tr???ng' }]}
                >
                    <Input placeholder="Nh???p h??? t??n" name="fullname" value={inputs.fullName} onChange={(e) => { e.persist(); setInputs(prev => ({ ...prev, fullName: e.target.value })) }} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="S??? ??i???n tho???i"
                    rules={[{ required: true, message: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng' }]}
                >
                    <Input placeholder="Nh???p s??? ??i???n tho???i" name="phone" value={inputs.phone}
                        style={{ width: '100%' }} onChange={(e) => { e.persist(); setInputs(prev => ({ ...prev, phone: e.target.value })) }}
                    />
                </Form.Item>
                <Form.Item
                    name="province"
                    label="Ch???n t???nh/th??nh ph???"
                    rules={[{ required: true, message: 'Tr?????ng n??y kh??ng ???????c ????? tr???ng' }]}
                >
                    <Select name="province" loading={provinceLoading} value={inputs.province} onChange={(value) => {
                        setInputs(prev => ({ ...prev, province: value }))
                    }}>
                        <Option value="">Ch???n t???nh/th??nh ph???</Option>
                        {provinces.getProvinces && provinces.getProvinces.length && provinces.getProvinces.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="district"
                    label="Ch???n qu???n/huy???n"
                    rules={[{ required: true, message: 'Tr?????ng n??y kh??ng ???????c ????? tr???ng' }]}
                >
                    <Select loading={loadingDistricts} value={inputs.district} onChange={(value) => {
                        setInputs(prev => ({ ...prev, district: value }))
                    }}>
                        <Option value="">Ch???n qu???n/huy???n</Option>
                        {inputs.province && dataDistricts.getDistricts && dataDistricts.getDistricts.length && dataDistricts.getDistricts.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ward"
                    label="Ch???n ph?????ng/x??"
                    rules={[{ required: true, message: 'Tr?????ng n??y kh??ng ???????c ????? tr???ng' }]}
                >
                    <Select loading={loadingWards} value={inputs.ward} onChange={(value) => {
                        setInputs(prev => ({ ...prev, ward: value }))
                    }}>
                        <Option value="">Ch???n ph?????ng/x??</Option>
                        {inputs.district && dataWards.getWards && dataWards.getWards.length && dataWards.getWards.map(item => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="address"
                    label="?????a ch???"
                    rules={[{ required: true, message: 'Tr?????ng n??y kh??ng ???????c ????? tr???ng' }]}
                >
                    <TextArea rows={3} placeholder="V?? d???: S??? 24, ph??? B???ch Mai" name="address" value={inputs.address}
                        onChange={(e) => { e.persist(); setInputs(prev => ({ ...prev, address: e.target.value })) }} />
                </Form.Item>
                {isCreating&&<Button htmlType="submit" loading={creatingUserAddress} type="primary">Th??m</Button>}
                {!isCreating&&<Button htmlType="submit" loading={updatingUserAddress} type="primary">C???p nh???t</Button>}
            </Form>
        </Drawer>
    )
}

export default UserAddressDrawer;