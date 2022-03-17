import React, { useState } from 'react';
import { Button } from 'antd';
import validator from 'validator';
import FacebookLogin from 'react-facebook-login';
import moment from 'moment';

function SignupForm(props) {

  const { auth, signUp, isShowTitle = true, submitBtnFullWidth = true } = props;

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });

  const [inputChanged, setInputChanged] = useState({
    username: false,
    password: false,
    email: false,
    confirmPassword: false
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
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password, email, confirmPassword } = inputs;
    if (!username || !password || !email || !confirmPassword || password !== confirmPassword ||
      !validator.isEmail(email)) {
      setInputChanged({
        username: true,
        password: true,
        email: true,
      })
      return;
    }
    signUp(inputs);
  }

    return (
    <form className="login100-form validate-form flex-sb flex-w" onSubmit={onSubmit}>
      {isShowTitle && <span className="login100-form-title p-b-20">
        Đăng ký
                </span>}
      <div className="w-100">
        <FacebookLogin
          appId="632856054194710"
          autoLoad
          textButton="Đăng ký với Facebook"
          fields="name,email,picture,birthday,gender"
          scope="user_birthday"
          callback={(res) => {
            console.log(res)
            setInputs(prev=>({
              ...prev,
              username: res.email,
              email: res.email,
              fullName: res.name,
              avatar: res.picture.data.url,
              birthdate: moment(res.birthday).format("YYYY-MM-DD")
            }))
          }}
          cssClass="btn-face m-b-20"
          icon="fa-facebook"
        /></div>
      <div className="p-t-20 p-b-9">
        <span className="txt1">
          Email
                  </span>
      </div>
      <div className="w-100">
        <div className="wrap-input100 validate-input" data-validate="Username is required">
          <input className="input100" type="email" name="email" onChange={handleInputsChange} value={inputs.email} />
          <span className={`focus-input100${inputChanged.email && (!inputs.email || !validator.isEmail(inputs.email)) ? ' error' : ''}`} />
        </div>
        {inputChanged.email && !inputs.email && <span className="error-txt">Email không được để trống</span>}
        {inputChanged.email && inputs.email && validator.isEmail(inputs.email) === false && <span className="error-txt">Email không đúng định dạng</span>}
      </div>
      <div className="p-t-20 p-b-9">
        <span className="txt1">
          Tên người dùng
                  </span>
      </div>
      <div className="w-100">
        <div className="wrap-input100 validate-input" data-validate="Username is required">
          <input className="input100" type="text" name="username" onChange={handleInputsChange} value={inputs.username} />
          <span className={`focus-input100${inputChanged.username && inputs.username ? '' : ' error'}`} />
        </div>
        {inputChanged.username && !inputs.username && <span className="error-txt">Username không được để trống</span>}
      </div>
      <div className="p-t-13 p-b-9">
        <span className="txt1">
          Mật khẩu
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
          Xác nhận khẩu
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
        <Button style={{ width: submitBtnFullWidth ? '100%' : undefined }}
          htmlType="submit" type="primary" loading={auth.loading} className="login100-form-btn">
          Đăng ký
            </Button>
      </div>
    </form>
  )

}

export default SignupForm;