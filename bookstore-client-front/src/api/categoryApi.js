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