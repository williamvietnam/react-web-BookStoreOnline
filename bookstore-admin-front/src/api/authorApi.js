import gql from 'graphql-tag';

export const GET_AUTHORS = gql`
    query getAuthors($where: AuthorWhereInput, $bookWhere: BookWhereInput,$orderBy: AuthorOrderByInput, $first: Int, $skip: Int){
        getAuthors(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            id
            realName
            pseudonym
            description
            books(where: $bookWhere){
                id
            }
        }
    }
`

export const GET_AUTHORS_PAGING = gql`
    query getAuthorsPaging($where: AuthorWhereInput,$orderBy: AuthorOrderByInput, $first: Int, $skip: Int){
        getAuthorsPaging(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            authors{
                id
                realName
                pseudonym
                description
                createdAt
            }
            totalCount
        }
    }
`

export const GET_AUTHOR = gql`
    query getAuthor($id: ID!){
        getAuthor(id: $id){
            id
            realName
            pseudonym
            description
            createdAt
        }
    }
`

export const GET_AUTHORS_BASIC = gql`
    query getAuthors($where: AuthorWhereInput, $orderBy: AuthorOrderByInput, $first: Int, $skip: Int){
        getAuthors(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            id
            realName
            pseudonym
            description
        }
    }
`

export const DELETE_AUTHORS = gql`
  mutation deleteAuthors($id: [ID!]!){
    deleteAuthors(id: $id){
      count
    }
  }
`
export const CREATE_AUTHOR = gql`
  mutation createAuthor($data: AuthorCreateInput!){
    createAuthor(data: $data){
      id
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($id: ID!,$data: AuthorUpdateInput!){
    updateAuthor(id: $id,data: $data){
      id
    }
  }
`