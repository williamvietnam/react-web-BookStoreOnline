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

export const UPDATE_USER_ADMIN = gql`
    mutation updateUserAdmin($id: ID!, $data: CustomUserUpdateInputAdmin!){
        updateUserAdmin(id: $id, data: $data){
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

export const CREATE_USER_ADMIN = gql`
    mutation createUserAdmin($data: UserSignupInput!){
        createUserAdmin(data: $data){
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

export const GET_USERS = gql`
    query getUsers($where: UserWhereInput, $orderBy: UserOrderByInput, $first: Int,$skip: Int, $selection: String){
        getUsers(where: $where, orderBy: $orderBy, first: $first, skip: $skip, selection: $selection){
            users{
                id
                username
                fullName
                email
                avatar
                phone
                isActive
                gender
                birthdate
                role
                createdAt
            }
            totalCount
        }
    }
`

export const GET_USER_BY_ID = gql`
    query getUserById($id: ID!){
        getUserById(id: $id){
            id
            username
            fullName
            email
            avatar
            phone
            isActive
            gender
            birthdate
            role
            createdAt
        }
    }
`

export const GET_USERS_BASIC = gql`
    query getUsers($where: UserWhereInput, $orderBy: UserOrderByInput, $first: Int,$skip: Int, $selection: String){
        getUsers(where: $where, orderBy: $orderBy, first: $first, skip: $skip, selection: $selection){
            users{
                id
                createdAt
            }
            totalCount
        }
    }
`