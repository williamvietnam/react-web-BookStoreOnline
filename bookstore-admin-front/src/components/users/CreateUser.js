import React, { useState, Fragment } from 'react';
import { Collapse, Button, Form, Input, message, Switch as AntSwitch, Select, Table, Row, Col, Skeleton, Card, DatePicker, Radio, Tag } from 'antd';
import { SaveOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory, NavLink, useParams } from 'react-router-dom';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import useScroll from '../../custom-hooks/useScroll';
import NumberFormat from 'react-number-format';
import { GET_ORDER_BY_ID, GET_ORDERS } from '../../api/orderApi';
import moment from 'moment';
import { DATE_TIME_VN_24H, DATE_VN, ERROR_OCCURED } from '../../constants';
import { getOrderStatusText, getOrderStatusColor } from '../../utils/common';
import { GET_USER_BY_ID, UPDATE_USER_ADMIN, CREATE_USER_ADMIN } from '../../api/authApi';
import { GET_USER_ADDRESSES, GET_USER_ADDRESSES_ADMIN, DELETE_USER_ADDRESS } from '../../api/userAddressApi';
import UserAddressDrawer from '../shared/UserAddressDrawer';

const { Panel } = Collapse;
const { Option } = Select;

function CreateUser(props) {

    const { id } = useParams();

    const history = useHistory();
    const isScrolled = useScroll(62);

    const [selectedRowKeys, setSelectedRowKeys] = useState({
        addresses: [],
        orders: []
    });
    const [accountInfo, setAccountInfo] = useState({
        fullName: '',
        email: '',
        username: '',
        phone: '',
        gender: true,
        isActive: true,
        birthdate: new Date(),
        password: '',
        role: "User"
    });

    const handleInputChange = (e) => {
        const { target } = e;
        const { name, value } = target;
        setAccountInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }


    const handleDateChange = (value, dateString) => {
        setAccountInfo(prev => ({
            ...prev,
            birthdate: moment(value).format("YYYY-MM-DD")
        }));
    }
    const [createUser, { loading: creatingUser }] = useMutation(CREATE_USER_ADMIN, {
        onCompleted(data) {
            message.success("T???o ng?????i d??ng th??nh c??ng.");
            history.push(`/users/edit/${data.createUserAdmin.id}`)
        },
        onError(error) {
            message.error("T???o th???t b???i, vui l??ng ki???m tra l???i th??ng tin.")
        }

    });

    
    const isPwdValid = accountInfo.password.length >= 8 ? true : false;
    const onCreateUser = (e) => {
        e.preventDefault();
        if ((!isPwdValid || !accountInfo.password.length) || !accountInfo.email || !accountInfo.username||!accountInfo.email.match(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm) ) return;
        createUser({
            variables: {
                id,
                data: {
                    birthdate: accountInfo.birthdate,
                    gender: accountInfo.gender,
                    username: accountInfo.username,
                    phone: accountInfo.phone,
                    fullName: accountInfo.fullName,
                    password: accountInfo.password,
                    email: accountInfo.email,
                    isActive: accountInfo.isActive,
                    role: accountInfo.role
                }
            }
        })
    }

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                <h3>Th??m ng?????i d??ng</h3>
                <div className="pull-right">
                    <Button type="primary" loading={creatingUser} onClick={onCreateUser}><SaveOutlined className="m-l-2" /> T???o</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Th??ng tin ng?????i d??ng</b></span>} key="1" showArrow={false}>
                        <Row gutter={16}>
                            <form className="d-flex flex-column p-r-8 p-l-8"
                                noValidate autoComplete="off">
                                <div className="p-b-8"><label className="font-weight-bold" htmlFor="fullName">H??? v?? t??n</label>
                                    <Input type="text" placeholder="H??? v?? t??n" name="fullName" onChange={handleInputChange} value={accountInfo.fullName} id="fullName" /></div>
                                <div className="p-b-8"><label className="font-weight-bold" htmlFor="phone">S??? ??i???n tho???i</label>
                                    <Input type="text" placeholder="S??? ??i???n tho???i" name="phone" onChange={handleInputChange} value={accountInfo.phone} id="phone" /></div>
                                <div className="p-b-8"><label className="font-weight-bold" htmlFor="email">Email</label>
                                    <Input type="email" placeholder="Email"
                                        name="email" id="email" onChange={handleInputChange} value={accountInfo.email} /></div>
                                {!accountInfo.email && <span className="error-txt">Email kh??ng ???????c ????? tr???ng</span>}
                                {!accountInfo.email.match(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm) && <span className="error-txt">Email kh??ng ????ng ?????nh d???ng</span>}
                                <div className="p-b-8"><label className="font-weight-bold" htmlFor="username">T??n ????ng nh???p</label>
                                    <Input type="text" name="username" id="username" placeholder="T??n ????ng nh???p"
                                        onChange={handleInputChange} value={accountInfo.username} /></div>
                                <div className="p-b-8 d-flex flex-column"><label className="font-weight-bold" htmlFor="gender">Gi???i t??nh</label>
                                    <Radio.Group name="gender" id="gender" onChange={handleInputChange} value={accountInfo.gender}>
                                        <Radio value={true}>Nam</Radio>
                                        <Radio value={false}>N???</Radio>
                                    </Radio.Group></div>
                                <div className="p-b-8 d-flex flex-column"><label className="font-weight-bold" htmlFor="isActive">Tr???ng th??i ho???t ?????ng</label>
                                    <Radio.Group name="isActive" id="isActive" onChange={handleInputChange} value={accountInfo.isActive}>
                                        <Radio value={true}>Ho???t ?????ng</Radio>
                                        <Radio value={false}>Ng???ng ho???t ?????ng</Radio>
                                    </Radio.Group></div>
                                <div className="p-b-8"><label className="font-weight-bold" htmlFor="birthdate">Ng??y sinh</label>
                                    <DatePicker className="w-100" onChange={handleDateChange} value={moment(accountInfo.birthdate)} format={DATE_VN} id="birthdate" name="birthdate" />
                                </div>
                                <div className="p-b-8"><label className="font-weight-bold" htmlFor="role">Quy???n</label>
                                    <Select className="w-100" onChange={(val) => setAccountInfo(prev => ({ ...prev, role: val }))} value={accountInfo.role} id="role" name="role" >
                                        <Option value="Admin">Qu???n tr??? vi??n</Option>
                                        <Option value="User">Kh??ch h??ng</Option>
                                    </Select>
                                </div>
                                <Fragment>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="password">M???t kh???u m???i</label>
                                        <Input type="password" style={{
                                            borderColor: !isPwdValid ? "red" : undefined
                                        }}
                                            placeholder="M???t kh???u" name="password" id="password"
                                            onChange={handleInputChange} value={accountInfo.password} />
                                        {!isPwdValid && <span className="error-txt">M???t kh???u ph???i ch???a it nh???t 8 k?? t???</span>}

                                    </div>
                                </Fragment>
                            </form>
                        </Row>
                    </Panel>
                </Collapse>
            </div>
        </div >

    )

}

export default CreateUser;