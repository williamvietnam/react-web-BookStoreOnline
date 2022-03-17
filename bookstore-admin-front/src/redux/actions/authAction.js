import { LOGGING_IN, LOG_IN_SUCCESSFULLY, SIGNING_UP, SIGN_UP_SUCCESSFULLY, SIGN_UP_FAILED, LOG_IN_FAILED, LOG_OUT, UPDATING_USER, UPDATE_USER_SUCCESSFULLY, UPDATE_USER_FAILED } from "../../constants";
import { LOGIN, SIGNUP, UPDATE_USER } from "../../api/authApi";
import history from "../../utils/history";
import { message } from "antd";

export const loginSuccessfully = (authPayload) => ({
    type: LOG_IN_SUCCESSFULLY,
    authPayload
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
            message.error("Cập nhật thất bại, vui lòng kiểm tra lại thông tin.")
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
            localStorage.setItem('userInfo', JSON.stringify(res.data.signUp.user));
            localStorage.setItem('token', res.data.signUp.token);
            history.push('/email-activation');
            dispatch(signUpSuccessfully(res.data.signUp));
        } catch (ex) {
            dispatch(signUpFailed());
        }
    }
}