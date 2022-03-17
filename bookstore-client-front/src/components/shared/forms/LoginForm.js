import React, { useState } from 'react';
import { Button } from 'antd';
import { NavLink } from 'react-router-dom';

function LoginForm(props) {

    const { auth, login, isShowTitle = true, submitBtnFullWidth = true } = props;

    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });

    const [inputChanged, setInputChanged] = useState({
        username: false,
        password: false
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
        const { username, password } = inputs;
        if (username && password) {
            login(username, password);
        }
    }

    return (
        <form onSubmit={onSubmit} className="login100-form validate-form flex-sb flex-w">
            {isShowTitle && <span className="login100-form-title p-b-20">
                Đăng nhập
            </span>}
            {/* <a href="#" className="btn-face m-b-20">
          <i className="fa fa-facebook-official" />
          Facebook
            </a> */}

            <div className="p-t-20 p-b-9">
                <span className="txt1">
                    Email/Tên người dùng
              </span>
            </div>
            <div className="w-100">
                <div className={`wrap-input100 validate-input${inputs.username ? '' : ' error'}`} data-validate="Username is required">
                    <input className={`input100`} type="text" name="username"
                        onChange={handleInputsChange} value={inputs.username} />
                    <span className={`focus-input100${inputChanged.username && inputs.username ? '' : ' error'}`} />
                </div>
                {inputChanged.username && !inputs.username && <span className="error-txt">Username không được để trống</span>}
            </div>
            <div className="p-t-13 p-b-9">
                <span className="txt1">
                    Mật khẩu
              </span>
                <NavLink to="/reset-password" className="txt2 bo1 m-l-5">
                    Quên?
              </NavLink>
            </div>
            <div className="w-100">
                <div className={`wrap-input100 validate-input`} data-validate="Password is required">
                    <input className={`input100`} type="password" name="password"
                        onChange={handleInputsChange} value={inputs.password} />
                    <span className={`focus-input100${inputChanged.password && inputs.password ? '' : ' error'}`} />
                </div>
                {inputChanged.password && !inputs.password && <span className="error-txt">Password không được để trống</span>}
            </div>
            <div className="container-login100-form-btn m-t-17">
                <Button style={{ width: submitBtnFullWidth ? '100%' : undefined }} htmlType="submit" type="primary" loading={auth.loading} className="login100-form-btn">
                    Đăng nhập
                </Button>
            </div>
        </form>
    )

}

export default LoginForm;