import React from 'react';
import './header.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { useHistory } from 'react-router-dom';

function Header(props) {

    const { auth } = useSelector(state => ({
        auth: state.auth
    }));
    const dispatch = useDispatch();
    const { user } = auth;
    const history = useHistory();

    return (<div className="main-header d-flex align-items-center" style={{}}>
        <div className="header-left">

        </div>
        <div className="header-right d-flex align-items-center justify-content-end" style={{width: '30%', minWidth: 300}}>
            <span style={{ color: '#fff' }}>{user.fullName ?? user.username ?? user.email}</span>
            <a className="m-l-24" onClick={()=>{
                dispatch(logout());
                history.push('/auth/login')
            }}>Đăng xuất</a>
        </div>
    </div>)
}

export default Header;