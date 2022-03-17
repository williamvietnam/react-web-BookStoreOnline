import React, { useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import './main.css';
import './util.css';
import { signUp as signUpAction } from '../../../redux/actions/authAction';
import { connect } from 'react-redux';
import { withApollo } from '@apollo/react-hoc';
import isTokenValid from '../../../utils/tokenValidation';
import SignupForm from '../../shared/forms/SignupForm';

function SignupPage(props) {

  const { auth, signUp } = props;

  if (isTokenValid(auth.token)){
    return <Redirect to="/" />
  }

  return (<div className="auth-page">
    <div className="limiter">
      <div className="container-login100" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80")' }}>
        <div className="wrap-login100 p-l-70 p-r-70 p-t-50 p-b-33">
          <div className="d-flex justify-content-center p-b-20">
            <NavLink to="/"><img src="/images/logo/logo.png" height={50} /></NavLink>
          </div>
          <SignupForm auth={auth} signUp={signUp}/>
          <div className="w-full text-center p-t-55">
              <span className="txt2 p-r-4">
                Đã có tài khoản?
                  </span>
              <NavLink to="/auth/login" className="txt2 bo1">
                Đăng nhập
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    signUp: (data) => {
      dispatch(signUpAction(ownProps.client,  data ));
    }
  }
}

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(SignupPage));