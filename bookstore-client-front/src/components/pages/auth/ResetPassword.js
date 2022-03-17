import React, { useState } from 'react';
import { NavLink, Redirect, useLocation, useHistory, useParams } from 'react-router-dom';
import './main.css';
import './util.css';
import { connect } from 'react-redux';
import { withApollo } from '@apollo/react-hoc';
import { RESET_PASSWORD } from '../../../api/authApi';
import { useMutation } from '@apollo/react-hooks';
import { message, Button } from 'antd';

function ResetPassword(props) {

    const params = useParams();
    const history = useHistory();
    const {token: passwordToken} = params;

    const [inputs, setInputs] = useState({
        password: '',
        confirmPassword: ''
    });

    const [inputChanged, setInputChanged] = useState({
        password: false,
        confirmPassword: false
    });

    const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
        onError() {
            message.error("Có lỗi xảy ra, vui lòng thử lại sau");
        },
        onCompleted(data) {
            if (data.resetPassword.statusCode !== 200) {
                message.error(data.resetPassword.message);
            }else{
                const redir = window.confirm("Đổi mật khẩu thành công, chuyển đến trang đăng nhập?")
                if (redir){
                    history.push("/auth/login");
                }
            }
        }
    })

    const handleInputsChange = (e) => {
        const { target } = e;
        const { name, value } = target;
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
        setInputChanged(prev => ({
            ...prev,
            [name]: true
        }))
        if (!value) {
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const { password, confirmPassword } = inputs;
        if (confirmPassword && password===confirmPassword) {
            resetPassword({
                variables: {
                    password,
                    passwordToken
                }
            })
        }
    }
    return (<div className="auth-page">
        <div className="limiter">
            <div className="container-login100" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80")' }}>
                <div className="wrap-login100 p-l-70 p-r-70 p-t-50 p-b-33">
                    <div className="d-flex justify-content-center p-b-20">
                        <NavLink to="/"><img src="/images/logo/logo.png" height={50} /></NavLink>
                    </div>
                    <form className="login100-form validate-form flex-sb flex-w" onSubmit={onSubmit}>
                       <span className="login100-form-title p-b-20">
                            Đổi mật khẩu
                        </span>
                        <div className="p-t-13 p-b-9">
                            <span className="txt1">
                                Mật khẩu mới
                            </span>
                        </div>
                        <div className="w-100">
                            <div className={`wrap-input100 validate-input`} data-validate="Password is required">
                                <input className={`input100`} type="password" name="password"
                                    onChange={handleInputsChange} value={inputs.password} />
                                <span className={`focus-input100${inputChanged.password && inputs.password ? '' : ' error'}`} />
                            </div>
                            {inputChanged.password && !inputs.password && <span className="error-txt">Password không được để trống</span>}
                        </div>
                        <div className="p-t-13 p-b-9">
                            <span className="txt1">
                                Xác nhận mật khẩu
                            </span>
                        </div>
                        <div className="w-100">
                            <div className={`wrap-input100 validate-input`} data-validate="Password is required">
                                <input className={`input100`} type="password" name="confirmPassword"
                                    onChange={handleInputsChange} value={inputs.confirmPassword} />
                                <span className={`focus-input100${inputChanged.confirmPassword && inputs.confirmPassword && inputs.password && inputs.confirmPassword !== inputs.password ? ' error' : ''}`} />
                            </div>
                            {inputChanged.confirmPassword && inputs.confirmPassword && inputs.password && inputs.confirmPassword !== inputs.password && <span className="error-txt">Xác nhận mật khẩu không trùng khớp</span>}
                        </div>
                        <div className="container-login100-form-btn m-t-17">
                            <Button 
                                htmlType="submit" type="primary" loading={loading} className="login100-form-btn">
                                Đăng ký
                            </Button>
                        </div>
                    </form>
                    <div className="w-full text-center p-t-55">
                        <span className="txt2 p-r-4">
                            Chưa có tài khoản?
                  </span>
                        <NavLink to="/auth/signup" className="txt2 bo1">
                            Đăng ký ngay
                  </NavLink>
                    </div>
                </div>
            </div>
        </div>
        <div id="dropDownSelect1" />
    </div>)

}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}


export default withApollo(connect(mapStateToProps, null)(ResetPassword));