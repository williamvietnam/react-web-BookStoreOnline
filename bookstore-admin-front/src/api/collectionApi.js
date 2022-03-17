import gql from 'graphql-tag';

export const GET_COLLECTIONS = gql`
    query getCollections($name: String, $orderBy: CollectionOrderByInput, $first: Int, $skip: Int){
        getCollections(name: $name,orderBy: $orderBy, first: $first, skip: $skip){
            collections{
                id
                name
                description
                thumbnail
                createdAt
                updatedAt
            }
            totalCount
        }
    }
`

export const GET_COLLECTION = gql`
    query getCollection($id: ID!){
        getCollection(id: $id){
            id
            name
            thumbnail
            description
        }
    }
`
export const DELETE_COLLECTIONS = gql`
  mutation deleteCollections($id: [ID!]!){
    deleteCollections(id: $id){
      count
    }
  }
`
export const CREATE_COLLECTION = gql`
  mutation createCollection($data: CollectionCreateInput!){
    createCollection(data: $data){
      id
    }
  }
`

export const UPDATE_COLLECTION = gql`
  mutation updateCollection($id: ID!,$data: CollectionUpdateInput!){
    updateCollection(id: $id,data: $data){
      id
    }
  }
`