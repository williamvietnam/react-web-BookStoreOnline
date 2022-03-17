import gql from 'graphql-tag';

export const GET_BOOKS = gql`
  query getBooks($where: BookWhereInput, $orderBy: BookOrderByInput, $first: Int, $skip: Int, $selection: String){
    getBooks(where: $where, orderBy: $orderBy, first: $first, skip: $skip, selection: $selection) {
      books{
        id
        title
        basePrice
        description
        thumbnail
        images
        dimensions
        translator
        format
        isbn
        publishedDate
        availableCopies
        pages
        discounts{
          id
          from
          to
          discountRate
          usePercentage
          discountAmount
        }
        publisher{
          id
          name
        }
        authors{
          id
          pseudonym
        }
        categories{
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const GET_BOOKS_FOR_BROWSING = gql`
  query getBooksForBrowsing($where: BookWhereInput, $orderBy: BookOrderByInput, $first: Int, $skip: Int){
    getBooksForBrowsing(where: $where, orderBy: $orderBy, first: $first, skip: $skip) {
      books{
        id
        title
        basePrice
        description
        thumbnail
        images
        dimensions
        translator
        format
        isbn
        publishedDate
        availableCopies
        pages
        reviews{
          avgRating
          totalCount
        }
        discounts{
          discountRate
          discountAmount
          discountedPrice
        }
        publisher{
          id
          name
        }
        authors{
          id
          pseudonym
        }
        categories{
          id
          name
        }
      }
      totalCount
    }
  }
`;


export const GET_BOOK_QTY = gql`
  query getItemStockQty($id: ID!){
    getItemStockQty(id: $id){
      id
      qty
    }
  }
`

export const ADD_BOOK_TO_WISH_LIST = gql`
  mutation addBookToWishList($bookId: ID!){
    addBookToWishList(bookId: $bookId){
      statusCode
      message
    }
  }
`

export const REMOVE_BOOK_FROM_WISH_LIST = gql`
  mutation removeBookFromWishList($bookId: ID!){
    removeBookFromWishList(bookId: $bookId){
      statusCode
      message
    }
  }
`

export const GET_WISH_LIST = gql`
  query getWishList{
    getWishList{
      statusCode
      message
      data{
        books{
          id
          thumbnail
          title
          reviews{
            id
            rating
          }
        }
        totalCount
      }
    }
  }
`

export const GET_BOOK = gql`
  query getBook($id: ID!){
    getBook(id: $id) {
      id
      title
      basePrice
      description
      thumbnail
      images
      dimensions
      translator
      format
      isbn
      publishedDate
      availableCopies
      pages
      discounts{
        id
        from
        to
        discountRate
        usePercentage
        discountAmount
      }
      publisher{
        id
        name
      }
      authors{
        id
        pseudonym
      }
      categories{
        id
        name
      }
    }
  }
`;

export const GET_BEST_SELLER = gql`
  query getBestSeller($first: Int!, $skip: Int!, $dateFrom: String, $dateTo: String){
    getBestSeller(first: $first, skip: $skip, dateFrom: $dateFrom, dateTo: $dateTo){
      books{
        id
        title
        basePrice
        description
        thumbnail
        images
        dimensions
        translator
        format
        isbn
        publishedDate
        availableCopies
        pages
        discounts{
          id
          from
          to
          discountRate
          usePercentage
          discountAmount
        }
        publisher{
          id
          name
        }
        authors{
          id
          pseudonym
        }
        categories{
          id
          name
        }
      }
      totalCount
    }
  }
`

export const GET_BEST_SELLER_FOR_BROWSING = gql`
  query getBestSellerForBrowsing($first: Int!, $skip: Int!, $dateFrom: String, $dateTo: String){
    getBestSellerForBrowsing(first: $first, skip: $skip, dateFrom: $dateFrom, dateTo: $dateTo){
      books{
        id
        title
        basePrice
        description
        thumbnail
        images
        dimensions
        translator
        format
        isbn
        publishedDate
        availableCopies
        pages
        reviews{
          avgRating
          totalCount
        }
        discounts{
          discountRate
          discountAmount
          discountedPrice
        }
        publisher{
          id
          name
        }
        authors{
          id
          pseudonym
        }
        categories{
          id
          name
        }
      }
      totalCount
    }
  }
`
