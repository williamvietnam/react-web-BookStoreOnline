import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet, View, useWindowDimensions, ToastAndroid, Platform, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import BookSectionItem from '../../molecules/books/BookSectionItem';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { GET_BEST_SELLER_FOR_BROWSING, GET_BOOKS_FOR_BROWSING } from '../../../api/bookApi';
import Empty from '../../atomics/Empty';
import { showToast } from '../../../utils/common';

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 8,
        zIndex: 1,
        marginBottom: 8
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    sectionName: {
        fontSize: 16,
        fontWeight: "700"
    }
});

function BookSection(props) {

    const { name, variables, isBestSeller } = props;
    const { width, height } = useWindowDimensions();

    const _renderItem = ({ item, index }) => {
        return (
            <BookSectionItem book={item} />
        );
    }
    const [getBestSeller, { loadingBestSeller, data: dataBestSeller = { getBestSellerForBrowsing: { books: [] } } }] = useLazyQuery(GET_BEST_SELLER_FOR_BROWSING, {
        onError(err) {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables
    });

    const [getBooks,{ loading, data = { getBooksForBrowsing: { books: [] } } }] = useLazyQuery(GET_BOOKS_FOR_BROWSING, {
        onError(err) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Có lỗi xảy ra khi lấy dữ liệu", 3000);
            } else {
            }
        },
        variables: {
            ...variables
        }
    });

    useEffect(() => {
        if (isBestSeller) {
            getBestSeller();
        } else {
            getBooks();
        }
    },[]);
    if (isBestSeller){
        return(
            <View style={styles.outerContainer}>
            <View style={styles.sectionHeader} >
                <Text style={styles.sectionName}>{name}</Text>
            </View>
            {loadingBestSeller ? <ActivityIndicator /> : dataBestSeller.getBestSellerForBrowsing.books.length?
            <Carousel activeSlideAlignment="start" enableSnap={false} 
            data={dataBestSeller.getBestSellerForBrowsing.books} style={{ backgroundColor: "#fff" }}
                sliderWidth={width} itemWidth={100} renderItem={_renderItem}>

            </Carousel>:<Empty /> }
        </View>
        )
    }
    return (
        <View style={styles.outerContainer}>
            <View style={styles.sectionHeader} >
                <Text style={styles.sectionName}>{name}</Text>
            </View>
            {loading ? <ActivityIndicator /> : data.getBooksForBrowsing.books.length? 
            <Carousel activeSlideAlignment="start"
             enableSnap={false} data={data.getBooksForBrowsing.books} style={{ backgroundColor: "#fff" }}
                sliderWidth={width} itemWidth={100} renderItem={_renderItem}>

            </Carousel>: <Empty />}
        </View>
    )
}

export default BookSection;