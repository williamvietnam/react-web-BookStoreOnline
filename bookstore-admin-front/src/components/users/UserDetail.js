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
import { GET_USER_BY_ID, UPDATE_USER_ADMIN } from '../../api/authApi';
import { GET_USER_ADDRESSES, GET_USER_ADDRESSES_ADMIN, DELETE_USER_ADDRESS } from '../../api/userAddressApi';
import UserAddressDrawer from '../shared/UserAddressDrawer';

const { Panel } = Collapse;
const { Option } = Select;

function UserDetail(props) {

    const { id } = useParams();

    const history = useHistory();
    const isScrolled = useScroll(62);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [edittingAddress, setEdittingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        id: '',
        ward: ''
    });

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
        birthdate: '',
        password: '',
        role: "User"
    });

    const [rowsPerPage, setRowsPerPage] = useState({
        orders: 10,
        addresses: 10,
        wishlist: 10
    });

    const [currentPage, setCurrentPage] = useState({
        orders: 1,
        addresses: 1,
        wishlist: 1
    });

    const [showChangePassword, setShowChangePassword] = useState(false);
    const handleInputChange = (e) => {
        const { target } = e;
        const { name, value } = target;
        setAccountInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const { loading: gettingOrders, data: dataOrders = { getOrders: { orders: [] } }, refetch: refetchOrders } = useQuery(GET_ORDERS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                customer: {
                    id
                }
            },
            orderBy: "createdAt_DESC",
            first: rowsPerPage.orders,
            skip: (currentPage.orders - 1) * rowsPerPage.orders,
            selection: `
                {
                    id
                    orderNumber
                    grandTotal
                    recipientFullName
                    recipientPhone
                    paymentMethod{
                        id
                        name
                    }
                    shippingMethod{
                        id
                        name
                    }
                    customer{
                        id
                        email
                    }
                    orderStatus
                    paymentStatus
                    createdAt
                }
            `
        }
    });

    const { loading: gettingAddresses, data: dataGettingAddresses = { getUserAddressesAdmin: { addresses: [] } }, refetch: refetchAddresses } = useQuery(GET_USER_ADDRESSES_ADMIN, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                user: {
                    id
                }
            },
            orderBy: 'createdAt_DESC',
            first: rowsPerPage.addresses,
            skip: (currentPage.addresses - 1) * rowsPerPage.addresses,
            selection: `{
                id
                fullName
                phone
                province{
                    id
                    name
                }
                district{
                    id
                    name
                }
                ward{
                    id
                    name
                }
                address
            }`
        }
    });

    const [deleteUserAddress, {loading: deletingUserAddress}]= useMutation(DELETE_USER_ADDRESS,{
        onCompleted(data) {
            refetchAddresses();
            setDrawerVisible(false);
            message.success("Xóa địa chỉ thành công")
        },
        onError(error) {
            message.error(ERROR_OCCURED);
        }
    });

    const { loading, error, data = {
        getUserById: {
        }
    },
        refetch } = useQuery(GET_USER_BY_ID, {
            onError() {
                message.error("Có lỗi xảy ra khi lấy dữ liệu");
            },
            onCompleted(data) {
                setAccountInfo({ ...data.getUserById, password: '' })
            },
            variables: {
                id
            }
        });

    const columnAddresses = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            key: 'actions',
        }
    ];

    const handleDateChange = (value, dateString) => {
        setAccountInfo(prev => ({
            ...prev,
            birthdate: moment(value).format("YYYY-MM-DD")
        }));
    }
    const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER_ADMIN, {
        onCompleted(data) {
            message.success("Cập nhật thông tin thành công.")
        },
        onError(error) {
            message.error("Cập nhật thất bại, vui lòng kiểm tra lại thông tin.")
        }

    });
    const isPwdValid = accountInfo.password.length >= 8 ? true : false;
    const onUpdateUser = (e) => {
        e.preventDefault();
        if (showChangePassword && (!isPwdValid || !accountInfo.password.length)) return;
        updateUser({
            variables: {
                id,
                data: {
                    birthdate: accountInfo.birthdate,
                    gender: accountInfo.gender,
                    changePassword: showChangePassword,
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
    const createDataSourceAddresses = (addresses) => {
        if (!addresses) return [];
        return addresses.map((item, index) => {
            return {
                key: item.id,
                fullName: item.fullName,
                address: item.address,
                phone: item.phone,
                actions:<Fragment> <Button type="ghost"  onClick={()=>{
                    setEdittingAddress({
                        ...item,
                        ward: item.ward.id,
                        district: item.district.id,
                        province: item.province.id
                    })
                    setDrawerVisible(true);
                }}><EditOutlined /> &nbsp;Chỉnh sửa</Button> &nbsp;
                 <Button loading={deletingUserAddress}
                        onClick={()=>deleteUserAddress({
                            variables: {
                                id: item.id
                            }
                        })} type="danger"><DeleteOutlined /> &nbsp;Xóa</Button></Fragment>,
            }
        })
    }

    const columnOrders = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
        },
        {
            title: <div className="d-flex">
                <span className="m-r-12">Trạng thái đơn hàng</span>
                {/* <div className="d-flex" style={{flexDirection: 'column'}}>
                    <i className="fa fa-sort-asc"></i>
                    <i className="fa fa-sort-desc"></i>
                </div> */}
            </div>,
            dataIndex: 'orderStatus',
            ellipsis: true,
            colSpan: 1,
            key: 'orderStatus',
            render: (orderStatus) => {
                return {
                    children: orderStatus,
                    props: {
                        colSpan: 1
                    }
                }
            },
        },
        {
            title: <div className="d-flex">
                <span className="m-r-12">Trạng thái thanh toán</span>
                {/* <div className="d-flex" style={{flexDirection: 'column'}}>
                    <i className="fa fa-sort-asc"></i>
                    <i className="fa fa-sort-desc"></i>
                </div> */}
            </div>,
            dataIndex: 'paymentStatus',
            ellipsis: true,
            colSpan: 1,
            key: 'paymentStatus',
            render: (paymentStatus) => {
                return {
                    children: paymentStatus,
                    props: {
                        colSpan: 1
                    }
                }
            }
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'grandTotal',
            key: 'grandTotal',
        }, {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        }];
    const createDataSourceOrders = (orders) => {
        if (!orders) return [];
        return orders.map((item, index) => {
            return {
                ...item,
                orderNumber: <NavLink to={`/sale/order/edit/${item.id}`}>{item.orderNumber}</NavLink>,
                key: item.id,
                createdAt: moment(item.createdAt).format(DATE_TIME_VN_24H),
                customer: <NavLink to={`/users/edit/${item.customer.id}`}>{item.customer.email}</NavLink>,
                grandTotal: <NumberFormat value={item.grandTotal} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />,
                orderStatus: <Tag color={getOrderStatusColor(item.orderStatus)}> {getOrderStatusText(item.orderStatus)}</Tag>,
                paymentStatus: <Tag color={item.paymentStatus ? "#87d068" : "#f50"}> {item.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}</Tag>,
            }
        })
    }

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                <h3>Chi tiết người dùng - {accountInfo.fullName ? accountInfo.fullName : accountInfo.email}</h3>
                <div className="pull-right">
                    <Button type="primary" loading={updatingUser} onClick={onUpdateUser}><SaveOutlined className="m-l-2" /> Lưu</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin người dùng</b></span>} key="1" showArrow={false}>
                        {loading ? <Skeleton active /> :
                            <Row gutter={16}>
                                <form className="d-flex flex-column p-r-8 p-l-8"
                                    noValidate autoComplete="off">
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="fullName">Họ và tên</label>
                                        <Input type="text" placeholder="Họ và tên" name="fullName" onChange={handleInputChange} value={accountInfo.fullName} id="fullName" /></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="phone">Số điện thoại</label>
                                        <Input type="text" placeholder="Số điện thoại" name="phone" onChange={handleInputChange} value={accountInfo.phone} id="phone" /></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="email">Email</label>
                                        <Input type="email" placeholder="Email" name="email" id="email" onChange={handleInputChange} value={accountInfo.email} /></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="username">Tên đăng nhập</label>
                                        <Input type="text" name="username" disabled id="username" onChange={handleInputChange} value={accountInfo.username} /></div>
                                    <div className="p-b-8 d-flex flex-column"><label className="font-weight-bold" htmlFor="gender">Giới tính</label>
                                        <Radio.Group name="gender" id="gender" onChange={handleInputChange} value={accountInfo.gender}>
                                            <Radio value={true}>Nam</Radio>
                                            <Radio value={false}>Nữ</Radio>
                                        </Radio.Group></div>
                                    <div className="p-b-8 d-flex flex-column"><label className="font-weight-bold" htmlFor="isActive">Trạng thái hoạt động</label>
                                        <Radio.Group name="isActive" id="isActive" onChange={handleInputChange} value={accountInfo.isActive}>
                                            <Radio value={true}>Hoạt động</Radio>
                                            <Radio value={false}>Ngừng hoạt động</Radio>
                                        </Radio.Group></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="birthdate">Ngày sinh</label>
                                        <DatePicker className="w-100" onChange={handleDateChange} value={moment(accountInfo.birthdate)} format={DATE_VN} id="birthdate" name="birthdate" />
                                    </div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="role">Quyền</label>
                                        <Select className="w-100" onChange={(val) => setAccountInfo(prev => ({ ...prev, role: val }))} value={accountInfo.role} id="role" name="role" >
                                            <Option value="Admin">Quản trị viên</Option>
                                            <Option value="User">Khách hàng</Option>
                                        </Select>
                                    </div>
                                    <div className="p-b-8 d-flex">
                                        <AntSwitch name="changePassword" id="changePassword" onChange={() => setShowChangePassword(prev => !prev)} />
                                        <label className="font-weight-bold" htmlFor="changePassword" className="p-l-8">Đổi mật khẩu</label>
                                    </div>
                                    {showChangePassword && <Fragment>
                                        <div className="p-b-8"><label className="font-weight-bold" htmlFor="newPassword">Mật khẩu mới</label>
                                            <Input type="password" style={{
                                                borderColor: !isPwdValid ? "red" : undefined
                                            }}
                                                placeholder="Mật khẩu mới" name="newPassword" id="newPassword"
                                                onChange={handleInputChange} value={accountInfo.newPassword} />
                                            {!isPwdValid && <span className="error-txt">Mật khẩu phải chứa it nhất 8 kí tự</span>}

                                        </div>
                                    </Fragment>}
                                </form>
                            </Row>}
                    </Panel>
                    <Panel header={<span><i className="fa fa-address-book m-r-12"></i><b>Sổ địa chỉ</b></span>} key="2" showArrow={false}>
                        {loading ? <Skeleton active /> : <Fragment>
                            <Button type="primary" onClick={() => { setEdittingAddress({
                                        fullName: '',
                                        phone: '',
                                        address: '',
                                        province: '',
                                        district: '',
                                        ward: ''
                                    });setDrawerVisible(true) }}><PlusOutlined /> Thêm mới</Button>
                            <Table columns={columnAddresses}
                                rowSelection={false}
                                loading={gettingAddresses}
                                pagination={{
                                    pageSize: rowsPerPage.addresses,
                                    pageSizeOptions: ['10', '20', '50', '100'],
                                    showTotal: (total) =>
                                        `Hiển thị ${(currentPage.addresses - 1) * rowsPerPage.addresses + 1} - ${currentPage.addresses * rowsPerPage.addresses <= dataGettingAddresses.getUserAddressesAdmin.totalCount ? currentPage.addresses * rowsPerPage.addresses : dataGettingAddresses.getUserAddressesAdmin.totalCount} trên ${dataGettingAddresses.getUserAddressesAdmin.totalCount} kết quả`,
                                    showSizeChanger: true,
                                    onShowSizeChange(current, size) { this.current = 1; setRowsPerPage(prev => ({ ...prev, addresses: size })) },
                                    total: dataGettingAddresses.getUserAddressesAdmin.totalCount,
                                    onChange: (page) => { setCurrentPage(prev => ({ ...prev, addresses: page })) }
                                }}
                                dataSource={createDataSourceAddresses(dataGettingAddresses.getUserAddressesAdmin.addresses)} />
                        </Fragment>}
                    </Panel>
                    <Panel header={<span><i className="fa fa-shopping-cart m-r-12"></i><b>Đơn hàng</b></span>} key="3" showArrow={false}>
                        <Table columns={columnOrders} loading={gettingOrders}
                            rowSelection={false}
                            scroll={{ x: 1200 }}
                            bordered={true}
                            pagination={{
                                pageSize: rowsPerPage.orders,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (total) =>
                                    `Hiển thị ${(currentPage.orders - 1) * rowsPerPage.orders + 1} - ${currentPage.orders * rowsPerPage.orders <= dataOrders.getOrders.totalCount ? currentPage.orders * rowsPerPage.orders : dataOrders.getOrders.totalCount} trên ${dataOrders.getOrders.totalCount} kết quả`,
                                showSizeChanger: true,
                                onShowSizeChange(current, size) { this.current = 1; setRowsPerPage(prev => ({ ...prev, orders: size })) },
                                total: dataOrders.getOrders.totalCount,
                                onChange: (page) => { setCurrentPage(prev => ({ ...prev, orders: page })) }
                            }}
                            dataSource={createDataSourceOrders(dataOrders.getOrders.orders)} />

                    </Panel>
                </Collapse>
                <UserAddressDrawer isCreating={!edittingAddress.id} edittingAddress={edittingAddress}
                    drawerVisible={drawerVisible} setDrawerVisible={setDrawerVisible}
                    refetchUserAddresses={refetchAddresses} userId={id}/>
            </div>
        </div >

    )

}

export default UserDetail;