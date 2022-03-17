import gql from 'graphql-tag';

export const GET_COMMON_STATISTICS = gql`
    query getCommonStatistics{
        getCommonStatistics{
           customers
           orders
           income
           lowStocks
        }
    }
`

export const GET_BESTSELLER_LIST = gql`
    query getBestSellerList($first: Int! ,$skip: Int, $dateFrom: String, $dateTo: String){
        getBestSellerList(first: $first, skip: $skip, dateFrom: $dateFrom, dateTo: $dateTo){
            entities{
                id
                title
                sku
                totalPrice
                totalQuantity
            }
            totalCount
        }
    }
`