import gql from 'graphql-tag';

export const CREATE_ORDER = gql`
    mutation createOrder($data: OrderCreateInput!){
        createOrder(data: $data){
           id
        }
    }
`

export const GET_ORDERS = gql`
    query getOrders($where: OrderWhereInput, $orderBy: OrderOrderByInput, $first: Int,$skip: Int, $selection: String){
        getOrders(where: $where, orderBy: $orderBy, first: $first, skip: $skip, selection: $selection){
           orders{
               id
               orderNumber
               grandTotal
               recipientFullName
               recipientPhone
               paymentMethod{
                   id
                   name
               }
               shippingMethod{
                   id
                   name
               }
               customer{
                   id
                   email
               }
               orderStatus
               paymentStatus
               createdAt
               updatedAt
           }
           totalCount
        }
    }
`

export const GET_ORDER_BY_ID = gql`
    query getOrderById($id: ID!){
        getOrderById(id: $id){
            id
            orderNumber
            items{
                id
                price
                totalItemPrice
                quantity
                discount
                item{
                    id
                    title
                    thumbnail
                }
            }
            customer{
                id
                email
            }
            grandTotal
            subTotal
            recipientFullName
            recipientPhone
            recipientWard{
                id
                name
            }
            recipientDistrict{
                id
                name
            }
            recipientProvince{
                id
                name
            }
            recipientAddress
            paymentMethod{
                id
                name
            }
            shippingMethod{
                id
                name
            }
            orderSteps{
                id
                orderStatus
                createdAt
            }
            orderStatus
            paymentStatus
            createdAt
        }
    }
`

export const UPDATE_ORDER_STATUS = gql`
    mutation updateOrderStatus($orderId: ID!, $orderStatus: OrderStatus!){
        updateOrderStatus(orderId: $orderId, orderStatus: $orderStatus){
            id
        }
    }
`

export const UPDATE_PAYMENT_STATUS = gql`
    mutation updatePaymentStatus($orderId: ID!, $paymentStatus: Boolean!){
        updatePaymentStatus(orderId: $orderId, paymentStatus: $paymentStatus){
            id
        }
    }
`

export const UPDATE_ORDER_ADDRESS = gql`
    mutation updateOrderAddress($orderId: ID!, $data: OrderAddressUpdateInput!){
        updateOrderAddress(orderId: $orderId, data: $data){
            id
        }
    }
`