import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {Button} from 'antd';

function ActivationEmailPage(props) {

    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            userInfo = JSON.parse(userInfo);
            if (userInfo.isActive||!userInfo.email) {
                return <Redirect to="/" />
            }
        } catch{
            return <Redirect to="/" />
        }
    } else {
        return <Redirect to="/" />
    }

    return (
        <div className="d-flex justify-content-center p-t-100 w-100">
            <div className="card w-50">
                <div className="card-body d-flex flex-column align-items-center">
                    <h4>Tạo tài khoản thành công</h4>
                    <br />
                    <p>Chúng tôi đã gửi 1 email tới bạn để kích hoạt tài khoản. Vui lòng kiểm tra hộp thư của bạn.</p>
                    <p>Nếu bạn không kích hoạt trong vòng 24h, tài khoản của bạn sẽ bị xóa.</p>
                </div>
            </div>
        </div>
    )

}

export default ActivationEmailPage;