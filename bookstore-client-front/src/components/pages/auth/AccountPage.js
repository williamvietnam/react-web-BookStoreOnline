import React, { Fragment, useState } from 'react';
import { Input, DatePicker, Radio, Button,Switch as AntSwitch , Tabs, message } from 'antd';
import { DATE_VN } from '../../../constants';
import { connect } from 'react-redux';
import moment from 'moment';
import { updateUserSucessfully } from '../../../redux/actions/authAction';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_USER } from '../../../api/authApi';
import OrderList from '../orders/OrderListPage';
import AccountSideBar from '../../account/AccountSideBar';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import OrderDetail from '../orders/OrderDetail';
import UserAddressList from '../../userAddress/UserAddressList';
import UserBookReviewList from '../../reivews/UserBookReviewList';
import UserWishList from '../../products/UserWishList';
import OrderStatus from '../orders/OrderStatus';

const { TabPane } = Tabs;

function AccountPage(props) {

    const { user: userInfo = {} } = props.auth;
    const { username, email, birthdate, gender, fullName, avatar, phone } = userInfo;
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER, {
        onCompleted(data) {
            message.success("Cập nhật thông tin thành công.")
            props.updateUserSucessfully(data.updateUser)
        },
        onError(error) {
            message.error("Cập nhật thất bại, vui lòng kiểm tra lại thông tin.")
        }

    })
    const [accountInfo, setAccountInfo] = useState({
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

    const confirmPwdMatched = accountInfo.newPassword === accountInfo.confirmNewPassword;
    const isPwdValid = accountInfo.newPassword.length >= 8 ? true : false;

    const onUpdateUser = (e) => {
        e.preventDefault();
        if (showChangePassword && (!isPwdValid || !confirmPwdMatched || !accountInfo.currentPassword.length)) return;
        updateUser({
            variables: {
                data: {
                    birthdate: accountInfo.birthdate,
                    gender: accountInfo.gender,
                    changePassword: showChangePassword,
                    phone: accountInfo.phone,
                    fullName: accountInfo.fullName,
                    password: accountInfo.newPassword,
                    currentPassword: accountInfo.currentPassword
                }
            }
        })
    }

    return (
        <div className="p-t-120" style={{ backgroundColor: "#F4F4F4" }}>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-3">
                        <AccountSideBar userInfo={userInfo} />
                    </div>
                    <div className="p-l-40 p-t-20 p-r-40 p-b-20 d-flex w-100 col-12 col-md-9" style={{backgroundColor: "#FFFFFF", borderRadius: 3}}>
                        <Switch>
                            <Route path="/auth/account/orders/history" exact render={() => <PrivateRoute render={() => <OrderList />} />}></Route>
                            <Route path="/auth/account/order/:orderId" exact render={() => <PrivateRoute render={() => <OrderDetail />} />}></Route>
                            <Route path="/auth/account/order/tracking/:orderId" exact render={() => <PrivateRoute render={() => <OrderStatus />} />}></Route>
                            <Route path="/auth/account/address" exact render={() => <PrivateRoute render={() => <UserAddressList />} />}></Route>
                            <Route path="/auth/account/review" exact render={() => <PrivateRoute render={() => <UserBookReviewList />} />}></Route>
                            <Route path="/auth/account/wish-list" exact render={() => <PrivateRoute render={() => <UserWishList />} />}></Route>
                            <Route path="/auth/account/edit" exact render={() => <PrivateRoute render={() => 
                            (<div style={{ flex: 2, padding: '0 20px 0 0' }}>
                                <h4>Thông tin tài khoản</h4>
                                <br />
                                <form className="d-flex flex-column" onSubmit={onUpdateUser}
                                    noValidate autoComplete="off">
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="fullName">Họ và tên</label>
                                        <Input type="text" placeholder="Họ và tên" name="fullName" onChange={handleInputChange} value={accountInfo.fullName} id="fullName" /></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="phone">Số điện thoại</label>
                                        <Input type="text" placeholder="Họ và tên" name="phone" onChange={handleInputChange} value={accountInfo.phone} id="phone" /></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="email">Email</label>
                                        <Input type="email" placeholder="Email" disabled name="email" id="email" onChange={handleInputChange} value={accountInfo.email} /></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="username">Tên đăng nhập</label>
                                        <Input type="text" name="username" disabled id="username" onChange={handleInputChange} value={accountInfo.username} /></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="gender">Giới tính</label>
                                        <Radio.Group name="gender" id="gender" onChange={handleInputChange} value={accountInfo.gender}>
                                            <Radio value={true}>Nam</Radio>
                                            <Radio value={false}>Nữ</Radio>
                                        </Radio.Group></div>
                                    <div className="p-b-8"><label className="font-weight-bold" htmlFor="birthdate">Ngày sinh</label>
                                        <DatePicker className="w-100" onChange={handleDateChange} value={moment(accountInfo.birthdate)} format={DATE_VN} id="birthdate" name="birthdate" /></div>
                                    <div className="p-b-8 d-flex">
                                        <AntSwitch name="changePassword" id="changePassword" onChange={() => setShowChangePassword(prev => !prev)} />
                                        <label className="font-weight-bold" htmlFor="changePassword" className="p-l-8">Đổi mật khẩu</label>
                                    </div>
                                    {showChangePassword && <Fragment><div className="p-b-8"><label className="font-weight-bold" htmlFor="currentPassword">Mật khẩu hiện tại</label>
                                        <Input type="password" style={{
                                            borderColor: !accountInfo.currentPassword ? "red" : undefined
                                        }}
                                            placeholder="Mật khẩu hiện tại" name="currentPassword" id="currentPassword"
                                            onChange={handleInputChange} value={accountInfo.currentPassword} />
                                        {!accountInfo.currentPassword && <span className="error-txt">Trường này không được để trống</span>}
                                    </div>
                                        <div className="p-b-8"><label className="font-weight-bold" htmlFor="newPassword">Mật khẩu mới</label>
                                            <Input type="password" style={{
                                                borderColor: !isPwdValid ? "red" : undefined
                                            }}
                                                placeholder="Mật khẩu mới" name="newPassword" id="newPassword"
                                                onChange={handleInputChange} value={accountInfo.newPassword} />
                                            {!isPwdValid && <span className="error-txt">Mật khẩu phải chứa it nhất 8 kí tự</span>}

                                        </div>
                                        <div className="p-b-8"><label className="font-weight-bold" htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
                                            <Input type="password" style={{
                                                borderColor: !confirmPwdMatched ? "red" : undefined
                                            }} placeholder="Xác nhận mật khẩu"
                                                name="confirmNewPassword" id="confirmNewPassword"
                                                onChange={handleInputChange} value={accountInfo.confirmNewPassword} />
                                            {!confirmPwdMatched && <span className="error-txt">Xác nhận mật khẩu không trùng khớp</span>}
                                        </div>
                                    </Fragment>}
                                    <Button htmlType="submit" loading={updatingUser}
                                        className="w-50" type="primary">Lưu thay đổi</Button>
                                </form>
                            </div>)} />}></Route>

                        </Switch>

                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateUserSucessfully: (user) => {
            dispatch(updateUserSucessfully(user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);