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

export const GET_PUBLISHERS_PAGING = gql`
    query getPublishersPaging($where: PublisherWhereInput,$orderBy: PublisherOrderByInput, $first: Int, $skip: Int){
        getPublishersPaging(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            publishers{
                id
                name
                description
                createdAt
            }
            totalCount
        }
    }
`

export const GET_PUBLISHER = gql`
    query getPublisher($id: ID!){
        getPublisher(id: $id){
            id
            name
            description
            createdAt
        }
    }
`

export const DELETE_PUBLISHERS = gql`
  mutation deletePublishers($id: [ID!]!){
    deletePublishers(id: $id){
      count
    }
  }
`
export const CREATE_PUBLISHER = gql`
  mutation createPublisher($data: PublisherCreateInput!){
    createPublisher(data: $data){
      id
    }
  }
`

export const UPDATE_PUBLISHER = gql`
  mutation updatePublisher($id: ID!,$data: PublisherUpdateInput!){
    updatePublisher(id: $id,data: $data){
      id
    }
  }
`