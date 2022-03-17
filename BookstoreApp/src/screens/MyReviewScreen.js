import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { useToken } from '../hooks/customHooks';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_REVIEWS } from '../api/reviewApi';
import { showToast, isCloseToBottom } from '../utils/common';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Empty from '../components/atomics/Empty';
import ListLoadMoreIndicator from '../components/atomics/ListLoadMore';
import RatingItem from '../components/molecules/rating/RatingItem';
import { Image } from 'react-native-elements';
import MyReviewItem from '../components/atomics/MyReviewItem';

function MyReviewScreen(props) {
    const navigation = useNavigation();
    const [reviewData, setReviewData] = useState({
        reviews: [],
        totalCount: 0
    });

    const [, userInfo = { id: undefined },] = useToken();

    const [getReviews, { loading: gettingReviews }] = useLazyQuery(GET_REVIEWS, {
        onError(err) {
            showToast("Có lỗi xảy ra khi lấy đánh giá");
            console.log(err.name)
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getBookReviews && data.getBookReviews.bookReviews) {
                setReviewData({
                    reviews: data.getBookReviews.bookReviews,
                    totalCount: data.getBookReviews.totalCount
                });
            }
        }
    });

    const [getMoreReviews, { loading: gettingMoreReviews }] = useLazyQuery(GET_REVIEWS, {
        onError(err) {
            showToast("Có lỗi xảy ra khi lấy đánh giá");
            console.log(err.name)
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getBookReviews && data.getBookReviews.bookReviews) {
                setReviewData(prev => ({
                    reviews: [...prev.reviews, ...data.getBookReviews.bookReviews],
                    totalCount: data.getBookReviews.totalCount
                }));
            }
        }
    });
    function refetchReviews() {
        getReviews({
            variables: {
                where: {
                    author: {
                        id: userInfo.id
                    },
                },
                orderBy: 'createdAt_DESC',
                first: 10,
                skip: 0
            }
        })
    }

    useEffect(() => {
        if (userInfo.id) {
            refetchReviews();
        }
    }, [userInfo.id]);

    useFocusEffect(useCallback(() => {
        refetchReviews();
    }, [navigation]));

    function renderReview({ item }) {
        return <MyReviewItem review={item}/>
    }

    const fetchMore = () => {

        if (reviewData.reviews.length < reviewData.totalCount && userInfo.id) {
            getMoreReviews({
                variables: {
                    where: {
                        author: {
                            id: userInfo.id
                        },
                    },
                    orderBy: 'createdAt_DESC',
                    first: 10,
                    skip: reviewData.reviews.length
                }
            });
        }
    }
    return (
        <View style={styles.container}>
            <HeaderBackAction title="Nhận xét của tôi" />
            <FlatList
                ListEmptyComponent={Empty}
                ListFooterComponent={<ListLoadMoreIndicator loading={gettingMoreReviews} />}
                data={reviewData.reviews} renderItem={renderReview}
                onScroll={(e) => {
                    if (isCloseToBottom(e.nativeEvent) && !gettingReviews && !gettingMoreReviews) {
                        fetchMore();
                    }
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={gettingReviews}
                        onRefresh={() => { refetchReviews(); }}
                    />
                } />
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

export default MyReviewScreen;