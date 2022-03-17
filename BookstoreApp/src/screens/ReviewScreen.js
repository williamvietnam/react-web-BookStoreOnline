import React, { useEffect, useState, useCallback } from 'react';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { GET_REVIEWS_BY_BOOK, GET_REVIEWS } from '../api/reviewApi';
import RatingSummary from '../components/molecules/rating/RatingSummary';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Divider, Button } from 'react-native-elements';
import { COLOR_PRIMARY } from '../constants';
import { showToast, isCloseToBottom } from '../utils/common';
import { FlatList } from 'react-native-gesture-handler';
import RatingItem from '../components/molecules/rating/RatingItem';
import ListLoadMoreIndicator from '../components/atomics/ListLoadMore';
import Empty from '../components/atomics/Empty';
import { useToken } from '../hooks/customHooks';

function ReviewScreen(props) {

    const [star, setStar] = useState(undefined);

    const route = useRoute();
    const navigation = useNavigation();
    const [reviewData, setReviewData] = useState({
        reviews: [],
        totalCount: 0
    });

    const { bookId, title, thumbnail } = route.params;
    const [getReviewSummary, { loading: gettingReviewSummary, 
         data: reviewSummary = { getBookReviewsByBook: { bookReviews: [] } }}] = useLazyQuery(GET_REVIEWS_BY_BOOK, {
        onError(err) {
            showToast("Có lỗi xảy ra khi lấy đánh giá" + err.message);
        },
        fetchPolicy: 'cache-and-network',
        variables: {
            bookId: bookId,
            orderBy: 'createdAt_DESC',
            first: 0,
            skip: 0
        }
    });

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
                    book: {
                        id: bookId
                    },
                    rating: star
                },
                orderBy: 'createdAt_DESC',
                first: 20,
                skip: 0
            }
        })
    }

    useEffect(() => {
        getReviewSummary()
    }, []);

    useEffect(() => {
        refetchReviews();
    }, [star]);

    useFocusEffect(useCallback(()=>{
        getReviewSummary();
        refetchReviews();
    },[navigation]));

    function renderReview({ item }) {
        return <RatingItem containerStyle={{ paddingHorizontal: 12 }} key={item.id} review={item} />
    }

    function changeStar(star) {
        setStar(prev => {
            if (prev === star) {
                return undefined;
            }
            return star;
        })
    }

    const fetchMore = () => {

        if (reviewData.reviews.length < reviewData.totalCount) {
            getMoreReviews({
                variables: {
                    where: {
                        book: {
                            id: bookId
                        },
                        rating: star
                    },
                    orderBy: 'createdAt_DESC',
                    first: 20,
                    skip: reviewData.reviews.length
                }
            });
        }
    }

    const [, , tokenValid] = useToken();

    function navigateToCreateReviewScreen() {
        if (!tokenValid) {
            navigation.navigate("LoginSignupScreen", {
                from: {
                    stack: 'CreateReviewScreen',
                    params: {
                        book: {
                            thumbnail,
                            id: bookId,
                            title
                        }
                    }
                }
            });
        } else {
            navigation.navigate("CreateReviewScreen", {
                book: {
                    thumbnail,
                    id: bookId,
                    title
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <HeaderBackAction title="Đánh giá sản phẩm" />
            <FlatList ListHeaderComponent={<View style={styles.sectionSummary}>
                <RatingSummary bookReviews={reviewSummary} gettingBookReviews={gettingReviewSummary} />
                <View style={styles.sectionItem}>
                    <Button type="outline" onPress={navigateToCreateReviewScreen}
                        buttonStyle={{
                            borderColor: COLOR_PRIMARY,
                            alignSelf: 'center',
                            width: '100%',
                            marginTop: 12,
                            borderWidth: 1
                        }} title="Viết Đánh Giá"></Button>
                </View>
                <View style={styles.starCtn}>
                    <Button buttonStyle={{ ...styles.starBtn, backgroundColor: star === 5 ? 'lightblue' : '#ccc' }}
                        titleStyle={{ fontSize: 11 }} onPress={() => changeStar(5)}
                        icon={{ size: 12, color: 'gold', type: 'antdesign', name: "star" }} title="5"></Button>
                    <Button buttonStyle={{ ...styles.starBtn, backgroundColor: star === 4 ? 'lightblue' : '#ccc' }}
                        titleStyle={{ fontSize: 11 }} onPress={() => changeStar(4)}
                        icon={{ size: 12, color: 'gold', type: 'antdesign', name: "star" }} title="4"></Button>
                    <Button buttonStyle={{ ...styles.starBtn, backgroundColor: star === 3 ? 'lightblue' : '#ccc' }}
                        titleStyle={{ fontSize: 11 }} onPress={() => changeStar(3)}
                        icon={{ size: 12, color: 'gold', type: 'antdesign', name: "star" }} title="3"></Button>
                    <Button buttonStyle={{ ...styles.starBtn, backgroundColor: star === 2 ? 'lightblue' : '#ccc' }}
                        titleStyle={{ fontSize: 11 }} onPress={() => changeStar(2)}
                        icon={{ size: 12, color: 'gold', type: 'antdesign', name: "star" }} title="2"></Button>
                    <Button buttonStyle={{ ...styles.starBtn, backgroundColor: star === 1 ? 'lightblue' : '#ccc' }}
                        titleStyle={{ fontSize: 11 }} onPress={() => changeStar(1)}
                        icon={{ size: 12, color: 'gold', type: 'antdesign', name: "star" }} title="1"></Button>

                </View>
            </View>}
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
                        onRefresh={() => { refetchReviews(); getReviewSummary() }}
                    />
                }>

            </FlatList>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor:'#fff'
    },
    sectionSummary: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    sectionDivider: {
        height: 6,
        backgroundColor: '#ccc'
    },
    FlatList: {
    },
    starCtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 12
    },
    starBtn: {
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginRight: 6,
        backgroundColor: '#ccc'
    }
})

export default ReviewScreen;