import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { changeFilter } from '../../../redux/actions/filtersActions';
import { FILTER_TYPE_PRICE } from '../../../constants';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import { View, Text, StyleSheet } from 'react-native';
import FilterItem from '../../atomics/FilterItem';

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
    }
});

function PriceFilter(props) {

    const { filters, changeFilter, filterItems } = props;

    const isFilterActive = (range) => {
        if (_.isEqual(range, filters.price ? filters.price.range : [])) return true;
    }
console.log(filters)
    return (
        <View style={styles.container}>
            <Text style={styles.filterName}>Giá</Text>
            <View style={styles.filterItemCtn}>
                {filterItems.map(item => {
                    return (
                        <FilterItem key={item.id} type={FILTER_TYPE_PRICE}
                            value={{
                                range: item.range,
                                operator: item.operator, 
                                name: item.name,
                                id: item.id
                            }}
                            name={item.name}></FilterItem>
                    )
                })}
            </View>
        </View>
    )
}

const mapStateToProps = state => {
    return {
        filters: state.filters
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeFilter: (type, value) => {
            dispatch(changeFilter(type, value));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceFilter);