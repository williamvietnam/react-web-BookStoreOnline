import gql from 'graphql-tag';

export const GET_DISCOUNTS = gql`
    query getDiscounts($where: DiscountWhereInput, $orderBy: DiscountOrderByInput, $first: Int, $skip: Int){
        getDiscounts(where: $where,orderBy: $orderBy, first: $first, skip: $skip){
            discounts{
                id
                name
                from
                to
                usePercentage
                discountRate
                discountAmount
            }
            totalCount
        }
    }
`

export const GET_DISCOUNT_BY_ID = gql`
    query getDiscountById($id: ID!){
        getDiscountById(id: $id){
            id
            name
            from
            to
            usePercentage
            discountRate
            discountAmount
        }
    }
`
export const DELETE_DISCOUNTS = gql`
  mutation deleteDiscounts($id: [ID!]!){
    deleteDiscounts(id: $id){
      count
    }
  }
`
export const CREATE_DISCOUNT = gql`
  mutation createDiscount($data: DiscountCreateInput!){
    createDiscount(data: $data){
      id
    }
  }
`

export const UPDATE_DISCOUNT = gql`
  mutation updateDiscount($id: ID!,$data: DiscountUpdateInput!){
    updateDiscount(id: $id,data: $data){
      id
    }
  }
`