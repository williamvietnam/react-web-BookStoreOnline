import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import './login.css';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../../api/authApi';
import { useHistory, Redirect, useLocation } from 'react-router-dom';
import { loginSuccessfully } from '../../redux/actions/authAction';
import isTokenValid from '../../utils/tokenValidation';
import { connect } from 'react-redux';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const Login = (props) => {

    const { auth, loginSuccess } = props;

    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });

    const location = useLocation();

    const [inputChanged, setInputChanged] = useState({
        username: false,
        password: false
    });

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInputChanged(prev => ({
            ...prev,
            [name]: true
        }));
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const [login, { loading }] = useMutation(LOGIN, {
        onError() {
            message.error("Có lỗi xảy ra khi đăng nhập");
        },
        onCompleted(data) {
            if (data.login.statusCode !== 200) {
                message.error(data.login.message);
            } else {
                localStorage.setItem('userInfo', JSON.stringify(data.login.user));
                localStorage.setItem('token', data.login.token);
                loginSuccess(data.login);
            }
        }
    })

    const onSubmit = (e) => {
        e.preventDefault();
        const { username, password } = inputs;
        if (username && password) {
            login({
                variables: {
                    data: {
                        email: username,
                        password
                    }
                }
            })
        } else {
            setInputChanged({
                username: true,
                password: true
            })
        }
    };
    
    if (auth.token && isTokenValid(auth.token)) {
        if (location.state && location.state.from) {
            return <Redirect to={location.state.from} />
        }
        return <Redirect to="/" />
    }

    return (
        <div className="login">
            <div className="login-form-wrapper">
                <h2 className="m-b-32">Đăng nhập</h2>
                <Form
                    {...layout}
                    name="basic"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onSubmit={onSubmit}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        validateStatus={inputChanged.username && !inputs.username ? 'error' : 'success'}
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input name="username" value={inputs.username} onChange={onInputChange} />
                        {inputChanged.username && !inputs.username && <span className="err-txt">Username không được để trống</span>}
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        validateStatus={inputChanged.password && !inputs.password ? 'error' : 'success'}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password name="password" value={inputs.password} onChange={onInputChange} />
                        {inputChanged.password && !inputs.password && <span className="err-txt">Password không được để trống</span>}
                    </Form.Item>
                    <div className="w-100 d-flex justify-content-center">
                        <Button type="primary" size="large" htmlType="submit" loading={loading}>
                            Đăng nhập
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loginSuccess: (data) => {
            dispatch(loginSuccessfully(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);