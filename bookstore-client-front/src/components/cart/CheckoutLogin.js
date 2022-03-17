import React from 'react';
import { Tabs } from 'antd';
import LoginForm from '../shared/forms/LoginForm';
import { withApollo } from '@apollo/react-hoc';
import { connect } from 'react-redux';
import { signUp as signUpAction, login as loginAction } from '../../redux/actions/authAction';
import SignupForm from '../shared/forms/SignupForm';

const { TabPane } = Tabs;

function CheckoutLoginStep(props) {
    const { auth, login, signUp } = props;
    return (
        <div>
            <h5>Khách mới/Đăng nhập</h5>
            <br />
            <div className="row">
                <div className="col-12 col-sm-8">
                    <Tabs defaultActiveKey="login" tabPosition="left">
                        <TabPane tab="Đăng nhập" key="login">
                            <LoginForm  auth={auth} isShowTitle={false}
                            submitBtnFullWidth={false}
                            login={login} />
                        </TabPane>
                        <TabPane tab="Đăng ký" key="signup">
                            <SignupForm auth={auth} isShowTitle={false}
                            submitBtnFullWidth={false}
                            signUp={signUp} />
                        </TabPane>
                    </Tabs>
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
        login: (email, password) => {
            dispatch(loginAction(ownProps.client, { email, password }))
        },
        signUp: (data) => {
            dispatch(signUpAction(ownProps.client, data));
        }
    }
}

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(CheckoutLoginStep));
