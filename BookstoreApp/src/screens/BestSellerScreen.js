import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_BEST_SELLER_FOR_BROWSING } from '../api/bookApi';
import { showToast } from '../utils/common';
import BookGrid from '../components/organisms/books/BookGrid';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Header from '../components/organisms/shared/Header';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/vi-VN';
import { changeSortDirection } from '../redux/actions/userSettingsActions';
import { withApollo } from '@apollo/react-hoc'
import SelectedFilter from '../components/atomics/SelectedFilter';
import { FILTER_TYPE_AUTHOR, FILTER_TYPE_CAT, FILTER_TYPE_PUBLISHER, COLOR_PRIMARY, FILTER_TYPE_PRICE, FILTER_TYPE_RATING, FILTER_TYPE_COLLECTION, DATE_US } from '../constants';
import _ from 'lodash';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import DropDownHeader from '../components/atomics/DropdownHeader';
import moment from 'moment';
import HeaderBackAction from '../components/atomics/HeaderBackAction';

const width = Dimensions.get('window').width

const sortDirections = [
    {
        value: "all_time",
        label: "Tất cả thời gian"
    },
    {
        value: "this_week",
        label: "Tuần này",
    }, {
        value: "this_month",
        label: "Tháng này",
    }, {
        value: "this_quarter",
        label: "Quý này",
    }, {
        value: "this_year",
        label: "Năm nay"
    }
]
const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    optionContainer: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        height: 44,
        backgroundColor: "#fff",
        borderColor: "#e1e5eb",
        display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1.5,
    },
    orderByCtn: {
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-start'
    },
    picker: {
        width: 135,
        padding: 0,
        margin: 0,
        transform: [
            {
                scaleX: 0.8
            }, {
                scaleY: 0.8
            }
        ]
    },
    pickerItem: {
        fontWeight: '900'
    },
    rightComponent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center"
    },
    drawer: {
        shadowColor: '#000000', margin: 0,
        backgroundColor: '#fff',
        shadowOpacity: 0.8, shadowRadius: 3, position: 'absolute', zIndex: 111
    },
    drawerCtn: {
        width: '100%'
    },
    contentContainer: {
        width: '100%'
    },
    selectedFiltersCtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#fff',
        borderColor: "#e1e5eb",
        display: "flex",
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        flexWrap: 'wrap'
    },
});

function BestSellerScreen(props) {

    const { client } = props;

    const [bookData, setBookData] = useState({
        books: [],
        totalCount: 0
    });
    const [timeRange, setTimeRange] = useState({
        dateFrom: null,
        dateTo: null
    });
    const [timeLabel, setTimeLabel] = useState("all_time")

    const changeTimeRage = (value) => {
        const today = moment();
        switch (value) {
            case "this_week":
                setTimeRange({
                    dateFrom: today.startOf('week').format(DATE_US),
                    dateTo: today.endOf('week').format(DATE_US),
                });
                break;
            case "this_month":
                setTimeRange({
                    dateFrom: today.startOf('month').format(DATE_US),
                    dateTo: today.endOf('month').format(DATE_US),
                });
                break;
            case "this_quarter":
                setTimeRange({
                    dateFrom: today.startOf('quarter').format(DATE_US),
                    dateTo: today.endOf('quarter').format(DATE_US),
                });
                break;
            case "this_year":
                setTimeRange({
                    dateFrom: today.startOf('year').format(DATE_US),
                    dateTo: today.endOf('year').format(DATE_US),
                });
                break;
            case "all_time":
                setTimeRange({
                    dateFrom: null,
                    dateTo: null
                });
                break;
        }
    }

    const searchBarRef = useRef();
    const route = useRoute();
    const navigation = useNavigation();
    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setShowDropdown(false);
        });
        return unsubscribe;
    }, [navigation])
    const [getBooks, { loading: gettingBooks }] = useLazyQuery(GET_BEST_SELLER_FOR_BROWSING, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getBestSellerForBrowsing && data.getBestSellerForBrowsing.books) {
                showToast(Intl.NumberFormat().format(data.getBestSellerForBrowsing.totalCount) + " sản phẩm");
                setBookData({
                    books: data.getBestSellerForBrowsing.books,
                    totalCount: data.getBestSellerForBrowsing.totalCount
                });
            }
        }
    });

    const [getMoreBooks, { loading: gettingMoreBooks }] = useLazyQuery(GET_BEST_SELLER_FOR_BROWSING, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getBestSellerForBrowsing && data.getBestSellerForBrowsing.books) {
                setBookData(prev => ({
                    books: [...prev.books, ...data.getBestSellerForBrowsing.books],
                    totalCount: data.getBestSellerForBrowsing.totalCount
                }));
            }
        },

    });

    const fetchMore = () => {
        if (bookData.books.length < bookData.totalCount) {
            getMoreBooks({
                variables: {
                    first: 9,
                    skip: bookData.books.length,
                    dateFrom: timeRange.dateFrom,
                    dateTo: timeRange.dateTo
                }
            });
        }
    }

    const reloadBooks = () => {
        getBooks({
            variables: {
                skip: 0,
                first: 9,
                dateFrom: timeRange.dateFrom,
                dateTo: timeRange.dateTo
            }
        });
    }

    useEffect(() => {
        reloadBooks();
    }, [timeRange.dateTo, timeRange.dateFrom]);

    return (
        <View style={styles.container}>
            <HeaderBackAction showRight hideBack title="Sách bán chạy" showRightOptions={{
                hideHome: true
            }} hideHome onClickMore={() => setShowDropdown(!showDropdown)} />
            {showDropdown && <DropDownHeader hideBestSeller />}
            <View style={styles.optionContainer}>
                <View style={styles.orderByCtn}>
                    <Text style={{ width: 65, fontSize: 13, padding: 0 }}>Thời gian: </Text>
                    <Picker onValueChange={(value) => { changeTimeRage(value); setTimeLabel(value) }} selectedValue={timeLabel}
                        style={styles.picker} itemStyle={styles.pickerItem}>
                        {sortDirections.map(s => {
                            return <Picker.Item key={s.value} value={s.value} label={s.label}></Picker.Item>
                        })}
                    </Picker>
                </View>
            </View>
            {gettingBooks ? <ActivityIndicator style={{ marginTop: '45%' }} /> : <BookGrid books={bookData.books}
                reload={reloadBooks}
                loading={gettingBooks || gettingMoreBooks} fetchMore={fetchMore} />}
        </View>
    )

}

export default withApollo(BestSellerScreen);