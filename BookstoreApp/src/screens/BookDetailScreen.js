import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import { GET_BOOK, ADD_BOOK_TO_WISH_LIST } from '../api/bookApi';
import { GET_REVIEWS_BY_BOOK } from '../api/reviewApi';
import { showToast, calculateDiscount, roundHalf } from '../utils/common';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Image, Icon, Rating, Button, Divider } from 'react-native-elements';
import { calculateReviewScore } from '../utils/common';
import { COLOR_PRIMARY, COLOR_BUTTON_PRIMARY, DATE_VN } from '../constants';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import HTML from 'react-native-render-html';
import 'intl';
import 'intl/locale-data/jsonp/vi-VN';
import { Bar } from 'react-native-progress';
import RatingSummary from '../components/molecules/rating/RatingSummary';
import RatingItem from '../components/molecules/rating/RatingItem';
import BookSection from '../components/organisms/books/BookSection';
import HeaderBackAction from '../components/atomics/HeaderBackAction';
import DropDownHeader from '../components/atomics/DropdownHeader';
import { useToken } from '../hooks/customHooks';
import { useDispatch, useSelector } from 'react-redux';
import { addSingleItemToCartAysnc } from '../redux/actions/cartAction';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: "#ccc"
    },
    section: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 8,
        paddingHorizontal: 10,
        zIndex: 1,
        marginBottom: 8
    },
    sectionItem: {
        marginVertical: 8
    },
    bookTitle: {
        fontSize: 16
    },
    ratingSmCtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 6,
        alignItems: "center",
        flexWrap: 'wrap'
    },
    ratingScoreSm: {
        marginRight: 10
    },
    totalReviewSm: {
        color: COLOR_PRIMARY,
        fontWeight: '700',
        fontSize: 16
    },
    priceCtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "center",
        flexWrap: 'wrap'
    },
    discountedPrice: {
        fontSize: 22,
        fontWeight: '700',
        marginRight: 12
    },
    basePrice: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: "#ccc",
        marginRight: 12
    },
    discountRate: {
        fontSize: 16,
        color: "#000",
        marginRight: 12
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700'
    },
    detailRowOdd: {
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 8,
        justifyContent: 'space-between'
    },
    detailRowEven: {
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        backgroundColor: "#ededed"
    },
})

function BookDetailScreen(props) {
    const { route, navigation } = props;
    const { id } = route.params;
    const { loading: gettingBook, data: dataBook = { getBook: {} }, refetch: refetchBook } = useQuery(GET_BOOK, {
        onError(err) {
            showToast("Có lỗi xảy ra khi lấy dữ liệu sách" + err.message);
        },
        onCompleted(data) {
            console.log(data);
        },
        variables: {
            id
        }
    });

    const [getBookReviews, { loading: gettingBookReviews, data: bookReviews = { getBookReviewsByBook: { bookReviews: [] } } }] = useLazyQuery(GET_REVIEWS_BY_BOOK, {
        onError(err) {
            showToast("Có lỗi xảy ra khi lấy dữ liệu sách" + err.message);
        },
        fetchPolicy: 'cache-and-network',
        variables: {
            bookId: id,
            orderBy: 'createdAt_DESC',
            first: 2,
            skip: 0
        }
    })

    useFocusEffect(useCallback(() => {
        getBookReviews();
    }, [navigation]))

    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setShowDropdown(false);
        });
        return unsubscribe;
    }, [navigation]);
    const [, , tokenValid] = useToken();
    function navigateToLogin(params) {
        navigation.navigate("LoginSignupScreen", params)
    }

    const [addToWishList, { loading: addingToWishList }] = useMutation(ADD_BOOK_TO_WISH_LIST, {
        onError() {
            showToast("Có lỗi xảy ra, vui lòng thử lại sau");
        },
        onCompleted(data) {
            showToast(data.addBookToWishList.message);
        }
    })
    const client = useApolloClient();
    const dispatch = useDispatch();
    const { cart } = useSelector(state => ({
        cart: state.cart
    }))
    if (gettingBook) {
        return <ActivityIndicator />
    }

    const { thumbnail,
        title,
        basePrice,
        discounts,
        publisher,
        authors,
        categories,
        format,
        isbn,
        sku,
        description,
        pages,
        translator,
        dimensions,
        publishedDate
    } = dataBook.getBook;
    const avgRating = calculateReviewScore(bookReviews.getBookReviewsByBook);
    const [discountedPrice, discountRate, discountAmmount] = calculateDiscount(basePrice, discounts);
    // const { fiveStar, fourStar, threeStar, twoStar, oneStar, totalCount } = bookReviews.getBookReviewsByBook;
    // const fourStarPercent = roundHalf(fourStar / totalCount * 100);
    // const threeStarPercent = roundHalf(threeStar / totalCount * 100);
    // const twoStarPercent = roundHalf(twoStar / totalCount * 100);
    // const fiveStarPercent = roundHalf(fiveStar / totalCount * 100);
    // const oneStarPercent = roundHalf(oneStar / totalCount * 100);

    function navigateToReviewScreen() {
        navigation.navigate("ReviewScreen", {
            bookId: id,
            title,
            thumbnail
        })
    };


    function navigateToCreateReviewScreen() {
        if (!tokenValid) {
            navigation.navigate("LoginSignupScreen", {
                from: {
                    stack: 'CreateReviewScreen',
                    params: {
                        book: {
                            thumbnail,
                            id,
                            title
                        }
                    }
                }
            });
        } else {
            navigation.navigate("CreateReviewScreen", {
                book: {
                    thumbnail,
                    id,
                    title
                }
            })
        }
    }

    return (
        <View style={{ display: 'flex', height: '100%' }}>
            <HeaderBackAction showRight onClickMore={() => setShowDropdown(!showDropdown)} />
            {showDropdown && <DropDownHeader showHeart={() => {
                if (!tokenValid) {
                    navigateToLogin({
                        from: {
                            stack: 'BookDetailScreen',
                            params: {
                                id
                            }
                        }
                    })
                } else {
                    setShowDropdown(false);
                    addToWishList({
                        variables: {
                            bookId: id
                        }
                    })
                }
            }} />}
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl
                    refreshing={gettingBook}
                    onRefresh={refetchBook}
                />}>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.sectionItem}>
                        <Image source={{
                            uri: thumbnail
                        }} style={{ height: 300, resizeMode: 'contain' }} containerStyle={{ width: '100%' }}
                            PlaceholderContent={<Icon type="antdesign" name="picture" />}></Image>
                    </TouchableOpacity>
                    <View style={styles.sectionItem}>
                        <Text style={styles.bookTitle}>{title}</Text>
                        {gettingBookReviews ? <ActivityIndicator /> :
                            avgRating > 0 && <View style={styles.ratingSmCtn}>
                                <Rating style={styles.ratingScoreSm}
                                    readonly startingValue={avgRating}
                                    ratingBackgroundColor="#ccc"
                                    imageSize={16} ratingCount={5} />
                                <TouchableOpacity onPress={navigateToReviewScreen}>
                                    <Text style={styles.totalReviewSm}>(Xem {bookReviews.getBookReviewsByBook.totalCount} đánh giá)</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>
                    <View style={styles.sectionItem}>
                        <View style={styles.priceCtn}>
                            <NumberFormat value={discountedPrice}
                                renderText={value => <Text style={styles.discountedPrice}>{value}</Text>}
                                displayType={'text'} thousandSeparator={true} suffix=" đ" />
                            {discountRate > 0 && <><NumberFormat value={basePrice}
                                renderText={value => <Text style={styles.basePrice}>{value}</Text>}
                                displayType={'text'} thousandSeparator={true} suffix="đ" />
                                <NumberFormat value={discountRate * 100}
                                    renderText={value => <Text style={styles.discountRate}>{value}</Text>}
                                    displayType={'text'} thousandSeparator={true} prefix="-" suffix="%" /></>}
                        </View>
                    </View>
                    <View style={styles.sectionItem}>
                        <Button buttonStyle={{ backgroundColor: COLOR_BUTTON_PRIMARY }}
                            loading={cart.adding} disabled={cart.adding} disabledStyle={{ backgroundColor: COLOR_BUTTON_PRIMARY }}
                            onPress={() => dispatch(addSingleItemToCartAysnc(client, dataBook.getBook, 1))}
                            title="Chọn Mua"></Button>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionItem}>
                        <Text style={styles.sectionTitle}>Thông Tin Chi Tiết</Text>
                    </View>
                    <View style={styles.sectionItem}>
                        <View style={styles.detailRowEven}>
                            <Text>Nhà xuất bản</Text>
                            <Text>{publisher.name}</Text>
                        </View>
                        <View style={styles.detailRowOdd}>
                            <Text>Ngày xuất bản</Text>
                            <Text>{moment(publishedDate).format(DATE_VN)}</Text>
                        </View>
                        <View style={styles.detailRowEven}>
                            <Text>Kích thước</Text>
                            <Text>{dimensions}</Text>
                        </View>
                        <View style={styles.detailRowOdd}>
                            <Text>Số trang</Text>
                            <Text>{pages}</Text>
                        </View>
                        <View style={styles.detailRowEven}>
                            <Text>ISBN</Text>
                            <Text>{isbn}</Text>
                        </View>
                        <View style={styles.detailRowOdd}>
                            <Text>SKU</Text>
                            <Text>{sku}</Text>
                        </View>
                        <View style={styles.detailRowEven}>
                            <Text>Dịch giả</Text>
                            <Text>{translator}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionItem}>
                        <Text style={styles.sectionTitle}>Mô Tả</Text>
                    </View>
                    <View style={styles.sectionItem}>
                        <HTML containerStyle={{
                            maxHeight: 200,
                            overflow: 'hidden'
                        }} html={description}>Mô tả</HTML>
                    </View>
                    <View style={styles.sectionItem}>
                        <Button type="outline" onPress={() => navigation.navigate("BookDescriptionScreen", {
                            description
                        })}
                            buttonStyle={{
                                borderColor: COLOR_PRIMARY,
                                alignSelf: 'center',
                                width: '50%'
                            }} title="Xem Tất Cả"></Button>
                    </View>
                </View>
                <View style={{ ...styles.section, paddingHorizontal: 0 }}>
                    <View style={{
                        ...styles.sectionItem, paddingHorizontal: 10, alignItems: 'center',
                        display: "flex", flexDirection: 'row', justifyContent: 'space-between'
                    }}>
                        <Text style={styles.sectionTitle}>Khách Hàng Đánh Giá</Text>
                        {bookReviews.getBookReviewsByBook.totalCount > 0 && <TouchableOpacity onPress={navigateToReviewScreen}><Text style={{ color: COLOR_PRIMARY, fontWeight: '700', fontSize: 13 }}>XEM TẤT CẢ</Text></TouchableOpacity>}
                    </View>
                    <View style={styles.sectionItem}>
                        <RatingSummary bookReviews={bookReviews} gettingBookReviews={gettingBookReviews} />
                    </View>
                    <View style={styles.sectionItem}>
                        {bookReviews.getBookReviewsByBook.bookReviews?.map(review => (
                            <RatingItem hideReplies key={review.id} review={review} />
                        ))}
                    </View>
                    {bookReviews.getBookReviewsByBook.totalCount > 2 && <View style={{
                        ...styles.sectionItem,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderTopWidth: 1,
                        borderColor: "#ccc",
                        borderBottomWidth: 1
                    }}>
                        <TouchableOpacity onPress={navigateToReviewScreen}><Text style={{ color: COLOR_PRIMARY }}>Xem tất cả {bookReviews.getBookReviewsByBook.totalCount} đánh giá</Text></TouchableOpacity>
                    </View>
                    }
                    <View style={styles.sectionItem}>
                        <Button type="outline" onPress={navigateToCreateReviewScreen}
                            buttonStyle={{
                                borderColor: COLOR_PRIMARY,
                                alignSelf: 'center',
                                width: '50%'
                            }} title="Viết Đánh Giá"></Button>
                    </View>
                </View>
                <BookSection name="Cùng Tác Giả" variables={{
                    where: {
                        authors_some: {
                            id_in: authors.map(a => a.id)
                        }
                    },
                    orderBy: 'createdAt_DESC',
                    first: 9,
                    skip: 0
                }}></BookSection>
                <BookSection name="Cùng Thể Loại" variables={{
                    where: {
                        categories_some: {
                            id_in: categories.map(c => c.id)
                        }
                    },
                    orderBy: 'createdAt_DESC',
                    first: 9,
                    skip: 0
                }}></BookSection>
            </ScrollView>
        </View>
    )
}

export default BookDetailScreen;