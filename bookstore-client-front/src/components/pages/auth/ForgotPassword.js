import React, { useState } from 'react';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import './main.css';
import './util.css';
import { connect } from 'react-redux';
import { withApollo } from '@apollo/react-hoc';
import validator from 'validator';
import { SEND_PASSWORD_VIA_EMAIL } from '../../../api/authApi';
import { useMutation } from '@apollo/react-hooks';
import { message, Button } from 'antd';

function ForgotPassword(props) {

    const [inputs, setInputs] = useState({
        email: ''
    });

    const [inputChanged, setInputChanged] = useState({
        email: false,
    });

    const [sendPasswordViaEmail, { loading,data={} }] = useMutation(SEND_PASSWORD_VIA_EMAIL, {
        onError() {
            message.error("Có lỗi xảy ra, vui lòng thử lại sau");
        },
        onCompleted(data) {
            if (data.sendPasswordViaEmail.statusCode !== 200) {
                message.error(data.sendPasswordViaEmail.message);
            }else{
                message.success("Mật khẩu mới đã được gửi tới hộp thư của bạn");
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
        const { email } = inputs;
        if (email && validator.isEmail(email)) {
            sendPasswordViaEmail({
                variables: {
                    email
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
                    {data.sendPasswordViaEmail&&data.sendPasswordViaEmail.statusCode===200?
                    <div style={{textAlign: 'center'}}>Chúng tôi đã gửi một email để lấy lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.</div>:
                    <form onSubmit={onSubmit} className="login100-form validate-form flex-sb flex-w">
                        <span className="login100-form-title p-b-20">
                            Quên mật khẩu
                         </span>
                        <div className="p-t-20 p-b-9">
                            <span className="txt1">
                                Email
                            </span>
                        </div>
                        <div className="w-100">
                            <div className={`wrap-input100 validate-input${inputChanged.email&&validator.isEmail(inputs.email) ? '' : ' error'}`} data-validate="Username is required">
                                <input className={`input100`} type="text" name="email"
                                    onChange={handleInputsChange} value={inputs.email} />
                                <span className={`focus-input100${inputChanged.email && validator.isEmail(inputs.email)  ? '' : ' error'}`} />
                            </div>
                            {inputChanged.email && !validator.isEmail(inputs.email) && <span className="error-txt">Email không đúng định dạng</span>}
                        </div>
                        <div className="container-login100-form-btn m-t-17">
                            <Button htmlType="submit" type="primary" loading={loading} className="login100-form-btn">
                                Lấy lại mật khẩu
                            </Button>
                        </div>
                    </form>}
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


export default withApollo(connect(mapStateToProps, null)(ForgotPassword));