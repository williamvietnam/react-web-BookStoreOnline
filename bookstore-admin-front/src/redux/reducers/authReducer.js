import {
    LOG_IN_SUCCESSFULLY,
    SIGNING_UP,
    SIGN_UP_SUCCESSFULLY,
    SIGN_UP_FAILED,
    LOG_OUT,
    UPDATING_USER,
    UPDATE_USER_SUCCESSFULLY
} from "../../constants";

let token = localStorage.getItem('token');
let user = localStorage.getItem('userInfo');

try {
    if (user) {
        user = JSON.parse(user);
    }

} catch {
    user = undefined;
}

const initialState = {
    user: user,
    token: token,
    loading: false,
    errorLogin: false,
    errorSignup: false
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOG_IN_SUCCESSFULLY:
            return {
                ...state,
                user: action.authPayload.user,
                token: action.authPayload.token,
                loading: false,
            }
        case SIGNING_UP:
            return {
                ...state,
                loading: true,
            }
        case SIGN_UP_SUCCESSFULLY:
            return {
                ...state,
                user: action.authPayload.user,
                token: action.authPayload.token,
                loading: false,
            }
        case SIGN_UP_FAILED:
            return {
                ...state,
                loading: false
            }
        case LOG_OUT:
            return {
                user: undefined,
                token: undefined,
                loading: false,
                errorLogin: false,
                errorSignup: false
            }
        case UPDATE_USER_SUCCESSFULLY: 
            return {
                ...state,
                user: action.user
            }
        default:
            return state;
    }
}