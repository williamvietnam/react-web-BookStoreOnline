import gql from 'graphql-tag';

export const GET_CATEGORIES = gql`
    query getCategories($where: BookCategoryWhereInput,$bookWhere: BookWhereInput,$orderBy: BookCategoryOrderByInput, $first: Int, $skip: Int){
        getCategories(where: $where,orderBy: $orderBy, first: $first, skip: $skip){
            id
            name
            books(where: $bookWhere){
                id
            }
        }
    }
`


export const GET_CATEGORY = gql`
    query getCategory($id: ID!){
        getCategory(id: $id){
            id
            name
        }
    }
`

export const CREATE_CATEGORY = gql`
    mutation createBookCategory($data: BookCategoryCreateInput!){
        createBookCategory(data: $data){
            id
        }
    }
`


export const DELETE_CATEGORIES = gql`
  mutation deleteCategories($id: [ID!]!){
    deleteCategories(id: $id){
      count
    }
  }
`

export const UPDATE_CATEGORY = gql`
    mutation updateBookCategory($id: ID!,$data: BookCategoryUpdateInput!){
        updateBookCategory(id: $id, data: $data){
            id
        }
    }
`

export const GET_CATEGORIES_BASIC = gql`
    query getCategories($where: BookCategoryWhereInput,$orderBy: BookCategoryOrderByInput, $first: Int, $skip: Int){
        getCategories(where: $where,orderBy: $orderBy, first: $first, skip: $skip){
            id
            name
        }
    }
`

export const GET_CATEGORIES_NO_RELATION = gql`
    query getCategories($where: BookCategoryWhereInput,$orderBy: BookCategoryOrderByInput, $first: Int, $skip: Int){
        getCategories(where: $where,orderBy: $orderBy, first: $first, skip: $skip){
            id
            name
            createdAt
            updatedAt
        }
    }
`

export const GET_CATEGORIES_PAGING_NO_RELATION = gql`
    query getCategoriesPaging($where: BookCategoryWhereInput,$orderBy: BookCategoryOrderByInput, $first: Int, $skip: Int){
        getCategoriesPaging(where: $where,orderBy: $orderBy, first: $first, skip: $skip){
           categories{
                id
                name
                createdAt
                updatedAt
            }
            totalCount
        }
    }
`