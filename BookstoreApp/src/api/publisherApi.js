import gql from 'graphql-tag';

export const GET_PUBLISHERS = gql`
    query getPublishers($where: PublisherWhereInput, $bookWhere: BookWhereInput,$orderBy: PublisherOrderByInput, $first: Int, $skip: Int){
        getPublishers(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            id
            name
            books(where: $bookWhere){
                id
            }
        }
    }
`

export const GET_PUBLISHERS_BASIC = gql`
    query getPublishers($where: PublisherWhereInput, $orderBy: PublisherOrderByInput, $first: Int, $skip: Int){
        getPublishers(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            id
            name
        }
    }
`