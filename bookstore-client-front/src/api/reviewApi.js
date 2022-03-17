import gql from 'graphql-tag';

export const GET_REVIEWS_BY_BOOK = gql`
    query getBookReviewsByBook($bookId: ID!, $orderBy: BookReviewOrderByInput, $first: Int,$skip: Int){
        getBookReviewsByBook(bookId: $bookId, orderBy: $orderBy, first: $first, skip: $skip){
            bookReviews{
                id
                reviewHeader
                reviewText
                rating
                createdAt
                updatedAt
                author{
                    id
                    username
                    fullName
                    avatar
                }
                replies{
                    id
                    text
                    author{
                        id
                        username
                        fullName
                        avatar
                    }
                    updatedAt
                }
            }
            totalCount
            fiveStar
            fourStar
            threeStar
            twoStar
            oneStar
        }
    }
`

export const GET_REVIEWS = gql`
    query getBookReviews($where: BookReviewWhereInput!, $orderBy: BookReviewOrderByInput, $first: Int,$skip: Int){
        getBookReviews(where: $where, orderBy: $orderBy, first: $first, skip: $skip){
            bookReviews{
                id
                reviewHeader
                reviewText
                rating
                updatedAt
                replies{
                    id
                    text
                    author{
                        id
                        username
                        avatar
                        fullName
                    }
                    updatedAt
                }
                author{
                    id
                    username
                    avatar
                    fullName
                }
                book{
                    id 
                    title
                    thumbnail
                }
            }
            totalCount
        }
    }
`

export const CREATE_BOOK_REVIEW = gql`
    mutation createBookReview($data: BookReviewCreateInput!){
        createBookReview(data: $data){
            id
        }
    }
`
export const CREATE_REVIEW_REPLY = gql`
    mutation createReviewReply($data: ReviewReplyCreateInput!){
        createReviewReply(data: $data){
            id
        }
}
`

export const GET_REVIEW_REPLIES = gql`
    query getReviewRepliesByReview($reivewId: ID!){
        getReviewRepliesByReview(reivewId: $reivewId){
            id
            text
            author{
                id
                username
                fullName
                avatar
            }
            bookReview{
                id
            }
            updatedAt
        }
}
`