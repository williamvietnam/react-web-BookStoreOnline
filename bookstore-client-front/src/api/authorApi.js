import gql from 'graphql-tag';

export const GET_AUTHORS = gql`
    query getAuthors($where: AuthorWhereInput, $bookWhere: BookWhereInput,$orderBy: AuthorOrderByInput, $first: Int, $skip: Int){
        getAuthors(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            id
            realName
            pseudonym
            books(where: $bookWhere){
                id
            }
        }
    }
`