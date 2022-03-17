import gql from 'graphql-tag';

export const LOGIN = gql`
    mutation login($data: UserLoginInput!){
        login(data: $data){
            statusCode
            message
            user{
                id
                username
                fullName
                avatar
                email
                phone
                isActive
                gender
                birthdate
                password
                role
            }
            token
        }
    }

`
export const UPDATE_USER = gql`
    mutation updateUser($data: CustomUserUpdateInput!){
        updateUser(data: $data){
            id
            username
            fullName
            avatar
            email
            phone
            gender
            birthdate
            password
            role
        }
    }
`

export const CREATE_PASSWORD_TOKEN = gql`
    mutation createPasswordToken($email: String!){
        createPasswordToken(email: $email){
            statusCode
            message
        }
    }
`


export const RESET_PASSWORD = gql`
    mutation resetPassword($passwordToken: String!,$password: String!){
        resetPassword(passwordToken: $passwordToken, password: $password){
            statusCode
            message
        }
    }
`

export const SIGNUP = gql`
    mutation signUp($data: UserSignupInput!){
        signUp(data: $data){
            statusCode
            message
            user{
                id
                username
                fullName
                email
                avatar
                phone
                isActive
                gender
                birthdate
                password
                role
            }
            token
        }
    }
`

export const SEND_PASSWORD_VIA_EMAIL = gql`
    mutation sendPasswordViaEmail($email: String!){
        sendPasswordViaEmail(email: $email){
            statusCode
            message
        }
    }
`