import gql from 'graphql-tag';

export const GET_PROVINCES = gql`
    query getProvinces{
        getProvinces{
            id
            name
            type
        }
    }
`

export const GET_DISTRICTS = gql`
    query getDistricts($provinceId: ID!){
        getDistricts(provinceId: $provinceId){
            id
            name
            type
        }
    }
`
export const GET_WARDS = gql`
    query getWards($districtId: ID!){
        getWards(districtId: $districtId){
            id
            name
            type
        }
    }
`

export const CREATE_USER_ADDRESS = gql`
    mutation createUserAddress($data: UserAddressCreateInput!){
        createUserAddress(data: $data){
            id
        }
    }
`

export const UPDATE_USER_ADDRESS = gql`
    mutation updateUserAddress($id: ID!, $data: UserAddressUpdateInput!){
        updateUserAddress(id: $id, data: $data){
            id
        }
    }
`
export const DELETE_USER_ADDRESS = gql`
    mutation deleteUserAddress($id: ID!){
        deleteUserAddress(id: $id){
            id
        }
    }
`

export const GET_USER_ADDRESSES = gql`
    query getUserAddresses{
        getUserAddresses{
            id
            fullName
            phone
            province{
                id
                name
            }
            district{
                id
                name
            }
            ward{
                id
                name
            }
            address
        }
    }
`