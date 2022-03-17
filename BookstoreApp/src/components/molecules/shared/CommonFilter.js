import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import FilterItem from '../../atomics/FilterItem';
import { FILTER_TYPE_CAT, FILTER_TYPE_AUTHOR, FILTER_TYPE_PUBLISHER, FILTER_TYPE_RATING, COLOR_PRIMARY } from '../../../constants';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
    },
    filterName: {
        fontSize: 16,
        fontWeight: '700'
    },
    filterItemCtn: {
        marginVertical: 8,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    btnMore: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: COLOR_PRIMARY,
        borderRadius: 25,
        marginBottom: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnMoreText: {
        marginRight: 6
    }
});

function CommonFilter(props) {
    const { name, filterItems, type, hideName, hideBorder, showFull,onClickMore } = props;
    // const isFilterActive = (id) => {
    //     switch (filterType) {
    //         case FILTER_TYPE_CAT:
    //             if (id === filters.category) return true;
    //         case FILTER_TYPE_AUTHOR:
    //             if (id === filters.author) return true;
    //         case FILTER_TYPE_PUBLISHER:
    //             if (id === filters.publisher) return true;
    //         case FILTER_TYPE_RATING:
    //             if (id === filters.rating) return true;
    //     }
    // }
    const cutFilterItems = filterItems.slice(0, 4);
    return (
        <View style={{ ...styles.container, borderBottomWidth: hideBorder ? 0 : 1 }}>
            {!hideName && <Text style={styles.filterName}>{name}</Text>}
            <View style={styles.filterItemCtn}>
                {showFull && filterItems.map(item => {
                    return (
                        <FilterItem key={item.id} isSelected={true} type={type} value={{
                            id: item.id,
                            name: item.name ?? item.pseudonym
                        }}
                            name={item.name ?? item.pseudonym}></FilterItem>
                    )
                })}
                {!showFull && cutFilterItems.map(item => {
                    return (
                        <FilterItem key={item.id} isSelected={true} type={type} value={{
                            id: item.id,
                            name: item.name ?? item.pseudonym
                        }}
                            name={item.name ?? item.pseudonym}></FilterItem>
                    )
                })}
            </View>
            {!showFull && filterItems.length > 4 &&
                <TouchableOpacity onPress={onClickMore} style={styles.btnMore}>
                    <Text style={styles.btnMoreText}>Xem thêm</Text>
                    <Icon type="antdesign" name="right" size={18} color={COLOR_PRIMARY}></Icon>
                </TouchableOpacity>}
        </View>
    )
}

export default CommonFilter;