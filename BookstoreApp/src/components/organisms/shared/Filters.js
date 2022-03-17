import React, { useState } from 'react';
import CommonFilter from '../../molecules/shared/CommonFilter';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLOR_PRIMARY, FILTER_TYPE_CAT, FILTER_TYPE_AUTHOR, FILTER_TYPE_PUBLISHER, FILTER_TYPE_RATING, FILTER_TYPE_COLLECTION } from '../../../constants';
import { Button, SearchBar } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { applyFilter, resetFilterTemp } from '../../../redux/actions/filtersActions';
import PriceFilter from '../../molecules/shared/PriceFilter';

const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: "flex"
    },
    header: {
        backgroundColor: COLOR_PRIMARY,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12
    },
    headerCenter: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '700'
    },
    headerBtnText: {
        color: "#fff"
    }
});

function renderFilterTypeName(type) {
    switch (type) {
        case FILTER_TYPE_CAT:
            return "Thể loại"
        case FILTER_TYPE_PUBLISHER:
            return "Nhà xuất bản"
        case FILTER_TYPE_AUTHOR:
            return "Tác giả";
        case FILTER_TYPE_COLLECTION:
            return "Tuyển tập";
        default: return "Lọc sách";
    }
}

function renderFilterItems(type) {
    switch (type) {
        case FILTER_TYPE_CAT:
            return "categories"
        case FILTER_TYPE_PUBLISHER:
            return "publishers"
        case FILTER_TYPE_AUTHOR:
            return "authors";
        case FILTER_TYPE_COLLECTION:
            return "collections";
        default: return false;
    }
}

function Filters(props) {

    const { closeDrawer, categories = [], publishers = [], authors = [], prices = [], ratings = [], collections=[],loading } = props;
    const dispatch = useDispatch();
    const [searchingFor, setSearching] = useState(undefined);
    const filterTypeName = renderFilterTypeName(searchingFor);
    const filterItemsName = renderFilterItems(searchingFor);
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const filteredItems = props[filterItemsName]?.filter(item => (item.name ?? item.pseudonym).toLowerCase().indexOf(searchKeyWord.toLowerCase()) >= 0);
    return (
        <View style={styles.container}>
            <ScrollView >
                {!searchingFor &&
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={closeDrawer}>
                                <Text style={styles.headerBtnText}>Đóng</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerCenter}>Lọc sách</Text>
                            <TouchableOpacity onPress={() => dispatch(resetFilterTemp())}>
                                <Text style={styles.headerBtnText}>Bỏ chọn</Text>
                            </TouchableOpacity>
                        </View>
                        <View >
                            <CommonFilter filterItems={categories} onClickMore={() => {setSearchKeyWord(""); setSearching(FILTER_TYPE_CAT)}} type={FILTER_TYPE_CAT} name="Thể loại" />
                            <PriceFilter filterItems={prices} name="Giá" />
                            <CommonFilter filterItems={ratings} type={FILTER_TYPE_RATING} showFull name="Đánh giá" />
                            <CommonFilter filterItems={collections} type={FILTER_TYPE_COLLECTION} onClickMore={() => {setSearchKeyWord(""); setSearching(FILTER_TYPE_COLLECTION)}} name="Tuyển tập" />
                            <CommonFilter filterItems={authors} type={FILTER_TYPE_AUTHOR} onClickMore={() => {setSearchKeyWord(""); setSearching(FILTER_TYPE_AUTHOR)}} name="Tác giả" />
                            <CommonFilter filterItems={publishers} type={FILTER_TYPE_PUBLISHER} onClickMore={() => {setSearchKeyWord(""); setSearching(FILTER_TYPE_PUBLISHER)}} name="Nhà xuất bản" />
                        </View></>}
                {searchingFor &&
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => setSearching(undefined)}>
                                <Text style={styles.headerBtnText}>Quay lại</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerCenter}>{renderFilterTypeName(searchingFor)}</Text>
                            <TouchableOpacity onPress={closeDrawer}>
                                <Text style={styles.headerBtnText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <SearchBar
                                value={searchKeyWord}
                                onChangeText={val => setSearchKeyWord(val)}
                                containerStyle={{
                                    height: 54,
                                    flex: 1,
                                    backgroundColor: '#ececec',
                                    borderWidth: 0,
                                    borderColor: 'transparent',
                                    borderBottomColor: 'transparent',
                                    borderTopColor: 'transparent'
                                }}
                                inputStyle={{
                                    height: 28,
                                    backgroundColor: "#fff",
                                    marginLeft: 5,
                                    fontSize: 13
                                }}
                                inputContainerStyle={{
                                    height: 36,
                                    backgroundColor: "#fff"
                                }} placeholder={`Tìm ${filterTypeName}`} />
                            <CommonFilter showFull filterItems={filteredItems ?? []} hideName hideBorder
                                type={searchingFor} />
                        </View>
                    </>
                }


            </ScrollView>
            <View style={{
                backgroundColor: "#fff",
                bottom: 0, padding: 12, paddingHorizontal: 16, width: '100%',
                height: 56, display: "flex", justifyContent: "center"
            }}>
                <Button onPress={() => {
                    dispatch(applyFilter());
                    if (searchingFor){
                        setSearching(undefined);
                    }
                }} loading={loading} title="Áp dụng" >

                </Button>
            </View>

        </View>
    )
}

export default Filters;