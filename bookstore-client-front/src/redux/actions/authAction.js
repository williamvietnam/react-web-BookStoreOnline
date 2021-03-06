import { LOGGING_IN, LOG_IN_SUCCESSFULLY, SIGNING_UP, SIGN_UP_SUCCESSFULLY, SIGN_UP_FAILED, LOG_IN_FAILED, LOG_OUT, UPDATING_USER, UPDATE_USER_SUCCESSFULLY, UPDATE_USER_FAILED } from "../../constants";
import { LOGIN, SIGNUP, UPDATE_USER } from "../../api/authApi";
import history from "../../utils/history";
import { message } from "antd";

const loggingIn = () => ({
    type: LOGGING_IN
});

const loginSuccessfully = (authPayload) => ({
    type: LOG_IN_SUCCESSFULLY,
    authPayload
})

const loginFailed = () => ({
    type: LOG_IN_FAILED,
})


const signingUp = () => ({
    type: SIGNING_UP
});

const signUpSuccessfully = (authPayload) => ({
    type: SIGN_UP_SUCCESSFULLY,
    authPayload
})

const signUpFailed = () => ({
    type: SIGN_UP_FAILED,
})

const updatingUser = () => ({
    type: UPDATING_USER
});

export const updateUserSucessfully = (user) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
    return {
        type: UPDATE_USER_SUCCESSFULLY,
        user
    }
};

const updateUserFailed = (error) => ({
    type: UPDATE_USER_FAILED
})

export const logout = () => {
    localStorage.removeItem('authPayload');
    localStorage.removeItem('token');
    history.push('/');
    return {
        type: LOG_OUT
    }
}

export const login = (client, { email, password }) => {
    return async dispatch => {
        dispatch(loggingIn());
        try {
            const res = await client.mutate({
                mutation: LOGIN,
                variables: {
                    data: {
                        email,
                        password
                    }
                }
            });
            if (res.data.login.statusCode === 200) {
                localStorage.setItem('userInfo', JSON.stringify(res.data.login.user));
                localStorage.setItem('token', res.data.login.token);
                dispatch(loginSuccessfully(res.data.login));
            } else if (res.data.login.statusCode === 400) {
                message.error(res.data.login.message);
                dispatch(loginFailed());
            } else if (res.data.login.statusCode === 405) {
                localStorage.setItem('userInfo', JSON.stringify(res.data.login.user));
                history.push('/email-activation');
                dispatch(loginFailed());
            } else {
                dispatch(loginFailed());
            }

        } catch (ex) {
            console.log(ex)
            message.error("C?? l???i x???y ra, vui l??ng th??? l???i sau");
            dispatch(loginFailed());
        }
    }
}

export const updateUser = (client, data) => {
    return async dispatch => {
        dispatch(updatingUser());
        try {
            const res = await client.mutate({
                mutation: UPDATE_USER,
                variables: {
                    data
                }
            });
            localStorage.setItem('userInfo', JSON.stringify(res.data.updateUser));
            dispatch(updateUserSucessfully(res.data.updateUser));
        } catch (ex) {
            console.log(ex);
            message.error("C???p nh???t th???t b???i, vui l??ng ki???m tra l???i th??ng tin.")
            updateUserFailed();
        }
    }
}

export const signUp = (client, { email, username, password, avatar, birthdate, fullName, gender, phone }) => {
    return async dispatch => {
        dispatch(signingUp());
        try {
            const res = await client.mutate({
                mutation: SIGNUP,
                variables: {
                    data: {
                        email,
                        username,
                        password,
                        avatar,
                        birthdate,
                        fullName,
                        gender,
                        phone
                    }
                }
            });
            if (res.data.signUp.statusCode !== 200) {
                message.error(res.data.signUp.message);
                dispatch(signUpFailed());
            } else {
                localStorage.setItem('userInfo', JSON.stringify(res.data.signUp.user));
                localStorage.setItem('token', res.data.signUp.token);
                // history.push('/email-activation');
                dispatch(signUpSuccessfully(res.data.signUp));
                message.success("T???o t??i kho???n th??nh c??ng");
            }
        } catch (ex) {
            message.error("C?? l???i x???y ra khi ????ng k??");
            dispatch(signUpFailed());
        }
    }
}