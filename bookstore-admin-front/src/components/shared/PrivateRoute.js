import React, { Fragment } from 'react';
import isTokenValid from '../../utils/tokenValidation';
import { Redirect, useLocation } from 'react-router-dom';

export default function PrivateRoute(props) {

    const token = localStorage.getItem('token');
    const location = useLocation();
    console.log(location)
    if (!isTokenValid(token)) {
        window.alert("Bạn phải đăng nhập để sử dụng chức năng này")
        return <Redirect to="/auth/login" from={location.pathname} />
    }

    return (
        <Fragment>
            {props.render()}
        </Fragment>
    )
}