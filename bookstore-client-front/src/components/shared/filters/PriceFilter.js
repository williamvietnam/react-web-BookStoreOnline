import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { changeFilter } from '../../../redux/actions/filtersActions';
import { FILTER_TYPE_PRICE} from '../../../constants';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

function CommonFilter(props) {

    const {  filters, changeFilter } = props;
    const filterItems = [{
        range: [50000],
        id: '1',
        operator: 'lt',
        name: (<div style={{display: 'flex'}}>Dưới &nbsp;<NumberFormat value={50000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    },{
        range: [50000,100000],
        id: '2',
        operator: 'between',
        name: (<div style={{display: 'flex'}}>Từ &nbsp;<NumberFormat value={50000} displayType={'text'}
        suffix="đ" thousandSeparator={true} />&nbsp; - &nbsp;<NumberFormat value={100000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    },{
        range: [100000,200000],
        id: '4',
        operator: 'between',
        name: (<div style={{display: 'flex'}}>Từ &nbsp;<NumberFormat value={100000} displayType={'text'}
        suffix="đ" thousandSeparator={true} />&nbsp; - &nbsp;<NumberFormat value={200000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    },{
        range: [200000,300000],
        id: '5',
        operator: 'between',
        name: (<div style={{display: 'flex'}}>Từ &nbsp;<NumberFormat value={200000} displayType={'text'}
        suffix="đ" thousandSeparator={true} />&nbsp; - &nbsp;<NumberFormat value={300000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    },{
        range: [300000,400000],
        id: '6',
        operator: 'between',
        name: (<div style={{display: 'flex'}}>Từ &nbsp;<NumberFormat value={300000} displayType={'text'}
        suffix="đ" thousandSeparator={true} />&nbsp; - &nbsp;<NumberFormat value={400000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    },{
        range: [400000,500000],
        id: '7',
        operator: 'between',
        name: (<div style={{display: 'flex'}}>Từ &nbsp;<NumberFormat value={400000} displayType={'text'}
        suffix="đ" thousandSeparator={true} />&nbsp; - &nbsp;<NumberFormat value={500000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    },{
        range: [500000,1000000],
        id: '8',
        operator: 'between',
        name: (<div style={{display: 'flex'}}>Từ &nbsp;<NumberFormat value={500000} displayType={'text'}
        suffix="đ" thousandSeparator={true} />&nbsp; - &nbsp;<NumberFormat value={1000000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    },{
        range: [1000000],
        id: '9',
        operator: 'gt',
        name: (<div style={{display: 'flex'}}>Trên &nbsp;<NumberFormat value={1000000} displayType={'text'}
        suffix="đ" thousandSeparator={true} /></div>)
    }]
    const isFilterActive = (range) => {
        if (_.isEqual(range,filters.price?filters.price.range:[])) return true;

    }

    return (<aside className={`wedget__categories pro--range poroduct--cat`}>
        <h3 className="wedget__title">Giá</h3>
        <ul>
            {filterItems.map(item => {
                return (<li key={item.id} onClick={() => changeFilter(FILTER_TYPE_PRICE, {range: item.range,
                 operator: item.operator,id: item.id})}>
                    <a className={isFilterActive(item.range) && "active"}>{item.name}</a>
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