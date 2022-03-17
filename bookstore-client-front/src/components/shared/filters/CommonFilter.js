import React from 'react';
import { connect } from 'react-redux';
import { changeFilter } from '../../../redux/actions/filtersActions';
import { FILTER_TYPE_CAT, FILTER_TYPE_AUTHOR, FILTER_TYPE_PRICE, FILTER_TYPE_PUBLISHER } from '../../../constants';

function CommonFilter(props) {

    const { filterItems, filterType, filterName, filters, changeFilter } = props;
    const isFilterActive = (id) => {
        switch (filterType) {
            case FILTER_TYPE_CAT:
                if (id === filters.category) return true;
            case FILTER_TYPE_AUTHOR:
                if (id === filters.author) return true;
            case FILTER_TYPE_PRICE:
                if (id === filters.price) return true;
            case FILTER_TYPE_PUBLISHER:
                if (id === filters.publisher) return true;
        }
    }

    return (<aside className={`wedget__categories ${filterType}`}>
        <h3 className="wedget__title">{filterName}</h3>
        <ul>
            {filterItems.map(item => {
                return (<li key={item.id} onClick={() => changeFilter(filterType, item.id)}>
                    <a className={isFilterActive(item.id)&&"active"}>{item.name || item.pseudonym} <span>{filterType!==FILTER_TYPE_PRICE&&`(${item.books.length})`}</span></a>
                </li>)
            })}
        </ul>
    </aside>)
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

export default connect(mapStateToProps, mapDispatchToProps)(CommonFilter);