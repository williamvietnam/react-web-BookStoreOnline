import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_BOOKS_FOR_BROWSING } from '../api/bookApi';
import { showToast } from '../utils/common';
import BookGrid from '../components/organisms/books/BookGrid';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Header from '../components/organisms/shared/Header';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/vi-VN';
import Drawer from 'react-native-drawer-layout';
import Filters from '../components/organisms/shared/Filters';
import { useSelector, useDispatch } from 'react-redux';
import { changeSortDirection } from '../redux/actions/userSettingsActions';
import { withApollo } from '@apollo/react-hoc'
import { GET_CATEGORIES_BASIC } from '../api/categoryApi';
import { GET_AUTHORS_BASIC } from '../api/authorApi';
import { GET_PUBLISHERS_BASIC } from '../api/publisherApi';
import SelectedFilter from '../components/atomics/SelectedFilter';
import { FILTER_TYPE_AUTHOR, FILTER_TYPE_CAT, FILTER_TYPE_PUBLISHER, COLOR_PRIMARY, FILTER_TYPE_PRICE, FILTER_TYPE_RATING, FILTER_TYPE_COLLECTION } from '../constants';
import { GET_COLLECTIONS_BASIC } from '../api/collectionApi';
import _ from 'lodash';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import DropDownHeader from '../components/atomics/DropdownHeader';
const width = Dimensions.get('window').width

const filterItemsPrice = [{
    range: [50000],
    id: '1',
    operator: 'lt',
    name: `Dưới 50,000`
}, {
    range: [50000, 100000],
    id: '2',
    operator: 'between',
    name: `Từ 50,000 đến 100,000`
}, {
    range: [100000, 200000],
    id: '3',
    operator: 'between',
    name: `Từ 100,000 đến 200,000`
}, {
    range: [200000, 300000],
    id: '5',
    operator: 'between',
    name: `Từ 200,000 đến 300,000`
}, {
    range: [300000, 400000],
    id: '6',
    operator: 'between',
    name: `Từ 300,000 đến 400,000`
}, {
    range: [400000, 500000],
    id: '7',
    operator: 'between',
    name: `Từ 400,000 đến 500,000`
}, {
    range: [500000, 1000000],
    id: '8',
    operator: 'between',
    name: `Từ 500,000 đến 1,000,000`
}, {
    range: [1000000],
    id: '9',
    operator: 'gt',
    name: `Trên 1,000,000`
}];

const filterItemsRating = [{
    id: 5,
    name: "Từ 5 sao"
}, {
    id: 4,
    name: "Từ 4 sao"
}, {
    id: 3,
    name: "Từ 3 sao"
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

function BookScreen(props) {

    const { client } = props;

    const [bookData, setBookData] = useState({
        books: [],
        totalCount: 0
    });
    const drawerRef = useRef();
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
    const [getBooks, { loading: gettingBooks }] = useLazyQuery(GET_BOOKS_FOR_BROWSING, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getBooksForBrowsing && data.getBooksForBrowsing.books) {
                showToast(Intl.NumberFormat().format(data.getBooksForBrowsing.totalCount) + " sản phẩm");
                setBookData({
                    books: data.getBooksForBrowsing.books,
                    totalCount: data.getBooksForBrowsing.totalCount
                });
            }
            drawerRef.current.closeDrawer();
        }
    });

    const [getMoreBooks, { loading: gettingMoreBooks }] = useLazyQuery(GET_BOOKS_FOR_BROWSING, {
        onError() {
            showToast("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getBooksForBrowsing && data.getBooksForBrowsing.books) {
                setBookData(prev => ({
                    books: [...prev.books, ...data.getBooksForBrowsing.books],
                    totalCount: data.getBooksForBrowsing.totalCount
                }));
            }
        },

    });

    const fetchMore = () => {
        if (bookData.books.length < bookData.totalCount) {
            let where = {};
            if (filters.price) {
                if (filters.price.operator === 'gt') {
                    where = {
                        title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                        categories_some: filters.category?{
                            id: filters.category.id
                        }:undefined,
                        authors_some: filters.author?{
                            id: filters.author.id
                        }: undefined,
                        collections_some: filters.collection ? {
                            id: filters.collection.id
                        } : undefined,
                        publisher: filters.publisher?{
                            id: filters.publisher.id
                        }:undefined,
                        avgRating_gte: filters.rating?.id,
                        basePrice_gt: filters.price.range[0],
                    }
                } else if (filters.price.operator === 'lt') {
                    where = {
                        title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                        categories_some: filters.category?{
                            id: filters.category.id
                        }:undefined,
                        authors_some: filters.author?{
                            id: filters.author.id
                        }: undefined,
                        collections_some: filters.collection ? {
                            id: filters.collection.id
                        } : undefined,
                        publisher: filters.publisher?{
                            id: filters.publisher.id
                        }:undefined,
                        avgRating_gte: filters.rating?.id,
                        basePrice_lt: filters.price.range[0],
                    }
                } else if (filters.price.operator === 'between') {
                    where = {
                        AND: [{
                            title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                            categories_some: filters.category?{
                                id: filters.category.id
                            }:undefined,
                            authors_some: filters.author?{
                                id: filters.author.id
                            }: undefined,
                            collections_some: filters.collection ? {
                                id: filters.collection.id
                            } : undefined,
                            publisher: filters.publisher?{
                                id: filters.publisher.id
                            }:undefined,
                            basePrice_gt: filters.price.range[0],
                            avgRating_gte: filters.rating?.id,
                        }, {
                            title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                            categories_some: filters.category?{
                                id: filters.category.id
                            }:undefined,
                            authors_some: filters.author?{
                                id: filters.author.id
                            }: undefined,
                            collections_some: filters.collection ? {
                                id: filters.collection.id
                            } : undefined,
                            publisher: filters.publisher?{
                                id: filters.publisher.id
                            }:undefined,
                            avgRating_gte: filters.rating?.id,
                            basePrice_lt: filters.price.range[1],
                        }]
                    }
                }
            } else {
                where = {
                    title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                    categories_some: filters.category?{
                        id: filters.category.id
                    }:undefined,
                    authors_some: filters.author?{
                        id: filters.author.id
                    }: undefined,
                    collections_some: filters.collection ? {
                        id: filters.collection.id
                    } : undefined,
                    publisher: filters.publisher?{
                        id: filters.publisher.id
                    }:undefined,
                    // basePrice: filters.price,
                    avgRating_gte: filters.rating?.id,
                }
            }
            getMoreBooks({
                variables: {
                    where,
                    orderBy: userSettings.sortDirection,
                    first: 9,
                    skip: bookData.books.length
                }
            });
        }
    }

    const [drawerOpen, setDrawerOpen] = useState(false);
    function openFilterDrawer() {
        console.log('open drawer')
        // setDrawerOpen(true);
        drawerRef.current.openDrawer();
    }

    function onChangeDrawer() {
        console.log('close drawer')
        // setDrawerOpen(isOpen);
        drawerRef.current.closeDrawer();

    }

    const { filters, userSettings } = useSelector(state => ({
        filters: state.filters,
        userSettings: state.userSettings
    }));

    const dispatch = useDispatch();

    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        (async function getFilters() {
            try {
                const resCat = await client.query({
                    query: GET_CATEGORIES_BASIC,
                    variables: {
                        where: {
                            books_some: {
                            }
                        },
                        orderBy: "name_ASC"
                    },
                });
                const resAuth = await client.query({
                    query: GET_AUTHORS_BASIC,
                    variables: {
                        where: {
                            books_some: {
                            }
                        },
                        orderBy: "pseudonym_ASC"
                    }
                });
                const resPub = await client.query({
                    query: GET_PUBLISHERS_BASIC,
                    variables: {
                        where: {
                            books_some: {
                            }
                        },
                        orderBy: "name_ASC"
                    }
                });
                const resCol = await client.query({
                    query: GET_COLLECTIONS_BASIC,
                    variables: {
                        where: {

                        },
                        orderBy: "name_ASC"
                    }
                });
                setAuthors(resAuth.data.getAuthors);
                setCategories(resCat.data.getCategories);
                setPublishers(resPub.data.getPublishers);
                setCollections(resCol.data.getCollections?.collections);

            } catch (err) {
                showToast("Có lỗi xảy ra khi lấy dữ liệu");
            }
        })()

    }, [/*filters.category, filters.rating,filters.author, filters.publisher, filters.price ? filters.price.id : undefined*/])

    const reloadBooks = () => {
        let where = {};
        if (filters.price) {
            if (filters.price.operator === 'gt') {
                where = {
                    title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                    categories_some: filters.category?{
                        id: filters.category.id
                    }:undefined,
                    authors_some: filters.author?{
                        id: filters.author.id
                    }: undefined,
                    collections_some: filters.collection ? {
                        id: filters.collection.id
                    } : undefined,
                    publisher: filters.publisher?{
                        id: filters.publisher.id
                    }:undefined,
                    avgRating_gte: filters.rating?.id,
                    basePrice_gt: filters.price.range[0],
                }
            } else if (filters.price.operator === 'lt') {
                where = {
                    title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                    categories_some: filters.category?{
                        id: filters.category.id
                    }:undefined,
                    authors_some: filters.author?{
                        id: filters.author.id
                    }: undefined,
                    collections_some: filters.collection ? {
                        id: filters.collection.id
                    } : undefined,
                    publisher: filters.publisher?{
                        id: filters.publisher.id
                    }:undefined,
                    avgRating_gte: filters.rating?.id,
                    basePrice_lt: filters.price.range[0],
                }
            } else if (filters.price.operator === 'between') {
                where = {
                    AND: [{
                        title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                        categories_some: filters.category?{
                            id: filters.category.id
                        }:undefined,
                        authors_some: filters.author?{
                            id: filters.author.id
                        }: undefined,
                        collections_some: filters.collection ? {
                            id: filters.collection.id
                        } : undefined,
                        publisher: filters.publisher?{
                            id: filters.publisher.id
                        }:undefined,
                        basePrice_gt: filters.price.range[0],
                        avgRating_gte: filters.rating?.id,
                    }, {
                        title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                        categories_some: filters.category?{
                            id: filters.category.id
                        }:undefined,
                        authors_some: filters.author?{
                            id: filters.author.id
                        }: undefined,
                        collections_some: filters.collection ? {
                            id: filters.collection.id
                        } : undefined,
                        publisher: filters.publisher?{
                            id: filters.publisher.id
                        }:undefined,
                        avgRating_gte: filters.rating?.id,
                        basePrice_lt: filters.price.range[1],
                    }]
                }
            }
        } else {
            where = {
                title_contains: route.params ? route.params.searchKeyword ?? undefined : undefined,
                categories_some: filters.category?{
                    id: filters.category.id
                }:undefined,
                authors_some: filters.author?{
                    id: filters.author.id
                }: undefined,
                collections_some: filters.collection ? {
                    id: filters.collection.id
                } : undefined,
                publisher: filters.publisher?{
                    id: filters.publisher.id
                }:undefined,
                // basePrice: filters.price,
                avgRating_gte: filters.rating?.id,
            }
        }
        getBooks({
            variables: {
                where,
                orderBy: userSettings.sortDirection,
                skip: 0,
                first: 9
            }
        });
    }

    useEffect(() => {
        reloadBooks()
    }, [
        userSettings.sortDirection,
        route.params ? route.params.searchKeyword : undefined,
        filters.price ? filters.price.id : undefined,
        filters.publisher?.id ?? undefined,
        filters.collection?.id ?? undefined,
        filters.category?.id ?? undefined,
        filters.rating?.id ?? undefined,
        filters.author?.id ?? undefined])//effect này chỉ chạy khi một trong những giá trị trong array thay đổi với lần render trước đó

    const selectedAuthor = authors?.find(a => a.id === filters.author?.id);
    const selectedCat = categories?.find(c => c.id === filters.category?.id);
    const selectedPublisher = publishers?.find(p => p.id === filters.publisher?.id);
    const selectedPrice = filterItemsPrice?.find(p => p.id === filters.price?.id);
    const selectedRating = filterItemsRating?.find(r => r.id === filters.rating?.id);
    const selectedCollection = collections?.find(c => c.id === filters.collection?.id);

    const authorsPassedDown = filters.authorTemporary ? _.sortBy(authors, function (item) {
        return item.id === filters.authorTemporary.id ? 0 : 1;
    }) : authors;
    const catPassedDown = filters.categoryTemporary ? _.sortBy(categories, function (item) {
        return item.id === filters.categoryTemporary.id ? 0 : 1;
    }) : categories;
    const pubPassedDown = filters.publisherTemporary ? _.sortBy(publishers, function (item) {
        return item.id === filters.publisherTemporary.id ? 0 : 1;
    }) : publishers;
    const colPassedDown = filters.collectionTemporary ? _.sortBy(collections, function (item) {
        return item.id === filters.collectionTemporary.id ? 0 : 1;
    }) : collections;

    const isFiltered = filters.author || filters.category || filters.publisher || filters.price || filters.rating || filters.collection;

    return (
        <Drawer renderNavigationView={() =>
            <Filters categories={catPassedDown}
                authors={authorsPassedDown}
                publishers={pubPassedDown}
                loading={gettingBooks}
                collections={colPassedDown}
                ratings={filterItemsRating}
                prices={filterItemsPrice}
                closeDrawer={onChangeDrawer} />}
            ref={drawerRef}
            drawerWidth={width * 0.9}
            drawerBackgroundColor="#fff"
            contentContainerStyle={styles.contentContainer}
            style={styles.drawerCtn}
            onChange={onChangeDrawer}
            drawerPosition="right"
            fullHeight={true}
            drawerStyle={styles.drawer}
            type='overlay' >
            <View style={styles.container}>
                <Header searchBarRef={searchBarRef} showMore onClickMore={() => setShowDropdown(!showDropdown)}
                    showCancel={false}
                    searchKeyword={route.params ? route.params.searchKeyword : ''} />
                {showDropdown && <DropDownHeader hideBook />}
                <View style={styles.optionContainer}>
                    <View style={styles.orderByCtn}>
                        <Text style={{ width: 55, fontSize: 13, padding: 0 }}>Sắp xếp: </Text>
                        <Picker selectedValue={userSettings.sortDirection} onValueChange={(val) => {
                            dispatch(changeSortDirection(val));
                        }}
                            style={styles.picker} itemStyle={styles.pickerItem}>
                            <Picker.Item value="createdAt_DESC" label="Mới nhất"></Picker.Item>
                            <Picker.Item value="avgRating_DESC" label="Đánh giá cao"></Picker.Item>
                            <Picker.Item value="avgRating_ASC" label="Đánh giá thấp"></Picker.Item>
                            <Picker.Item value="title_ASC" label="Tên A-Z"></Picker.Item>
                            <Picker.Item value="title_DESC" label="Tên Z-A"></Picker.Item>
                            <Picker.Item value="basePrice_ASC" label="Giá tăng dần"></Picker.Item>
                            <Picker.Item value="basePrice_DESC" label="Giá giảm dần"></Picker.Item>
                        </Picker>
                    </View>
                    <TouchableOpacity onPress={openFilterDrawer} style={styles.rightComponent}>
                        <Icon type="material-community" name={isFiltered ? 'filter' : "filter-outline"}
                            color={isFiltered ? COLOR_PRIMARY : "#aaa"} size={24}
                            style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 13 }}>Lọc</Text>
                    </TouchableOpacity>
                </View>
                {isFiltered && <View style={styles.selectedFiltersCtn}>
                    {selectedAuthor && <SelectedFilter text={selectedAuthor.pseudonym}
                        value={selectedAuthor} type={FILTER_TYPE_AUTHOR} />}
                    {selectedCat && <SelectedFilter text={selectedCat.name}
                        value={selectedCat} type={FILTER_TYPE_CAT} />}
                    {selectedPublisher && <SelectedFilter text={selectedPublisher.name}
                        value={selectedPublisher} type={FILTER_TYPE_PUBLISHER} />}
                    {selectedPrice && <SelectedFilter text={selectedPrice.name}
                        value={selectedPrice} type={FILTER_TYPE_PRICE} />}
                    {selectedRating && <SelectedFilter text={selectedRating.name}
                        value={selectedRating} type={FILTER_TYPE_RATING} />}
                    {selectedCollection && <SelectedFilter text={selectedCollection.name}
                        value={selectedCollection} type={FILTER_TYPE_COLLECTION} />}
                </View>}
                {gettingBooks ? <ActivityIndicator style={{ marginTop: '45%' }} /> : <BookGrid books={bookData.books}
                    reload={reloadBooks}
                    loading={gettingBooks || gettingMoreBooks} fetchMore={fetchMore} />}
            </View>
        </Drawer>
    )

}

export default withApollo(BookScreen);