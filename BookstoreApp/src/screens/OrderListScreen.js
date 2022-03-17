import React, { useState, useEffect } from 'react';
import { View, RefreshControl, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { useLazyQuery } from '@apollo/react-hooks';
import { isCloseToBottom, showToast } from '../utils/common';
import Empty from '../components/atomics/Empty';
import OrderItem from '../components/atomics/OrderItem';
import { GET_ORDERS } from '../api/orderApi';
import ListLoadMoreIndicator from '../components/atomics/ListLoadMore';

function OrderListScreen(props) {

    const [orderData, setOrderData] = useState({
        orders: [],
        totalCount: 0
    })

    const [getOrders, { loading: gettingOrders }] = useLazyQuery(GET_ORDERS, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy thông tin đơn hàng, vui lòng thử lại sau.");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getOrders && data.getOrders.orders) {
                setOrderData({
                    orders: data.getOrders.orders,
                    totalCount: data.getOrders.totalCount
                })
            }
        }
    });

    const [getMoreOrders, { loading: gettingMoreOrders }] = useLazyQuery(GET_ORDERS, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy thông tin đơn hàng, vui lòng thử lại sau.");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getOrders && data.getOrders.orders) {
                setOrderData(prev => ({
                    orders: [...prev.orders, ...data.getOrders.orders],
                    totalCount: data.getOrders.totalCount
                }));
            }
        }
    });

    function refetchOrders() {
        getOrders({
            variables: {
                orderBy: 'createdAt_DESC',
                first: 20,
                skip: 0,
                selection: `{
                    id
                    items{
                        id
                        price
                        quantity
                        item{
                            id
                            title
                            thumbnail
                        }
                    }
                    orderNumber
                    grandTotal
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
                    orderStatus
                    paymentStatus
                    createdAt
                }`
            }
        })
    }

    useEffect(() => {
        refetchOrders();
    }, []);

    const fetchMore = () => {
        if (orderData.orders.length < orderData.totalCount) {
            getMoreOrders({
                variables: {
                    orderBy: 'createdAt_DESC',
                    first: 20,
                    skip: orderData.orders.length,
                    selection: `{
                        id
                        items{
                            id
                            price
                            quantity
                            item{
                                id
                                title
                                thumbnail
                            }
                        }
                        orderNumber
                        grandTotal
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
                        orderStatus
                        paymentStatus
                        createdAt
                    }`
                }
            });
        }
    }

    function renderItem({item}){
        return <OrderItem order={item}/>
    }

    return (
        <View style={styles.container}>
            <HeaderBackAction title="Quản lý đơn hàng" />
            {gettingOrders ? <View style={{ paddingTop: 150, height: '100%' }}>
                <ActivityIndicator animating />
            </View> : <FlatList data={orderData.orders}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={{ marginTop: 50 }}>
                        <Empty emptyText="Bạn chưa có đơn hàng nào" />
                    </View>}
                onScroll={(e) => {
                    if (isCloseToBottom(e.nativeEvent) && !gettingOrders && !gettingMoreOrders) {
                        fetchMore();
                    }
                }}
                ListFooterComponent={<ListLoadMoreIndicator loading={gettingMoreOrders} />}
                refreshControl={
                    <RefreshControl
                        refreshing={gettingOrders}
                        onRefresh={refetchOrders}
                    />
                }/>}
        </View>
    )
}

const styles= StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor: '#fff'
    }
})

export default OrderListScreen;