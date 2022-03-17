import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_WISH_LIST, REMOVE_BOOK_FROM_WISH_LIST } from '../api/bookApi';
import { showToast } from '../utils/common';
import WishListItem from '../components/atomics/WishListItem';
import Empty from '../components/atomics/Empty';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableRightActions from '../components/atomics/SwipeableRightActions';

function WishListScreen(props) {

    const { loading, data = { getWishList: { data: { books: [] } } } ,refetch} = useQuery(GET_WISH_LIST, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getWishList.statusCode !== 200) {
                showToast(data.getWishList.message);
            }
        }
    });
    const [removeFromWishList, { loading: removingFromWishList }] = useMutation(REMOVE_BOOK_FROM_WISH_LIST, {
        onError() {
            showToast("Có lỗi xảy ra, vui lòng thử lại sau");
        },
        onCompleted(data) {
            if (data.removeBookFromWishList.statusCode === 200) {
                showToast("Đã loại khỏi danh sách ưa thích");
                refetch();
            } else {
                showToast(data.removeBookFromWishList.message);
            }
        }
    });

    function renderItem({ item, index }) {
        return <Swipeable renderRightActions={() => <SwipeableRightActions
            deleting={removingFromWishList}
            onDelete={() => { removeFromWishList({
                variables: {
                    bookId: item.id
                }
            }) }}
        />}>
            <WishListItem book={item} />
        </Swipeable>
    }


    return (
        <View style={styles.container}>
            <HeaderBackAction title="Sản phẩm yêu thích" />
            {loading ? <View style={{ paddingTop: 150, height: '100%' }}>
                <ActivityIndicator animating />
            </View> : <FlatList data={data.getWishList.data.books}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={{ marginTop: 50 }}>
                        <Empty emptyText="Bạn chưa thích sản phẩm nào" />
                    </View>}></FlatList>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor: '#fff'
    }
})

export default WishListScreen;